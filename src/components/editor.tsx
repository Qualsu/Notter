"use client" 

import { BlockNoteEditor, PartialBlock } from "@blocknote/core" 
import { useCreateBlockNote } from "@blocknote/react" 
import { BlockNoteView } from "@blocknote/mantine"
import { useTheme } from "next-themes" 
import { useOrganization, useUser } from "@clerk/nextjs"
import { getById as getUserById } from "../app/api/users/user"
import { getById as getOrgById } from "../app/api/orgs/org"
import toast from "react-hot-toast"
import { uploadFile as uploadFileOnServer } from "../app/api/files/file"
import type { EditorProps } from "@/config/types/components.types";

export default function Editor({ onChange, initialContent, editable, documentId }: EditorProps){
  const { resolvedTheme } = useTheme()
  const { user } = useUser()
  const { organization } = useOrganization()
  const isOrg = organization?.id !== undefined
  const orgId = isOrg ? organization?.id as string : user?.id as string

  const handleUpload = async (file: File) => {
    const userdata = isOrg
      ? await getOrgById(orgId)
      : await getUserById(orgId)

    const userSize =
      userdata?.premium == 1 ? 3
      : userdata?.premium == 2 ? 10
      : 1

    const maxSize = userSize * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`Размер файла не может превышать ${userSize} МБ`)
      throw new Error("File too large")
    }

    const url = await uploadFileOnServer(orgId, documentId, file);
    return url;
  };
  
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
    ? (JSON.parse(initialContent) as PartialBlock[])
    : undefined,
    uploadFile: handleUpload,
  }) 

  const handleEditorChange = () => {
    onChange(JSON.stringify(editor.document, null, 2))
  }

  return (
    <div>
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleEditorChange}
        data-theming-css-variables-demo
        className="z-0"
      />
    </div>
  ) 
} 