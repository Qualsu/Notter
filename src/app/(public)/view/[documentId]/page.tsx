import { Id } from "../../../../../convex/_generated/dataModel";
import DocumentIdPage from "../../_components/document";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents"> 
  } 
}

export default function Page({ params }: DocumentIdPageProps) {
  return <DocumentIdPage params={params}/>
}