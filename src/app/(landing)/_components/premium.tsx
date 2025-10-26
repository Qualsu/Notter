import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Premium() {
    const [isTeam, setIsTeam] = useState(false);

    const toggleAccountType = (type: "personal" | "team") => {
        setIsTeam(type === "team");
    };

    const amberPrice = isTeam ? 149 : 29;
    const diamondPrice = isTeam ? 299 : 99;

    return (
        <div className="p-6">
            <h1 className="text-5xl font-bold drop-shadow-sm">
                <span className="text-yellow-300">N</span>
                <span className="text-[#CFCFD0]">otter </span>
                <span className="text-cyan-300">Gem</span>
            </h1>

            <p className="m-4">Подписка улучшаюшая и делающая работу еще приятнее</p>

            <div className="flex justify-center items-center mb-6 space-x-6">
                <Button 
                    onClick={() => toggleAccountType("personal")} 
                    className={`text-lg ${!isTeam ? "underline" : ""}`}
                    variant={"ghost"}
                >
                    Личная
                </Button>
                <span>|</span>
                <Button 
                    onClick={() => toggleAccountType("team")} 
                    className={`text-lg ${isTeam ? "underline" : ""}`}
                    variant={"ghost"}
                >
                    Командная
                </Button>
            </div>

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
                            Amber - {amberPrice}₽
                        </h2>
                    </div>
                    <ul className="list-disc pl-5 flex-grow mt-2">
                        <li>Сокращенные ссылки для публичных заметок</li>
                        <li>Уникальный значок в профиле</li>
                        <li>{isTeam ? "500" : "200"} заметок (расширенный лимит)</li>
                        <li>{isTeam ? "250" : "100"} публичных заметок (расширенный лимит)</li>
                    </ul>
                    <Link href={"/buy"} className="mt-auto">
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
                        <h2 className="text-3xl font-semibold ml-2 mb-1.5 whitespace-normal">
                            Diamond - {diamondPrice}₽
                        </h2>
                    </div>
                    <ul className="list-disc pl-5 flex-grow mt-2">
                        <li>Кастомные ссылки для публичных заметок</li>
                        <li>Удаление упоминания Notter на публичных заметках</li>
                        <li>Кастомный градиентный фон в профиле</li>
                        <li>Уникальный значок в профиле</li>
                        <li>Расширенные лимиты до 1000 заметок</li>
                        <li>Расширенные лимиты до 1000 публичных заметок</li>
                    </ul>
                    <Link href={"/buy"} className="mt-auto">
                        <Button variant={"outline"} className="mt-4">Перейти</Button>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}
