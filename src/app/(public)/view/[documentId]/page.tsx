import DocumentIdPage from "../../_components/document";
import type { DocumentIdPageProps } from "@/config/types/public.types";

export default async function Page({ params }: DocumentIdPageProps) {
  const resolvedParams = await params

  return <DocumentIdPage params={resolvedParams}/>
}
