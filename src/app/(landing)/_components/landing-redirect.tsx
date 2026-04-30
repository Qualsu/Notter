"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function LandingRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("redirect") === "true") {
      router.replace("/dashboard")
    }
  }, [router])

  return null
}
