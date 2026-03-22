"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { pages } from "@/config/routing/pages.route";
import { images } from "@/config/routing/image.route";

export default function Error404(){
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <Image
            src={images.IMAGE.ERROR}
            width={140}
            height={200}
            alt="Notter"
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-6xl font-extrabold">404</h1>
          <p className="mt-2 text-2xl font-semibold">Страница не найдена</p>
          <p className="mt-4 max-w-80">Кажется, вы заблудились. Возможно, страница была удалена или переехала</p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button size="lg" asChild>
              <Link href={pages.ROOT}>На главную</Link>
            </Button>

            <Button size="lg" variant="ghost" onClick={() => router.back()}>
              Назад
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}