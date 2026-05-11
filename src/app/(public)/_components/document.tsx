"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useMutation, useQuery } from "convex/react"
import Link from "next/link"
import Twemoji from "react-twemoji"

import { Skeleton } from "@/components/ui/skeleton"
import { Cover } from "@/components/cover"
import Error404 from "@/app/not-found"
import { Separator } from "@/components/ui/separator"
import { api } from "../../../../convex/_generated/api"
import { Navbar } from "../../(landing)/_components/navbar"
import { getByUsername as getByOrgname } from "../../api/orgs/org"
import { getById, getByUsername } from "../../api/users/user"
import { ModeratorPanel } from "./moderatorPanel"
import { pages } from "@/config/routing/pages.route"
import type { PublicDocumentComponentProps, UserInterface } from "@/config/types/public.types"
import type { Org, User } from "@/config/types/api.types"
import { useOrganization, useUser } from "@clerk/nextjs"
import { isValidConvexId } from "@/lib/convex-id"
import { IframeModal } from "@/app/(main)/_components/iframe-modal"
import { useOrigin } from "@/components/hooks/use-origin"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

function Footer({ name, team, logo }: UserInterface) {
  return (
    <footer className="mt-8 w-full">
      <Separator className="bg-black/10 dark:bg-white/10" />
      <p className="my-4 text-center text-sm text-primary/60">
        <span>Заметка создана {team ? "командой" : ""}{" "}</span>
        <Link href={pages.PROFILE(team, name)} className="font-semibold transition-colors duration-200 hover:text-primary">
          {name}
        </Link>
        {logo && (
          <>
            <span> в</span>
            <Link className="group ml-1 font-bold opacity-60 transition-opacity duration-200 hover:opacity-100" href={pages.ROOT}>
              <span className="text-logo-yellow">N</span>
              <span className="text-logo-light-yellow">otter</span>
            </Link>
          </>
        )}
      </p>
    </footer>
  )
}

export default function DocumentIdPage({ params, iframe = false }: PublicDocumentComponentProps) {
  const origin = useOrigin()
  const isShort = params.documentId.length >= 4 && params.documentId.length <= 30
  const documentId = isValidConvexId(params.documentId) ? params.documentId : null
  const [profile, setProfile] = useState<User | Org | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const { user: clerkUser } = useUser()
  const { organization } = useOrganization()
  const incrementViews = useMutation(api.document.incrementViews)
  const canModerate = user?.moderator === true

  const document = useQuery(
    isShort ? api.document.getByShortId : api.document.getById,
    isShort
      ? {
          shortId: params.documentId,
        }
      : documentId
        ? {
            documentId,
            alwaysView: user?.moderator,
            userId: organization?.id ?? clerkUser?.id,
          }
        : "skip"
  )

  useEffect(() => {
    if (document?._id && document.isPublished && !document.isAcrhived) {
      incrementViews({ id: document._id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?._id])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!document?.creatorName) return

      const isOrg = document.userId.startsWith("org_")
      const profileData = isOrg
        ? await getByOrgname(document.creatorName as string)
        : await getByUsername(document.creatorName as string)

      setProfile(profileData)

      if (clerkUser?.id) {
        const userData = await getById(clerkUser.id)
        setUser(userData)
      }
    }

    fetchProfile()
  }, [document, clerkUser])

  if (!isShort && documentId === null) {
    return iframe ? <Error404 /> : (
      <>
        <Navbar />
        <Error404 />
      </>
    )
  }

  if (document === undefined) {
    if (iframe) {
      return (
        <div className="min-h-screen bg-background px-4 py-6">
          <div className="mx-auto w-full max-w-5xl space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-[640px] w-full rounded-2xl" />
          </div>
        </div>
      )
    }

    return (
      <>
        <Navbar logo={profile?.watermark as boolean | undefined} />
        <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-logo-light-yellow/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-64 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-logo-yellow/10 px-4 pb-10 pt-20 dark:to-logo-cyan/10">
          <div className="mx-auto w-full max-w-[1380px] rounded-3xl border border-white/50 bg-white/75 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75">
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <Cover.Skeleton />
            </div>
            <div className="mx-auto mt-8 w-full max-w-5xl px-2 sm:px-4">
              <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if ((!document?.isPublished && !canModerate) || document === null || (isShort && !document.isShort && !canModerate)) {
    return iframe ? <Error404 /> : (
      <>
        <Navbar />
        <Error404 />
      </>
    )
  }

  const iframeUrl = pages.DOCUMENT_IFRAME_URL(origin, document._id, document.isShort, document.shortId)

  const content = (
    <div className={iframe ? "min-h-screen bg-background px-4 py-6 text-foreground" : "rounded-2xl border border-black/10 bg-background/70 pt-4 shadow-sm dark:border-white/10"}>
      {document.coverImage && (
        <div className={iframe ? "mb-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10" : "overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"}>
          <Cover url={document.coverImage} preview />
        </div>
      )}

      <div className={iframe ? "mx-auto w-full max-w-5xl" : ""}>
        {!iframe && (
          <div className="mb-2 flex justify-end">
            <ModeratorPanel
              _id={document._id}
              userId={document.userId}
              shortId={document.shortId}
              isShort={document.isShort}
              isPublished={document.isPublished}
              creatorName={document.creatorName}
              lastEditor={document.lastEditor}
              verifed={document.verifed}
              content={document.content}
              title={document.title}
              isAcrhived={document.isAcrhived}
            />
          </div>
        )}

        {!!document.icon && (
          <Twemoji options={{ className: "twemoji-lg" }}>
            <p className={iframe ? "ml-13 px-0 pt-2 text-5xl sm:text-6xl" : "px-12 pt-6 text-6xl"}>{document.icon}</p>
          </Twemoji>
        )}

        <h1 className={iframe ? "ml-13 px-0 pb-4 pt-2 mt-2 text-5xl font-bold text-[#3F3F3F] dark:text-[#CFCFCF]" : "px-12 pb-2 pt-4 text-5xl font-bold text-[#3F3F3F] dark:text-[#CFCFCF]"}>
          {document.title}
        </h1>

        <Editor onChange={() => {}} initialContent={document.content} editable={false} documentId={document._id as string}/>
      </div>
    </div>
  )

  if (iframe) {
    return content
  }

  return (
    <>
      <Navbar logo={profile?.watermark as boolean | undefined} />
      <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-logo-light-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-64 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />
      <div className="min-h-screen flex justify-content items-center flex-col bg-gradient-to-br from-background via-background to-logo-yellow/10 px-4 pb-10 pt-20 dark:to-logo-cyan/10">
        <div className="relative mx-auto flex w-full max-w-[1380px] flex-col rounded-3xl border border-white/50 bg-white/75 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75">
          <div className="mx-auto mt-6 w-full max-w-5xl flex-grow px-2 sm:px-4">
            {content}
            <Footer name={document.creatorName as string} team={document.userId.startsWith("org_")} logo={profile?.watermark as boolean} />
          </div>
        </div>
        <IframeModal iframeUrl={iframeUrl}/>
      </div>
    </>
  )
}
