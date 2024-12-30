"use client";

import Image from "next/image";
import Link from "next/link";
import errorImg from "../../public/image/NotterMini.png"

import { Button } from "@/components/ui/button";

export default function Error404(){
  return (
    <div className="flex h-full flex-row items-center justify-center space-y-4">
      <Image
        src={errorImg}
        height="200"
        width="200"
        alt="error"
      />
      <div className="flex flex-col">
        <h1 className="text-7xl font-medium m-2">404</h1>
        <Button asChild size="lg">
            <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  );
};