"use client"

import { useConvexAuth } from "convex/react"
import { Loader2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { Navigation } from "./_components/navigation"
import { SearchCommand } from "@/components/search-command"
import { useEffect } from "react"

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const router = useRouter()
    
    useEffect(() => {
      if (!isLoading && isAuthenticated) {
          router.push("/dashboard")
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
        return redirect("/auth/sign-in")
    }

    return (
      <>
        <title>Dashboard</title>
        <div className="h-full flex overflow-hidden">
          <Navigation/>
          <main className="flex-1 h-full overflow-y-auto">
              <SearchCommand/>
              {children}
          </main>
        </div>
      </>
    )
  }