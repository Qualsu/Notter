import Image from "next/image";
import logoImg from "../../../../public/image/Notter.png"
import Link from "next/link";
import { links } from "@/config/routing/links.route";
import { pages } from "@/config/routing/pages.route";

export function Footer(){
    return (
        <footer className="dark:bg-zinc-950 rounded-lg m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href={pages.ROOT} className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src={logoImg} height="50" alt="Notter Logo"/>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-500 dark:text-gray-400">
                        <li>
                            <Link href={links.FEEDBACK} target="_blank" className="hover:underline me-4 md:me-6">Feedback</Link>
                        </li>
                        <li>
                            <Link href={links.QUAL_ID} target="_blank" className="hover:underline me-4 md:me-6">Qual ID</Link>
                        </li>
                        <li>
                            <Link href={links.TELEGRAM} target="_blank" className="hover:underline me-4 md:me-6">Telegram</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-300 dark:border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-400 sm:text-center ">© 2021-2026 <Link href={links.QUALSU} className="hover:underline">Qualsu</Link></span>
            </div>
        </footer>
    )
}