"use client"

import { useConvexAuth } from "convex/react"
import { Loader2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { Navigation } from "./_components/navigation"
import { SearchCommand } from "@/components/search-command"
import { useEffect } from "react"
import { pages } from "@/config/routing/pages.route"
import { useParams } from "next/navigation"

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const router = useRouter()
    const params = useParams()
    const isDocumentPage = Boolean(params.documentId)
    
    useEffect(() => {
      if (!isLoading && isAuthenticated) {
          router.push(pages.DASHBOARD())
      }
    }, [isLoading, isAuthenticated, router])

    if (isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin"/>
            </div>
        )
    }
    
    if(!isAuthenticated){
      return redirect(pages.AUTH)
    }

    return (
      <>
        <title>Dashboard</title>
        <div className="relative h-full flex overflow-hidden bg-gradient-to-br from-background via-background to-logo-yellow/10 dark:to-logo-cyan/10">
          {!isDocumentPage && (
            <>
              <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-logo-light-yellow/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />
            </>
          )}
          <Navigation/>
          <main className="relative z-10 flex-1 h-full overflow-y-auto">
              <SearchCommand/>
              {children}
          </main>
        </div>
      </>
    )
  }