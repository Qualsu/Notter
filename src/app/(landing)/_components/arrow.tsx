import Image from "next/image"
import arrowImg from "../../../../public/image/arrow.svg"

export function Arrow(){
    return (
        <div>
            <Image src={arrowImg} height="600" alt="" className="relative z-10 top-[1430px] left-[450px]"/>
        </div>
    )
}