import Image from "next/image";
import logoImg from "../../../../public/image/Notter.png"

export function Footer(){
    return (
        <footer className="dark:bg-zinc-950 rounded-lg shadow m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src={logoImg} height="60" alt="KenyCloud Logo" className="drop-shadow-xl"/>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-500 dark:text-gray-400">
                        <li>
                            <a href="https://feedback.qual.su" target="_blank" className="hover:underline me-4 md:me-6">Feedback</a>
                        </li>
                        <li>
                            <a href="https://id.qual.su" target="_blank" className="hover:underline me-4 md:me-6">Qual ID</a>
                        </li>
                        <li>
                            <a href="https://t.me/qualsu" target="_blank" className="hover:underline me-4 md:me-6">Telegram</a>
                        </li>
                        <li>
                            <a href="https://vk.com/qualsu" target="_blank" className="hover:underline md:me-6">VK</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-300 dark:border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-400 sm:text-center ">© 2021-2025 <a href="https://qual.su" className="hover:underline">Qualsu</a></span>
            </div>
        </footer>
    )
}