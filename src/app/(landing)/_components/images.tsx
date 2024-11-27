import Image from "next/image"
import LandingImage from "../../../../public/image/Landing.png"

export function Images() {
    return(
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:h-96 md:w-96">
                    <Image 
                    src={LandingImage}
                    fill
                    className="object-contain"
                    alt="Landing Kenyka Image"
                    />
                </div>
            </div>
        </div>
    )
}
