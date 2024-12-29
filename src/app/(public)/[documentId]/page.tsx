"use client" 

import dynamic from "next/dynamic" 
import { useEffect, useMemo, useState } from "react" 

import { Skeleton } from "@/components/ui/skeleton" 

import { useMutation, useQuery } from "convex/react" 
import { Toolbar } from "@/components/toolbar" 
import { Cover } from "@/components/cover" 
import { redirect } from "next/navigation"
import { api } from "../../../../convex/_generated/api"
import { useOrigin } from "../../../../hooks/use-origin"
import Error404 from "@/app/errorPage"
import { Id } from "../../../../convex/_generated/dataModel"

interface DocumentIdPageProps {
  params: {
    documentId: string
  } 
}

export default function DocumentIdPage({ params }: DocumentIdPageProps){
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  ) 

  const origin = useOrigin()
      
  // if(origin !== "https://nttr.pw"){
  //     redirect("https://notter.tech")
  // }

  const document = useQuery(api.document.getByShortId, {
    shortId: params.documentId
  })

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    ) 
  }

  if(!document.isPublished || document === null){
    return <Error404/>
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} preview/>
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} preview/>
        <Editor onChange={() => {}} initialContent={document.content} editable={false}/>
      </div>
    </div>
  ) 
} 