import type { PrivyClientConfig } from "@privy-io/react-auth"

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ["wallet", "email", "sms"],
  appearance: {
    showWalletLoginFirst: true,
  },
}
