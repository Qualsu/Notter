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
import { Id } from "../../../../convex/_generated/dataModel"
import { Navbar } from "../../(landing)/_components/navbar"
import { getByUsername as getByOrgname } from "../../api/orgs/org"
import { getById, getByUsername } from "../../api/users/user"
import { ModeratorPanel } from "./moderatorPanel"
import { pages } from "@/config/routing/pages.route"
import type { PublicDocumentComponentProps as DocumentIdPageProps, UserInterface } from "@/config/types/public.types"
import type { Org, User } from "@/config/types/api.types"
import { useOrganization, useUser } from "@clerk/nextjs"

const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

function Footer({ name, team, logo }: UserInterface) {
  return (
    <footer className="mt-8 w-full">
      <Separator className="bg-black/10 dark:bg-white/10" />
      <p className="my-4 text-center text-sm text-primary/50">
        Заметка создана {team ? "командой" : ""}{" "}
        <Link href={pages.PROFILE(team, name)} className="font-semibold hover:underline">
          {name}
        </Link>
        {logo && (
          <>
            <span> в</span>
            <Link className="group ml-1 font-bold opacity-60 transition-opacity duration-300 hover:opacity-100" href={pages.ROOT}>
              <span className="group-hover:underline text-logo-yellow">N</span>
              <span className="group-hover:underline text-logo-light-yellow">otter</span>
            </Link>
          </>
        )}
      </p>
    </footer>
  )
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const isShort = params.documentId.length >= 4 && params.documentId.length <= 30
  const [profile, setProfile] = useState<User | Org | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const { user: clerkUser } = useUser()
  const { organization } = useOrganization()
  const incrementViews = useMutation(api.document.incrementViews)
  const canModerate = user?.moderator === true

  const document = useQuery(
    isShort ? api.document.getByShortId : api.document.getById,
    isShort
      ? { shortId: params.documentId }
      : {
          documentId: params.documentId as Id<"documents">,
          alwaysView: user?.moderator,
          userId: organization?.id ?? clerkUser?.id,
        }
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

      const userData = await getById(clerkUser?.id as string)
      setUser(userData)
    }

    fetchProfile()
  }, [document, clerkUser])

  if (document === undefined) {
    return (
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
    )
  }

  if ((!document?.isPublished && !canModerate) || document === null || (isShort && !document.isShort && !canModerate)) {
    return (
      <>
        <title>Not Found</title>
        <Navbar />
        <Error404 />
      </>
    )
  }

  return (
    <>
      <Navbar logo={profile?.watermark as boolean | undefined} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-logo-yellow/10 px-4 pb-10 pt-20 dark:to-logo-cyan/10">
        <title>{document.title}</title>
        <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-logo-light-yellow/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-64 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-[1380px] flex-col rounded-3xl border border-white/50 bg-white/75 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75">
          {document.coverImage && (
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              <Cover url={document.coverImage} preview />
            </div>
          )}

          <div className="mx-auto mt-6 w-full max-w-5xl flex-grow px-2 sm:px-4">
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
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-background/70 pt-4 shadow-sm">
              {!!document.icon && (
                <Twemoji options={{ className: "twemoji-lg" }}>
                  <p className="px-12 pt-6 text-6xl">{document.icon}</p>
                </Twemoji>
              )}
              <h1 className="px-12 pb-2 pt-4 text-5xl font-bold text-[#3F3F3F] dark:text-[#CFCFCF]">
                {document.title}
              </h1>
              <Editor onChange={() => {}} initialContent={document.content} editable={false} documentId={document._id as string} />
            </div>
            <Footer name={document.creatorName as string} team={document.userId.startsWith("org_")} logo={profile?.watermark as boolean} />
          </div>
        </div>
      </div>
    </>
  )
}
