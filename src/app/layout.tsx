import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import ConvexClientProvider from '@/components/providers/convex-provider'
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from '@/components/providers/modal-provider'
import { EdgeStoreProvider } from '@/lib/edgestore'

const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notter',
  description: "Новый уровень построения задач. Встречайте Notter",
  manifest: '/manifest.json',
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
      <body className={font.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  color: 'black',
                  background: 'white',
                  fontSize: '13px',
                  borderRadius: '5px',
                },
                iconTheme: {
                  primary: 'black',
                  secondary: 'white',
                },
              }}
              />
              <ModalProvider/>
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
