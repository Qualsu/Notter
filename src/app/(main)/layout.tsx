"use client"

import { useConvexAuth } from "convex/react"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import { Navigation } from "./_components/navigation"
import { pages } from "@/config/routing/pages.route"
import { RequestProvider } from "@/components/providers/request-provider"

const ModalProvider = dynamic(
  () => import("@/components/providers/modal-provider").then((mod) => mod.ModalProvider),
  { ssr: false }
)

const SearchCommand = dynamic(
  () => import("@/components/search-command").then((mod) => mod.SearchCommand),
  { ssr: false }
)

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const params = useParams()
    const router = useRouter()
    const isDocumentPage = Boolean(params.documentId)

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace(pages.AUTH)
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin"/>
            </div>
        )
    }
    
    if(!isAuthenticated){
      return (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="animate-spin"/>
        </div>
      )
    }

    return (
      <>
        <title>Dashboard</title>
        <RequestProvider>
          <ModalProvider/>
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
        </RequestProvider>
      </>
    )
  }
