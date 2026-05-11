import type { Metadata } from "next"
import { ConvexHttpClient } from "convex/browser"

import { api } from "../../../../convex/_generated/api"
import type { DocumentIdPageProps } from "@/config/types/public.types"
import { isValidConvexId } from "@/lib/convex-id"

import DocumentIdPage from "../_components/document"

async function getPublicDocumentTitle(documentId: string) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  const isShort = documentId.length >= 4 && documentId.length <= 30

  if (!convexUrl || (!isShort && !isValidConvexId(documentId))) {
    return null
  }

  try {
    const convex = new ConvexHttpClient(convexUrl)

    if (isShort) {
      const document = await convex.query(api.document.getByShortId, {
        shortId: documentId,
      })

      if (!document?.isPublished || document.isAcrhived) {
        return null
      }

      return document.title
    }

    const document = await convex.query(api.document.getById, {
      documentId,
    })

    if (!document?.isPublished || document.isAcrhived) {
      return null
    }

    return document.title
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: DocumentIdPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const title = await getPublicDocumentTitle(resolvedParams.documentId)

  return {
    title: title ?? "Page not found",
  }
}

export default async function Page({ params }: DocumentIdPageProps) {
  const resolvedParams = await params

  return <DocumentIdPage params={resolvedParams} />
}
