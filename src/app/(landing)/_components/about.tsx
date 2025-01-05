import lamp from "../../../../public/icon/lamp.svg"
import people from "../../../../public/icon/people.svg"
import options from "../../../../public/icon/options.svg"
import sync from "../../../../public/icon/ecosystem.svg"
import { Card } from "./card"

export function About(){
    return (
        <>
            <Card
                name="Просто и удобно"
                description="Мы предоставляем простое, удобное, а главное бесплатное приложения"
                img={lamp}
            />
            <Card
                name="Функциональность"
                description="Большой функционал которого должно хватить для простых и средних задач"
                img={options}
            />
            <Card
                name="Работа в команде"
                description="В Notter присутствует поддержка организаций из Qual ID для работы с командой"
                img={people}
            />
            <Card
                name="Синхронизация"
                description="Синхронизируя данные, вы можете работать с любого устройства"
                img={sync}
            />
        </>
    )
}