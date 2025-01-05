import lamp from "../../../../public/icon/lamp.svg"
import people from "../../../../public/icon/people.svg"
import options from "../../../../public/icon/options.svg"
import sync from "../../../../public/icon/ecosystem.svg"
import lampDark from "../../../../public/icon/lampDark.svg"
import peopleDark from "../../../../public/icon/peopleDark.svg"
import optionsDark from "../../../../public/icon/optionsDark.svg"
import syncDark from "../../../../public/icon/ecosystemDark.svg"
import { Card } from "./card"

export function About(){
    return (
        <>
            <Card
                name="Просто и удобно"
                description="Мы предоставляем простое, удобное, а главное бесплатное приложения"
                img={lamp}
                imgDark={lampDark}
            />
            <Card
                name="Функциональность"
                description="Большой функционал которого должно хватить для простых и средних задач"
                img={options}
                imgDark={optionsDark}
            />
            <Card
                name="Работа в команде"
                description="В Notter присутствует поддержка организаций из Qual ID для работы с командой"
                img={people}
                imgDark={peopleDark}
            />
            <Card
                name="Синхронизация"
                description="Синхронизируя данные, вы можете работать с любого устройства"
                img={sync}
                imgDark={syncDark}
            />
        </>
    )
}