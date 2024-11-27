"use client"

import { Button } from "@/components/ui/button"
import { useConvexAuth } from "convex/react"

export function Heading() {
    const {isAuthenticated} = useConvexAuth()

    return (
      <div className="space-y-4 text-center">
          <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-bold mx-auto">
              Новый уровень построения задач. Встречайте <span className="text-yellow-300">N</span><span className="text-zinc-400">otter</span>
          </h1>
          <h3 className="text-base sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto">
              Планируйте и разрабатывайте с командой в удобной для вас атмосфере
          </h3>
          {isAuthenticated && (
            <a href="/dashboard" >
              <Button className="mt-4">Перейти в Notter</Button>
            </a>
          )}

          {!isAuthenticated && (
            <a href="/auth/sign-in" >
              <Button className="mt-4">Перейти в Notter</Button>
            </a>
          )}
      </div>
    )
  }
  