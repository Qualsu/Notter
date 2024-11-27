import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Images } from "./_components/images";

export default function Landing() {
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
