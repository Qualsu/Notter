"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type IframeModalProps = {
  iframeUrl: string
}

function highlightHtml(code: string) {
  const attributePattern = /([^\s=]+)(="[^"]*")?/g

  return code.split("\n").map((line, lineIndex) => {
    const tagMatch = line.match(/^(\s*)(<\/?)([a-zA-Z0-9-]+)([\s\S]*?)(\/?>)$/)

    if (!tagMatch) {
      return (
        <div key={`${lineIndex}-${line}`} className="table-row">
          <span className="table-cell select-none pr-4 text-right text-[11px] text-white/30">
            {lineIndex + 1}
          </span>
          <span className="table-cell whitespace-pre text-zinc-100">
            {line || " "}
          </span>
        </div>
      )
    }

    const [, indentation, bracketStart, tagName, attributes, bracketEnd] = tagMatch
    const tokens = [...attributes.matchAll(attributePattern)]

    return (
      <div key={`${lineIndex}-${line}`} className="table-row">
        <span className="table-cell select-none pr-4 text-right text-[11px] text-white/30">
          {lineIndex + 1}
        </span>
        <span className="table-cell whitespace-pre">
          <span className="text-zinc-500">{indentation}</span>
          <span className="text-sky-300">{bracketStart}</span>
          <span className="text-violet-300">{tagName}</span>
          {tokens.map((token, tokenIndex) => {
            const [segment, name, value] = token
            const leadingWhitespace = segment.match(/^\s*/)?.[0] ?? ""

            return (
              <span key={`${lineIndex}-${name}-${tokenIndex}`}>
                <span className="text-zinc-500">{leadingWhitespace}</span>
                <span className="text-emerald-300">{name}</span>
                {value ? <span className="text-amber-200">{value}</span> : null}
              </span>
            )
          })}
          <span className="text-sky-300">{bracketEnd}</span>
        </span>
      </div>
    )
  })
}

export function IframeModal({ iframeUrl }: IframeModalProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const iframeCode = `<iframe 
  src="${iframeUrl}" 
  width="100%" 
  height="800" 
  loading="lazy"
></iframe>`

  useEffect(() => {
    if (!open) {
      setCopied(false)
    }
  }, [open])

  const onCopy = () => {
    navigator.clipboard.writeText(iframeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <>
      <Button
        className="mt-2 h-9 w-full rounded-xl text-xs"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Вставить на сайт
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-2xl rounded-2xl border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95">
          <DialogHeader className="space-y-2">
            <DialogTitle>Код для вставки</DialogTitle>
            <DialogDescription>
              Скопируйте этот iframe-код и вставьте его на свой сайт.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-200">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-white">HTML iframe</p>
                    <p className="text-[11px] text-zinc-400">Готовый код для вставки</p>
                  </div>
                </div>

                <Button
                  onClick={onCopy}
                  size="sm"
                  className="rounded-xl border border-white/10 bg-white/10 text-xs text-white shadow-none hover:bg-white/15"
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Скопировано" : "Копировать код"}
                </Button>
              </div>

              <div className="overflow-x-auto bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_38%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,1))] px-4 py-4">
                <pre className="font-mono text-xs leading-6 tracking-[0.01em]">
                  <code className="table min-w-full">
                    {highlightHtml(iframeCode)}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
