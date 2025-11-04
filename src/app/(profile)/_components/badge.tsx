import { Org } from "../../../../server/orgs/types";
import { User } from "../../../../server/users/types"
import Image from "next/image";

type BadgesProps = {
    profile: User | Org
}

export function Badges({profile}: BadgesProps){
    return (
        <>
            {profile?.badges.notter && (
                <div className="relative group select-none">
                    <Image
                        src="/badge/Notter.png"
                        alt="Notter Icon"
                        width={27}
                        height={27}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-yellow-200">
                    Разработчик Notter
                    </span>
                </div>
            )}

            {profile?.verifiedDocuments > 0 && (
                <div className="relative group select-none">
                    <Image
                        src="/badge/NoteVerifed.png"
                        alt="Note Verifed Icon"
                        width={25}
                        height={25}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Создатель верефицированных заметок
                    </span>
                </div>
            )}

            {profile?.verifiedOrgs > 0 && (
                <div className="relative group select-none mx-0.5">
                    <Image
                        src="/badge/OrgVerifed.png"
                        alt="Note Verifed Icon"
                        width={28}
                        height={28}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                        Владелец верефицированной команды
                    </span>
                </div>
            )}

            {profile?.moderator && (
                <div className="relative group select-none mx-0.5">
                    <Image
                        src="/badge/Moderator.png"
                        alt="Note Verifed Icon"
                        width={24}
                        height={24}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-orange-300">
                    Модератор
                    </span>
                </div>
            )}

            {profile?.badges.contributor && (
                <div className="relative group select-none">
                    <Image
                        src="/badge/Contributor.png"
                        alt="Note Verifed Icon"
                        width={28}
                        height={28}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-rose-400">
                    Внесенный вклад
                    </span>
                </div>
            )}

            {profile?.premium == 1 && (
                <div className="relative group">
                    <Image
                        src="/badge/Amber.png"
                        alt="Note Verifed Icon"
                        width={25}
                        height={25}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Notter Gem: <span className="text-amber-300">Amber</span>
                    </span>
                </div>
            )}

            {profile?.premium == 2 && (
                <div className="relative group select-none">
                    <Image
                        src="/badge/Diamond.png"
                        alt="Note Verifed Icon"
                        width={25}
                        height={25}
                        className="transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Notter Gem: <span className="text-cyan-300">Diamond</span>
                    </span>
                </div>
            )}

            <div className="relative group ml-1.5">
                <Image
                    src="/badge/ID.png"
                    alt="ID Icon"
                    width={25}
                    height={25}
                    className="transform transition-transform duration-200 hover:scale-110"
                />
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Дата регистрации:
                    <p>{profile?.created ? new Date(profile.created).toLocaleDateString() : "undefined"}</p>
                </span>
            </div>
        </>
    )
}