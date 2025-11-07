"use client"

import dynamic from "next/dynamic"
import { useMemo, useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Toolbar } from "@/components/toolbar"
import { Cover } from "@/components/cover"
import Error404 from "@/app/errorPage"
import { Separator } from "@/components/ui/separator"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { Navbar } from "../../(landing)/_components/navbar"
import { getByUsername as getByOrgname } from "../../../../server/orgs/org"
import { getById, getByUsername } from "../../../../server/users/user"
import { Org } from "../../../../server/orgs/types"
import { User } from "../../../../server/users/types"
import { ModeratorPanel } from "./moderatorPanel"
import { useOrganization, useUser } from "@clerk/clerk-react"

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

interface UserInterface {
  name: string
  team: boolean
  logo: boolean
}

function Footer({ name, team, logo }: UserInterface){
    return (
        <footer className="mt-auto w-full">
            <Separator />
            <p className="text-center my-3 text-primary/30">
                Заметка создана {team ? 'командой' : ''} <a href={`/${team ? 'org' : 'profile'}/${name}`} className="hover:underline font-bold">{name} </a> 
                {logo && (
                  <>
                    <span>в</span>
                    <a className="ml-1 opacity-50 hover:opacity-100 hover:underline transition-opacity duration-300 font-bold" href="/">
                        <span className="text-yellow-300">N</span>
                        <span className="text-zinc-300">otter</span>
                    </a>
                  </>
                )}
            </p>
        </footer>
    )
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  )

  const isShort = params.documentId.length >= 4 && params.documentId.length <= 30

  const [profile, setProfile] = useState<User | Org | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const { user: clerkUser } = useUser()
  const { organization } = useOrganization()
  
  const document = useQuery(
    isShort
      ? api.document.getByShortId
      : api.document.getById,
    isShort
      ? { shortId: params.documentId }
      : {
          documentId: params.documentId as Id<"documents">,
          alwaysView: user?.moderator,
          userId: organization?.id ?? clerkUser?.id
        }
  )

  useEffect(() => {
    const fetchProfile = async () => {
      if (document?.creatorName) {
        const isOrg = document.userId.startsWith("org_")
        const profileData = isOrg 
          ? await getByOrgname(document.creatorName as string) 
          : await getByUsername(document.creatorName as string)
        
        setProfile(profileData)

        const userData = await getById(clerkUser?.id as string)
        setUser(userData)
      }
    }

    if (document?.creatorName) {
      fetchProfile()
    }
  }, [document, clerkUser])

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

  if ((!document?.isPublished && user?.moderator !== true)|| document === null || (isShort && !document.isShort && user?.moderator !== true)) {
    return (
      <>
        <title>Not Found</title>
        <Navbar/>
        <Error404 />
      </>
    )
  }

  return (
    <>
      <Navbar logo={profile?.watermark as boolean | undefined}/>
      <div className="flex flex-col min-h-screen">
        <title>{document.title}</title>
        <Cover url={document.coverImage} preview={user?.moderator ? false : true} />
        <div className="mx-auto md:max-w-3xl lg:max-w-4xl flex-grow w-full mt-6">
          <ModeratorPanel _id={document._id} userId={document.userId} shortId={document.shortId} isShort={document.isShort} isPublished={document.isPublished} creatorName={document.creatorName} lastEditor={document.lastEditor} verifed={document.verifed} content={document.content} title={document.title} isAcrhived={document.isAcrhived}/>
          <Toolbar initialData={document} preview={user?.moderator ? false : true} />
          <Editor onChange={() => {}} initialContent={document.content} editable={false}/>
        </div>
        <Footer name={document.creatorName as string} team={document.userId.startsWith("org_")} logo={profile?.watermark as boolean}/>
      </div>
    </>
  )
}
