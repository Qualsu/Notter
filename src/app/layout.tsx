import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import ConvexClientProvider from '@/components/providers/convex-provider'
import { Toaster } from 'react-hot-toast';
import { images } from '@/config/routing/image.route'

const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notter',
  description: "Новый уровень построения задач. Встречайте Notter",
  manifest: images.MANIFEST,
  icons: {
    icon: images.IMAGE.ICON,
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
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
