import type { Metadata } from "next"
import "@/styles/globals.css"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "FanHub",
  description: "E2E encrypted chat with token gated group chats.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
