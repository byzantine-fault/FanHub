import { useSignIn } from "@/hooks/auth/use-signin"
import { FC } from "react"
import { Button } from "../../ui/button"

import WarningIcon from "@/icons/warning-icon"
import Loading from "./loading"
import { useWallets } from "@privy-io/react-auth"

const SignIn: FC = () => {
  const { wallets } = useWallets()
  const wallet = wallets[0]
  const { mutateAsync, isPending, isSuccess } = useSignIn()

  const handleSignIn = async () => {
    try {
      const signInData = await mutateAsync()
      localStorage.setItem(
        `lastSignIn_${wallet.address}`,
        JSON.stringify(signInData)
      )
    } catch (error) {
      console.error("Sign-in failed:", error)
    }
  }

  if (isPending || isSuccess) return <Loading />

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-move-to-top">
        <WarningIcon />
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-center mx-12 text-sm text-muted-foreground">
          Sign-in session expired. Sign this message to prove you own this
          wallet and proceed.
        </p>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-delayed w-full px-6 flex justify-center">
        <Button
          className="h-12 rounded-full max-w-lg w-full"
          onClick={handleSignIn}
          disabled={isPending}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default SignIn
