"use client"

import { useConvexAuth } from "convex/react"
import { Loader2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { Navigation } from "./_components/navigation"
import { SearchCommand } from "@/components/search-command"
import { useEffect } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const router = useRouter()
    const { user } = useUser()
    const { organization } = useOrganization()
    const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string
    
    useEffect(() => {
      if (!isLoading && isAuthenticated || orgId !== user?.id || orgId !== organization?.id) {
          router.push("/dashboard")
      }
    }, [isLoading, isAuthenticated, router, orgId, user, organization])

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
      <div className="h-full flex">
        <Navigation/>
        <main className="flex-1 h-full overflow-y-auto">
            <SearchCommand/>
            {children}
        </main>
      </div>
    )
  }