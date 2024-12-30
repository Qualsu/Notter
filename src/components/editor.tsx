"use client" 

import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, PartialBlock } from "@blocknote/core" 
import { useCreateBlockNote } from "@blocknote/react" 
import { BlockNoteView, lightDefaultTheme, Theme } from "@blocknote/mantine"
import { useTheme } from "next-themes" 
import { useEdgeStore } from "@/lib/edgestore" 
import "@blocknote/core/style.css" 
import "@blocknote/mantine/style.css"

interface EditorProps {
  onChange: (value: string) => void 
  initialContent?: string 
  editable?: boolean 
}

export default function Editor({ onChange, initialContent, editable }: EditorProps){
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({file}) 

    return res.url 
  } 

  const { audio, file, video, ...remainingBlockSpecs } = defaultBlockSpecs;

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...remainingBlockSpecs,
    },
  });
  
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
    ? (JSON.parse(initialContent) as PartialBlock[])
    : undefined,
    uploadFile: handleUpload,
    // schema,
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