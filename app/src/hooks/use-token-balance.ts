import { erc20Abi } from "viem"
import { readContract } from "wagmi/actions"
import { config } from "@/lib/wagmi"
import { useQuery } from "@tanstack/react-query"

export const useTokenBalance = (
  tokenAddress: string | undefined,
  userAddress: string | undefined
) => {
  const queryKey = ["tokenBalance", tokenAddress, userAddress]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!tokenAddress || !userAddress) {
        return BigInt(0)
      }

      try {
        const result = await readContract(config, {
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [userAddress as `0x${string}`],
        })

        return result
      } catch (error) {
        console.error("Failed to fetch token balance:", error)
        return BigInt(0)
      }
    },
    enabled: tokenAddress != null && userAddress != null,
  })
}
