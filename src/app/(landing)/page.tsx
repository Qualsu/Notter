"use client"

import { redirect } from "next/navigation";
import { useOrigin } from "../../../hooks/use-origin";
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Images } from "./_components/images";
import { useOrganization } from "@clerk/clerk-react";

export default function Landing() {

  const origin = useOrigin()
  const { organization } = useOrganization()
  console.log(organization?.id)

  if(origin === "https://notter.site" || origin === "http://nttr.pw"){
    redirect("https://notter.tech")
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading/>
        {/* <Images/> */}
      </div>
      <Footer/>
    </div>
  )
}
