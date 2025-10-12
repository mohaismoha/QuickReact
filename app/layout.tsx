import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickReact - Reaction Time Game",
  description: "Test your reaction time and earn QRP tokens on Farcaster",
  openGraph: {
    title: "QuickReact",
    description: "Test your reaction time and earn QRP tokens",
    images: ["/preview.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
