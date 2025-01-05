"use client"

import { redirect } from "next/navigation";
import { useOrigin } from "../../../hooks/use-origin";
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { About } from "./_components/about";
import Editor from "@/components/editor";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Arrow } from "./_components/arrow";

export default function Landing() {

  const origin = useOrigin()

  if(origin === "https://notter.site" || origin === "http://nttr.pw"){
    redirect("https://notter.tech")
  }

  const content = useQuery(api.document.getTestPage)

  if (content === undefined || content === null) {
    return (
      <div></div>
    ) 
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10 m-0 p-0">
        <Heading/>
        <div className="relative">
          <div className="absolute w-20 h-20 bg-gray-400 rounded-lg z-[-99] top-12 right-[450px] -rotate-12 shadow-md"/>
          <div className="absolute w-16 h-16 bg-gray-400 rounded-lg z-[-98] top-48 left-[450px] rotate-12 shadow-md"/>
          <div className="absolute w-36 h-36 bg-yellow-400 rounded-xl z-[-99] top-56 left-[450px] -rotate-12 shadow-md"/>
          <div className="absolute w-32 h-32 bg-yellow-400 rounded-lg z-[-99] top-[400px] right-[450px] rotate-12 shadow-md"/>
          <div className="absolute w-20 h-20 bg-gray-400 rounded-sm z-[-99] top-[750px] left-[450px] -rotate-6 shadow-md"/>
          <div className="absolute w-20 h-20 bg-yellow-400 rounded-lg z-[-99] top-[780px] right-[450px] rotate-6 shadow-md"/>
          <div className="absolute w-24 h-24 bg-gray-400 rounded-lg z-[-99] top-[820px] right-[420px] -rotate-6 shadow-md"/>
          <div className="absolute w-32 h-32 bg-yellow-400 rounded-lg z-[-99] top-[1000px] left-[420px] -rotate-12 shadow-md"/>
          <div className="absolute w-28 h-28 bg-gray-400 rounded-xl z-[-99] top-[1100px] right-[420px] rotate-6 shadow-md"/>
        </div>
        <About/>
      </div>
      <Footer/>
    </div>
  )
}
