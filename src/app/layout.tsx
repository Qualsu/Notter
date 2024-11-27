import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import ConvexClientProvider from '@/components/providers/convex-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notter',
  description: 'Notter by Qualsu',
  icons: {
    icon: "https://combative-moose-852.convex.site/getImage?storageId=kg20r77k2jdafrwmw8am9tseb575dp7c"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
