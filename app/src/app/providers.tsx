"use client"

import { ThemeProvider } from "next-themes"
import { FC, ReactNode } from "react"
import { WagmiProvider } from "@privy-io/wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
import Connect from "@/components/custom/connect"
import { privyConfig } from "@/lib/privy"
import { PrivyProvider } from "@privy-io/react-auth"

const queryClient = new QueryClient()

const Providers: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <PrivyProvider appId="cm3jtejit00evqwoesmmnw8mq" config={privyConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <Connect>{children}</Connect>
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ThemeProvider>
  )
}

export default Providers
