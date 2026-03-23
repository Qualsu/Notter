"use client"

import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { About } from "./_components/about";
import { Premium } from "./_components/premium";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function Landing() {
  const { isLoading } = useConvexAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const redirectValue = localStorage.getItem("redirect")
    if (redirectValue === "true") {
      router.replace("/dashboard")
    }
    
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading, router])

  if (!isReady) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 pb-10 m-0 p-0 ">
          
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
            <div className="w-full max-w-2xl flex justify-start flex-col gap-2">
              <Skeleton className="h-40 sm:h-56 md:h-72 w-full" />
              <Skeleton className="h-6 sm:h-7 md:h-8 w-full max-w-[600px] mt-4" />
              <Skeleton className="h-8 sm:h-10 md:h-12 w-24 sm:w-28 md:w-36" />
            </div>

            <Skeleton className="h-64 w-full max-w-[340px] sm:h-80 sm:max-w-[420px] lg:h-96 lg:w-96" />
          </div>

          <div className="w-full max-w-[1050px] mx-auto px-4 sm:px-6">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/50 p-5 sm:p-6 py-6">
                  <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-4 sm:gap-5">
                    <Skeleton className="h-20 w-20 rounded-xl" />
                    <div className="space-y-2 w-full md:flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                      <Skeleton className="h-7 w-full max-w-56" />
                      <Skeleton className="h-4 w-full max-w-[640px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full max-w-6xl mx-auto p-6 flex justify-center items-center flex-col">
            <div className="w-full">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-end gap-2 sm:gap-3 mb-3">
                  <Skeleton className="h-10 sm:h-12 w-36 sm:w-48" />
                  <Skeleton className="h-10 sm:h-12 w-20 sm:w-28" />
                </div>
                <Skeleton className="h-4 w-full max-w-2xl mb-6" />

                <div className="flex items-center gap-3 sm:gap-4 mb-8">
                  <Skeleton className="h-9 w-24 sm:w-32 rounded-md" />
                  <Skeleton className="h-6 w-4" />
                  <Skeleton className="h-9 w-24 sm:w-32 rounded-md" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border/50 p-5 sm:p-6 min-h-[330px] flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-7 w-28" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-[92%]" />
                      <Skeleton className="h-3.5 w-[84%]" />
                      <Skeleton className="h-3.5 w-[74%]" />
                    </div>

                    <Skeleton className="h-9 w-full rounded-md mt-6" />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="grid grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 border-b border-border/50">
                  <Skeleton className="h-5 w-full max-w-44" />
                  <Skeleton className="h-5 w-full max-w-16" />
                  <Skeleton className="h-5 w-full max-w-16" />
                  <Skeleton className="h-5 w-full max-w-20" />
                </div>

                {Array.from({ length: 6 }).map((_, r) => (
                  <div key={r} className="grid grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 border-b border-border/40 last:border-b-0">
                    <Skeleton className="h-4 w-full max-w-52" />
                    <Skeleton className="h-4 w-full max-w-12" />
                    <Skeleton className="h-4 w-full max-w-16" />
                    <Skeleton className="h-4 w-full max-w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10 m-0 p-0">
        <div className="w-full max-w-6xl mx-auto relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-logo-yellow dark:bg-logo-light-yellow rounded-full filter blur-3xl opacity-30 -z-10" />
          <div className="absolute -bottom-36 -left-24 w-96 h-96 bg-logo-cyan rounded-full filter blur-3xl opacity-20 -z-10" />
          <Heading />
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <About />
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <Premium />
        </div>
      </div>
      <Footer/>
    </div>
  )
}
