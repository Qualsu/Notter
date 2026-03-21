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
          <Skeleton className="h-40 sm:h-56 md:h-72 w-full max-w-[500px]" />
          <Skeleton className="h-6 sm:h-7 md:h-8 w-48 sm:w-80 md:w-[600px]" />
          <Skeleton className="h-8 sm:h-10 md:h-12 w-24 sm:w-28 md:w-36" />
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
        <Heading/>
        <div className="relative">
          <div className="absolute w-20 h-20 bg-logo-light-yellow rounded-lg z-[-99] top-12 right-[280px] lg:right-[450px] md:right-[370px] -rotate-12 shadow-md "/>
          <div className="absolute w-16 h-16 bg-logo-light-yellow rounded-lg z-[-98] top-48 left-[280px] lg:left-[450px] md:left-[370px] rotate-12 shadow-md "/>
          <div className="absolute w-36 h-36 bg-yellow-400 rounded-xl z-[-99] top-56 left-[280px] lg:left-[450px] md:left-[370px] -rotate-12 shadow-md "/>
          <div className="absolute w-32 h-32 bg-yellow-400 rounded-lg z-[-99] top-[400px] right-[280px] lg:right-[450px] md:right-[370px] rotate-12 shadow-md "/>
          <div className="absolute w-20 h-20 bg-logo-light-yellow rounded-sm z-[-99] top-[750px] left-[280px] lg:left-[450px] md:left-[370px] rotate-6 shadow-md "/>
          <div className="absolute w-20 h-20 bg-yellow-400 rounded-lg z-[-99] top-[780px] right-[270px] lg:right-[430px] md:right-[360px] rotate-6 shadow-md "/>
          <div className="absolute w-24 h-24 bg-logo-light-yellow rounded-lg z-[-99] top-[820px] right-[280px] lg:right-[450px] md:right-[370px] -rotate-6 shadow-md "/>
          <div className="absolute w-32 h-32 bg-yellow-400 rounded-lg z-[-99] top-[1000px] left-[280px] lg:left-[450px] md:left-[370px] -rotate-12 shadow-md "/>
          <div className="absolute w-28 h-28 bg-logo-light-yellow rounded-xl z-[-99] top-[1100px] right-[280px] lg:right-[450px] md:right-[370px] rotate-6 shadow-md "/>
        </div>
        <About/>
        <Premium/>
      </div>
      <Footer/>
    </div>
  )
}
