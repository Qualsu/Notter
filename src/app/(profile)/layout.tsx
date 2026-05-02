import type { Metadata } from 'next'
import { Navbar } from '../(landing)/_components/navbar'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Страницы профилей пользователей и организаций',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        {children}
    </main>
  )
}
