import { Abi } from "viem"

export const ABI: Abi = [
  {
    inputs: [
      {
        internalType: "bytes21",
        name: "_roflAppID",
        type: "bytes21",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyGroupMember",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyPending",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotMessageSelf",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotRemoveSelf",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyGroupName",
    type: "error",
  },
  {
    inputs: [],
    name: "GroupDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMemberAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRecipient",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRequiredAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSignIn",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NotGroupMember",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPendingMember",
    type: "error",
  },
  {
    inputs: [],
    name: "RoflOriginNotAuthorizedForApp",
    type: "error",
  },
  {
    inputs: [],
    name: "SignInExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "SubcallError",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "DirectMessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "GroupCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "requester",
        type: "address",
      },
    ],
    name: "GroupJoinRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "GroupMessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newMember",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "addedBy",
        type: "address",
      },
    ],
    name: "MemberAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "removedMember",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "removedBy",
        type: "address",
      },
    ],
    name: "MemberRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EIP712_DOMAIN_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SIGNIN_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "newMember",
        type: "address",
      },
    ],
    name: "addGroupMember",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "requiredAmount",
        type: "uint256",
      },
    ],
    name: "createGroup",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllGroups",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "groupId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "requiredAmount",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.GroupCriteria",
            name: "criteria",
            type: "tuple",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        internalType: "struct IMessaging.Group[]",
        name: "activeGroups",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPendingMemberships",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "groupId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "member",
            type: "address",
          },
        ],
        internalType: "struct IMessaging.PendingMembership[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
    ],
    name: "getDirectMessageContacts",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "otherUser",
        type: "address",
      },
    ],
    name: "getDirectMessages",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct IMessaging.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
    ],
    name: "getGroupDetails",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "members",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
    ],
    name: "getGroupMessages",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct IMessaging.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
    ],
    name: "getPendingMembers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
    ],
    name: "getUserGroups",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserGroupsByAddress",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isGroupMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isPendingMember",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "memberToRemove",
        type: "address",
      },
    ],
    name: "removeGroupMember",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
    ],
    name: "requestToJoinGroup",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "roflAppID",
    outputs: [
      {
        internalType: "bytes21",
        name: "",
        type: "bytes21",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "sendDirectMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "time",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "v",
                type: "uint256",
              },
            ],
            internalType: "struct IMessaging.EIP712Signature",
            name: "rsv",
            type: "tuple",
          },
        ],
        internalType: "struct IMessaging.SignIn",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
    ],
    name: "sendGroupMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]
