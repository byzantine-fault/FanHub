import { useChainId } from "wagmi"
import { readContract, writeContract } from "wagmi/actions"
import { MESSAGING_CONTRACT } from "@/lib/contracts"
import { config } from "@/lib/wagmi"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface CheckGroupAccessParams {
  auth: SignIn | undefined
  groupId: string
  address: `0x${string}` | undefined
}

export function useCheckGroupAccess({
  auth,
  groupId,
  address,
}: CheckGroupAccessParams) {
  const chainId = useChainId()
  const contract = MESSAGING_CONTRACT[chainId]

  const {
    data: isMember,
    isLoading: membershipLoading,
    refetch: refetchMembership,
  } = useQuery({
    queryKey: ["groupMember", groupId, address],
    queryFn: async () => {
      if (!address) return false
      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "isGroupMember",
        args: [Number(groupId), address],
      })
      return result as boolean
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: !!address && !!groupId,
  })

  const {
    data: isPending,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["groupPending", groupId, address],
    queryFn: async () => {
      if (!address) return false
      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "isPendingMember",
        args: [Number(groupId), address],
      })
      return result as boolean
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: !!address && !!groupId,
  })

  const requestAccess = useMutation({
    mutationFn: async () => {
      if (!auth) throw new Error("Not authenticated")
      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "requestToJoinGroup",
        args: [auth, Number(groupId)],
      })
      if (!result) throw new Error("Failed to request group access")
      return result
    },
    onError: (error: Error) => {
      console.error("Request access error:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("User denied transaction signature.")
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Access request sent successfully!")
    },
  })

  const { data: pendingMembers, refetch: refetchPendingMembers } = useQuery({
    queryKey: ["pendingMembers", groupId],
    queryFn: async () => {
      const result = await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getPendingMembers",
        args: [Number(groupId)],
      })
      return result as `0x${string}`[]
    },
    enabled: !!groupId,
  })

  const acceptMember = useMutation({
    mutationFn: async (memberAddress: string) => {
      if (!auth) throw new Error("인증되지 않았습니다")
      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "addGroupMember",
        args: [Number(groupId), memberAddress],
      })
      if (!result) throw new Error("멤버 추가에 실패했습니다")
      return result
    },
    onError: (error: Error) => {
      console.error("멤버 추가 에러:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("트랜잭션 서명이 거부되었습니다.")
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("멤버가 성공적으로 추가되었습니다!")
    },
  })

  const { data: isOwner, refetch: refetchOwner } = useQuery({
    queryKey: ["isGroupOwner", groupId],
    queryFn: async () => {
      if (!address) return false

      const result = (await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getGroupDetails",
        args: [Number(groupId)],
      })) as any

      // 그룹 생성자는 첫 번째 멤버
      return result[1][0] === address
    },
    enabled: !!groupId && !!address,
  })

  const removeMember = useMutation({
    mutationFn: async (memberAddress: string) => {
      if (!auth) throw new Error("인증되지 않았습니다")
      const result = await writeContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "removeGroupMember",
        args: [Number(groupId), memberAddress],
      })
      if (!result) throw new Error("멤버 제거에 실패했습니다")
      return result
    },
    onError: (error: Error) => {
      console.error("멤버 제거 에러:", error)
      if (error.message.includes("User rejected the request"))
        return toast.error("트랜잭션 서명이 거부되었습니다.")
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("멤버가 성공적으로 제거되었습니다!")
    },
  })

  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => {
      if (!groupId) return []

      const result = (await readContract(config, {
        address: contract.address,
        abi: contract.abi,
        functionName: "getGroupDetails",
        args: [Number(groupId)],
      })) as any

      return result[1] as `0x${string}`[]
    },
    enabled: !!groupId,
  })

  return {
    isMember,
    isPending,
    isLoading: membershipLoading || pendingLoading,
    requestAccess,
    pendingMembers,
    acceptMember,
    isOwner,
    removeMember,
    members,
    refetchMembership,
    refetchPending,
    refetchPendingMembers,
    refetchOwner,
    refetchMembers,
  }
}
