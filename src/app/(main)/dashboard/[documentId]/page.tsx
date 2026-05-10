"use client" 

import { use } from "react"
import dynamic from "next/dynamic" 

import { Skeleton } from "@/components/ui/skeleton" 

import { useMutation, useQuery } from "convex/react" 
import { Id } from "../../../../../convex/_generated/dataModel" 
import { api } from "../../../../../convex/_generated/api" 
import { Toolbar } from "@/components/toolbar" 
import { Cover } from "@/components/cover" 
import { useOrganization, useUser } from "@clerk/nextjs"
import type { DashboardDocumentIdPageProps as DocumentIdPageProps } from "@/config/types/main.types";
import Error404 from "@/app/not-found"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

export default function DocumentIdPage({ params }: DocumentIdPageProps){
  const { documentId } = use(params)
  
  const { user } = useUser()
  const { organization } = useOrganization()
  const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string

  const document = useQuery(api.document.getById, {
    documentId,
    userId: orgId
  })

  const update = useMutation(api.document.update) 
  
  const onChange = (content: string) => {
    update({
      id: documentId,
      content,
      userId: orgId,
      lastEditor: user?.username as string
    }) 
  } 

  if (document === undefined) {
    return (
      <div className="pt-14">
        <Cover.Skeleton />
        <div className="mx-auto mt-10 px-4 md:max-w-3xl lg:max-w-4xl">
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

  if (document === null) {
    return <Error404 />
  }

  return (
    <div className="relative pb-40 pt-14 overflow-hidden">
      <div className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-logo-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-12 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />
      <Cover url={document.coverImage} preview={document.isAcrhived ? true : false}/>
      <div className={`relative z-10 mx-auto px-4 md:max-w-3xl lg:max-w-4xl rounded-3xl border bg-white/70 border-white/40 dark:border-white/10 dark:bg-zinc-950/70 pb-6 ${document.coverImage && 'mt-6'}`}>
        <Toolbar initialData={document} preview={document.isAcrhived ? true : false}/>
        <Editor onChange={onChange} initialContent={document.content} editable={document.isAcrhived ? false : true} documentId={document._id}/>
      </div>
    </div>
  ) 
} 
