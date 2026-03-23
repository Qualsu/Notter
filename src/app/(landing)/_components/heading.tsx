"use client"

import { Button } from "@/components/ui/button"
import { pages } from "@/config/routing/pages.route"
import { useConvexAuth } from "convex/react"
import Link from "next/link"
import Image from "next/image"
import { images } from "@/config/routing/image.route"
import InstallPWA from "./install"

export function Heading() {
  const { isAuthenticated } = useConvexAuth()

  return (
    <section className="grid md:grid-cols-2 gap-8 items-center py-1 px-4">
      <div className="space-y-6 text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Новый уровень построения задач. Встречайте <span className="text-logo-yellow">N</span>
          <span className="text-logo-light-yellow">otter</span>
        </h1>
        <p className="text-lg max-w-xl text-muted-foreground">
          Планируйте, синхронизируйте и работайте в команде в современной, комфортной среде — быстро и приятно
        </p>

        <span className="space-x-2">
        <Link href={isAuthenticated ? pages.DASHBOARD() : pages.AUTH}>
          <Button className="mt-2">Перейти в Notter</Button>
        </Link>
        <InstallPWA/>
        </span>
      </div>

      <div className="flex justify-center">
        <Image src={images.IMAGE.EMPTY} alt="lamp" width={500} height={500} />
      </div>
    </section>
  )
}
  