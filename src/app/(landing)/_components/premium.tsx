import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Premium() {
    return (
        <div className="p-6">
            <h1 className="text-5xl font-bold drop-shadow-sm">
                <span className="text-yellow-300">N</span>
                <span className="text-[#CFCFD0]">otter </span>
                <span className="text-cyan-300">Gem</span>
            </h1>

            <p className="m-4">Подписка улучшаюшая и делающая работу еще приятнее</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="border-4 border-yellow-300 p-6 rounded-lg shadow-lg transition-all hover:scale-105 flex flex-col">
                    <div className="flex flex-row items-center">
                        <Image 
                            src="/badge/Amber.png" 
                            alt="Amber" 
                            width={30} 
                            height={30} 
                            className="object-contain"
                        />
                        <h2 className="text-3xl font-semibold ml-2 mb-1.5">
                            Amber - 29₽
                        </h2>
                    </div>
                    <ul className="list-disc pl-5 flex-grow mt-2">
                        <li>Сокращенные ссылки для публичных заметок</li>
                        <li>Значок в профиле</li>
                        <li>200 заметок (расширенный лимит)</li>
                        <li>100 публичных заметок (расширенный лимит)</li>
                    </ul>
                    <Link href={"/buy&type=1"} className="mt-auto">
                        <Button variant={"outline"}>Перейти</Button>
                    </Link>
                </div>

                <div className="border-4 border-cyan-300 p-6 rounded-lg shadow-lg transition-all hover:scale-105 flex flex-col">
                    <div className="flex flex-row items-center">
                        <Image 
                            src="/badge/Diamond.png" 
                            alt="Diamond" 
                            width={30} 
                            height={30} 
                            className="object-contain"
                        />
                        <h2 className="text-3xl font-semibold ml-2 mb-1.5">
                            Diamond - 99₽
                        </h2>
                    </div>
                    <ul className="list-disc pl-5 flex-grow mt-2">
                        <li>Кастомные ссылки для публичных заметок</li>
                        <li>Удаление упоминания Notter на публичных заметках</li>
                        <li>Кастомный градиентный фон в профиле</li>
                        <li>Значок профиля</li>
                        <li>Расширенные лимиты до 1000 заметок</li>
                        <li>Расширенные лимиты до 1000 публичных заметок</li>
                    </ul>
                    <Link href={"/buy&type=2"} className="mt-auto">
                        <Button variant={"outline"} className="mt-4">Перейти</Button>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}
