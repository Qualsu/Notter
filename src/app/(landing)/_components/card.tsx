import Image from "next/image";

interface CardProps {
    name: string
    description: string
    img: any
}

export function Card({ name, description, img }: CardProps){    
    return (
        <div className="flex justify-center items-center bg-zinc-900/25 rounded-xl max-w-[1000px] w-full mx-2 py-1 z-[-100]">
            <section className="flex justify-center md:flex-row flex-col items-center my-8">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl text-white my-5 md:my-2">{name}</h1>
                    <h3 className="text-xl break-word max-w-[500px] text-gray-300 px-4 md:px-0 w-96">{description}</h3>
                </div>
                <Image src={img} width="200" height="200" alt="" className="m-2 md:mt-0 mt-5"/>
            </section>
        </div>
    )
}