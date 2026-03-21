import { Id } from "../../../../../convex/_generated/dataModel";
import DocumentIdPage from "../../_components/document";
import type { DocumentIdPageProps } from "@/config/types/public.types";

export default function Page({ params }: DocumentIdPageProps) {
  return <DocumentIdPage params={params}/>
}