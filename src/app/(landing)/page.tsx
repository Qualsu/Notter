"use client"

import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { About } from "./_components/about";
import { Premium } from "./_components/premium";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Landing() {
  const { isLoading } = useConvexAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading])

  if (!isReady) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10 m-0 p-0">
          
          <div className="flex flex-row gap-10">
            <div className="flex justify-start flex-col gap-2">
              <Skeleton className="h-40 sm:h-56 md:h-72 w-full max-w-[500px]" />
              <Skeleton className="h-6 sm:h-7 md:h-8 w-48 sm:w-80 md:w-[600px]" />
              <Skeleton className="h-8 sm:h-10 md:h-12 w-24 sm:w-28 md:w-36" />
            </div>

            <Skeleton className="h-96 w-96" />
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-y-10">
            <Skeleton className="h-[400px] md:h-[250px] w-full max-w-[1000px]" />
            <Skeleton className="h-[400px] md:h-[250px] w-full max-w-[1000px]" />
            <Skeleton className="h-[400px] md:h-[250px] w-full max-w-[1000px]" />
            <Skeleton className="h-[400px] md:h-[250px] w-full max-w-[1000px]" />
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
