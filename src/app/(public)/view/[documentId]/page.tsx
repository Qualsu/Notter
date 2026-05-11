import type { Metadata } from "next"
import { ConvexHttpClient } from "convex/browser"

import { api } from "../../../../../convex/_generated/api"
import type { DocumentIdPageProps } from "@/config/types/public.types"

import DocumentIdPage from "../../_components/document"

async function getPublicShortDocumentTitle(documentId: string) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  if (!convexUrl) {
    return null
  }

  try {
    const convex = new ConvexHttpClient(convexUrl)
    const document = await convex.query(api.document.getByShortId, {
      shortId: documentId,
    })

    if (!document?.isPublished || document.isAcrhived || !document.isShort) {
      return null
    }

    return document.title
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: DocumentIdPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const title = await getPublicShortDocumentTitle(resolvedParams.documentId)

  return {
    title: title ?? "Page not found",
  }
}

export default async function Page({ params }: DocumentIdPageProps) {
  const resolvedParams = await params

  return <DocumentIdPage params={resolvedParams} />
}
