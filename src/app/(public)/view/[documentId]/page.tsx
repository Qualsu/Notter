"use client" 

import dynamic from "next/dynamic" 
import { useMemo } from "react" 

import { Skeleton } from "@/components/ui/skeleton" 

import { useQuery } from "convex/react" 
import { Id } from "../../../../../convex/_generated/dataModel" 
import { api } from "../../../../../convex/_generated/api" 
import { Toolbar } from "@/components/toolbar" 
import { Cover } from "@/components/cover" 
import Error404 from "@/app/errorPage"
import { Separator } from "@/components/ui/separator"

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents"> 
  } 
}

export default function DocumentIdPage({ params }: DocumentIdPageProps){
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  )

  const document = useQuery(api.document.getById, {
    documentId: params.documentId
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

  if(!document?.isPublished || document === null){
    return <Error404/>
  }

  return (
    <div>
      <Cover url={document.coverImage} preview/>
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} preview/>
        <Editor onChange={() => {}} initialContent={document.content} editable={false}/>
        <Separator/>
      </div>
      <footer className="pb-1">
          <p className="text-center my-5 text-primary/30">
            Заметка создана в 
            <a className="ml-1 opacity-50 hover:opacity-100 hover:underline" href="https://notter.tech">
              <span className="text-yellow-300">N</span><span className="text-zinc-300">otter</span>
            </a>
          </p>
      </footer>
    </div>
  ) 
} 