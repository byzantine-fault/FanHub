// DO NOT USE THIS CONTRACT IN PRODUCTION
// THIS CONTRACT IS FOR DEMONSTRATION PURPOSES ONLY

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./interfaces/IMessaging.sol";
import "./interfaces/IErrors.sol";

contract Messaging is IMessaging, IErrors {
    /// @notice The ROFL app ID
    bytes21 public roflAppID;

    /// @notice Counter for generating unique group IDs
    uint256 private nextGroupId = 1;

    /// @notice Stores all active group IDs
    uint256[] private allGroupIds;

    /// @notice Stores direct messages between two users
    /// @dev Maps sender => receiver => array of messages
    mapping(address => mapping(address => Message[])) private directMessages;

    /// @notice Stores group information
    /// @dev Maps groupId => Group struct
    mapping(uint256 => Group) private groups;

    /// @notice Stores messages for each group
    /// @dev Maps groupId => array of messages
    mapping(uint256 => Message[]) private groupMessages;

    /// @notice Tracks which groups a user is a member of
    /// @dev Maps user address => array of groupIds
    mapping(address => uint256[]) private userGroups;

    /// @notice Stores addresses that the caller has exchanged messages with
    /// @dev Maps user address => array of addresses
    mapping(address => address[]) private userContacts;

    /// @notice Tracks whether a user has exchanged messages with another user
    /// @dev Maps user address => mapping of addresses => bool
    mapping(address => mapping(address => bool)) private isContact;

    /// @notice Pending members for a group
    /// @dev Maps groupId => array of pending member addresses
    mapping(uint256 => address[]) private pendingMembers;

    /// @notice Modified addGroupMember to remove from pending list
    mapping(uint256 => mapping(address => bool)) private isPending;

    bytes32 public constant EIP712_DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );
    bytes32 public constant SIGNIN_TYPEHASH =
        keccak256("SignIn(address user,uint32 time)");
    bytes32 public immutable DOMAIN_SEPARATOR;

    constructor(bytes21 _roflAppID) {
        roflAppID = _roflAppID;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256("Messaging"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    /// @notice Ensures that the caller is authenticated using an EIP-712 signature
    /// @param _auth The SignIn struct containing user address, timestamp, and signature
    modifier authenticated(SignIn calldata _auth) {
        if (_auth.time + 1 days <= block.timestamp) revert SignInExpired();
        if (_auth.user != _recoverSigner(_auth)) revert InvalidSignIn();
        _;
    }

    /// @notice Recovers the signer's address from the EIP-712 signature
    /// @param _auth The SignIn struct containing the signature
    /// @return The recovered signer's address
    function _recoverSigner(
        SignIn calldata _auth
    ) private view returns (address) {
        bytes32 authdataDigest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(SIGNIN_TYPEHASH, _auth.user, _auth.time))
            )
        );

        return
            ecrecover(
                authdataDigest,
                uint8(_auth.rsv.v),
                _auth.rsv.r,
                _auth.rsv.s
            );
    }

    /// @notice Sends a direct message to another user
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param to The recipient's address
    /// @param content The message content
    /// @dev Emits DirectMessageSent event
    function sendDirectMessage(
        SignIn calldata auth,
        address to,
        string calldata content
    ) external authenticated(auth) {
        if (to == address(0)) revert InvalidRecipient();
        if (to == auth.user) revert CannotMessageSelf();

        Message memory newMessage = Message({
            sender: auth.user,
            content: content,
            timestamp: block.timestamp
        });

        (address addr1, address addr2) = _getMessageKey(auth.user, to);
        directMessages[addr1][addr2].push(newMessage);

        // Add contact tracking
        if (!isContact[auth.user][to]) {
            userContacts[auth.user].push(to);
            isContact[auth.user][to] = true;
        }
        if (!isContact[to][auth.user]) {
            userContacts[to].push(auth.user);
            isContact[to][auth.user] = true;
        }

        emit DirectMessageSent(auth.user, to, content);
    }

    /// @notice Creates a new group with access criteria
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param name The name of the group
    /// @param chainId The chain ID where token balance will be checked
    /// @param tokenAddress The address of the token contract
    /// @param requiredAmount The minimum amount of tokens required
    /// @return groupId The ID of the newly created group
    /// @dev Emits GroupCreated event
    function createGroup(
        SignIn calldata auth,
        string calldata name,
        uint256 chainId,
        address tokenAddress,
        uint256 requiredAmount
    ) external authenticated(auth) returns (uint256) {
        if (bytes(name).length == 0) revert EmptyGroupName();
        if (tokenAddress == address(0)) revert InvalidTokenAddress();
        if (requiredAmount == 0) revert InvalidRequiredAmount();

        address[] memory members = new address[](1);
        members[0] = auth.user;
        userGroups[auth.user].push(nextGroupId);

        uint256 groupId = nextGroupId++;
        allGroupIds.push(groupId);

        groups[groupId] = Group({
            groupId: groupId,
            name: name,
            members: members,
            criteria: GroupCriteria({
                chainId: chainId,
                tokenAddress: tokenAddress,
                requiredAmount: requiredAmount
            }),
            exists: true
        });

        emit GroupCreated(groupId, name, auth.user);
        return groupId;
    }

    /// @notice Sends a message to a group
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param groupId The ID of the target group
    /// @param content The message content
    /// @dev Only group members can send messages
    /// @dev Emits GroupMessageSent event
    function sendGroupMessage(
        SignIn calldata auth,
        uint256 groupId,
        string calldata content
    ) external authenticated(auth) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, auth.user)) revert NotGroupMember();

        Message memory newMessage = Message({
            sender: auth.user,
            content: content,
            timestamp: block.timestamp
        });

        groupMessages[groupId].push(newMessage);

        emit GroupMessageSent(groupId, auth.user, content);
    }

    /// @notice Request to join a group
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param groupId The ID of the group to join
    /// @dev Emits GroupJoinRequested event
    /// @dev Adds caller to pending members list
    function requestToJoinGroup(
        SignIn calldata auth,
        uint256 groupId
    ) external authenticated(auth) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (isGroupMember(groupId, auth.user)) revert AlreadyGroupMember();
        if (isPending[groupId][auth.user]) revert AlreadyPending();

        pendingMembers[groupId].push(auth.user);
        isPending[groupId][auth.user] = true;

        emit GroupJoinRequested(groupId, auth.user);
    }

    /// @notice Adds a new member to an existing group
    /// @param groupId The ID of the group
    /// @param newMember The address of the new member
    /// @dev Only existing group members can add new members
    /// @dev Only the authorized ROFL app can submit
    /// @dev Emits MemberAdded event
    function addGroupMember(
        uint256 groupId,
        address newMember
    ) external {

        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (newMember == address(0)) revert InvalidMemberAddress();
        if (isGroupMember(groupId, newMember)) revert AlreadyGroupMember();
        if (!isPending[groupId][newMember]) revert NotPendingMember();

        // Remove from pending list
        _removePendingMember(groupId, newMember);

        // Add to group
        groups[groupId].members.push(newMember);
        userGroups[newMember].push(groupId);

        emit MemberAdded(groupId, newMember, msg.sender);
    }

    /// @notice Removes a member from an existing group
    /// @param groupId The ID of the group
    /// @param memberToRemove The address of the member to remove
    /// @dev Only existing group members can remove other members
    /// @dev Only the authorized ROFL app can submit
    /// @dev A member cannot remove themselves
    /// @dev Emits MemberRemoved event
    function removeGroupMember(
        uint256 groupId,
        address memberToRemove
    ) external {

        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, memberToRemove)) revert NotGroupMember();

        // Remove from members array
        address[] storage members = groups[groupId].members;
        uint256 membersLength = members.length;
        for (uint i = 0; i < membersLength; i++) {
            if (members[i] == memberToRemove) {
                members[i] = members[membersLength - 1];
                members.pop();
                break;
            }
        }

        // Remove from user's group list
        uint256[] storage userGroupList = userGroups[memberToRemove];
        uint256 groupsLength = userGroupList.length;
        for (uint i = 0; i < groupsLength; i++) {
            if (userGroupList[i] == groupId) {
                userGroupList[i] = userGroupList[groupsLength - 1];
                userGroupList.pop();
                break;
            }
        }

        emit MemberRemoved(groupId, memberToRemove, msg.sender);
    }

    /// @notice Retrieves direct messages between caller and another user
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param otherUser The address of the other user
    /// @return Array of Message structs
    function getDirectMessages(
        SignIn calldata auth,
        address otherUser
    ) external view authenticated(auth) returns (Message[] memory) {
        (address addr1, address addr2) = _getMessageKey(auth.user, otherUser);
        return directMessages[addr1][addr2];
    }

    /// @notice Retrieves messages for a specific group
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @param groupId The ID of the target group
    /// @return Array of Message structs
    /// @dev Only accessible by group members
    function getGroupMessages(
        SignIn calldata auth,
        uint256 groupId
    ) external view authenticated(auth) returns (Message[] memory) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        if (!isGroupMember(groupId, auth.user)) revert NotGroupMember();
        return groupMessages[groupId];
    }

    /// @notice Retrieves details about a specific group
    /// @param groupId The ID of the target group
    /// @return name The name of the group
    /// @return members Array of addresses of group members
    function getGroupDetails(
        uint256 groupId
    ) external view returns (string memory name, address[] memory members) {
        if (!groups[groupId].exists) revert GroupDoesNotExist();
        return (groups[groupId].name, groups[groupId].members);
    }

    /// @notice Retrieves groups a user is a member of
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @return Array of group IDs
    function getUserGroups(
        SignIn calldata auth
    ) external view authenticated(auth) returns (uint256[] memory) {
        return userGroups[auth.user];
    }

    /// @notice Retrieves groups a specific user is a member of
    /// @param user The address of the user
    /// @return Array of group IDs
    function getUserGroupsByAddress(
        address user
    ) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    /// @notice Retrieves all addresses that the caller has exchanged messages with
    /// @param auth The SignIn struct containing user address, timestamp, and signature
    /// @return Array of addresses that the caller has DM history with
    function getDirectMessageContacts(
        SignIn calldata auth
    ) external view authenticated(auth) returns (address[] memory) {
        return userContacts[auth.user];
    }

    /// @notice Get all active groups and their requirements
    /// @return activeGroups Array of group info including ID, name, and criteria
    function getAllGroups()
        external
        view
        returns (Group[] memory activeGroups)
    {
        activeGroups = new Group[](allGroupIds.length);

        for (uint256 i = 0; i < allGroupIds.length; i++) {
            activeGroups[i] = groups[allGroupIds[i]];
        }

        return activeGroups;
    }

    /// @notice Get all pending memberships across all groups
    /// @return Array of PendingMembership structs containing groupId and member address
    function getAllPendingMemberships()
        external
        view
        returns (PendingMembership[] memory)
    {
        // First, count total pending memberships
        uint256 totalPending = 0;
        for (uint256 i = 0; i < allGroupIds.length; i++) {
            totalPending += pendingMembers[allGroupIds[i]].length;
        }

        // Initialize array with the total size
        PendingMembership[] memory allPending = new PendingMembership[](
            totalPending
        );

        // Fill array with data
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allGroupIds.length; i++) {
            uint256 groupId = allGroupIds[i];
            address[] memory pending = pendingMembers[groupId];

            for (uint256 j = 0; j < pending.length; j++) {
                allPending[currentIndex] = PendingMembership({
                    groupId: groupId,
                    member: pending[j]
                });
                currentIndex++;
            }
        }

        return allPending;
    }

    /// @notice Get all pending members for a group
    /// @param groupId The ID of the group
    /// @return Array of pending member addresses
    function getPendingMembers(
        uint256 groupId
    ) external view returns (address[] memory) {
        return pendingMembers[groupId];
    }

    /// @notice Checks if a user is pending for a group
    /// @param groupId The ID of the group
    /// @param user The address of the user
    /// @return bool True if the user is pending for the group, false otherwise
    function isPendingMember(
        uint256 groupId,
        address user
    ) external view returns (bool) {
        return isPending[groupId][user];
    }

    /// @notice Checks if a user is a member of a specific group
    /// @param groupId The ID of the target group
    /// @param user The address of the user
    /// @return bool True if the user is a member of the group, false otherwise
    function isGroupMember(
        uint256 groupId,
        address user
    ) public view returns (bool) {
        address[] memory members = groups[groupId].members;
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == user) {
                return true;
            }
        }
        return false;
    }

    /// @notice Helper function to get the key for direct messages
    /// @param addr1 The address of the first user
    /// @param addr2 The address of the second user
    /// @return The smaller address
    /// @return The larger address
    /// @dev Ensures consistent storage location regardless of message direction
    function _getMessageKey(
        address addr1,
        address addr2
    ) private pure returns (address, address) {
        return addr1 < addr2 ? (addr1, addr2) : (addr2, addr1);
    }

    /// @notice Internal function to remove a pending member
    /// @param groupId The ID of the group
    /// @param member The address of the member to remove
    /// @dev Updates both the pending mapping and array
    function _removePendingMember(uint256 groupId, address member) private {
        // Remove from pending mapping
        isPending[groupId][member] = false;

        // Remove from pending array
        address[] storage pending = pendingMembers[groupId];
        for (uint i = 0; i < pending.length; i++) {
            if (pending[i] == member) {
                pending[i] = pending[pending.length - 1];
                pending.pop();
                break;
            }
        }
    }
}
