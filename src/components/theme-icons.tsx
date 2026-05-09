"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

import { images } from "@/config/routing/image.route"

export function ThemeIcons() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const href =
      resolvedTheme === "dark" ? images.IMAGE.DARK_ICON : images.IMAGE.ICON

    document
      .querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
      .forEach((link) => {
        link.href = href
      })
  }, [resolvedTheme])

  return null
}
