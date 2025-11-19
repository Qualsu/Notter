"use client"

import { redirect, useSearchParams } from "next/navigation";
import { success } from "../../../../server/order/order";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sendMail } from "../../../../server/mail/mail";
import { useUser } from "@clerk/nextjs";

let flag: boolean = false

export default function SuccessBuy() {
    const searchParams = useSearchParams();
    const merchantOrderId = searchParams.get('MERCHANT_ORDER_ID');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const { user } = useUser()
    const email = user?.emailAddresses?.[0]?.emailAddress

    const handleSuccess = async () => {
        if (merchantOrderId === null) {
            return
        }

        const response = await success(merchantOrderId)
        if (response){
            if (!flag) {
                setIsSuccess(true)
                flag = true
                toast.success("Заказ успешно оплачен");
                if (email) {
                    await sendMail({
                        to: email,
                        subject: "Подписка Notter Gem оформлена",
                        message: `${user.username}, заказ №${merchantOrderId} успешно оплачен! Спасибо за покупку, теперь вам доступны все преимущества Notter Gem!`
                    })
                }
            }
        } else {
            if (!flag) {
                setIsSuccess(false)
                flag = true
                toast.error("Произошла ошибка при проверке заказа");
            }
        }
    }

    useEffect(() => {
        handleSuccess()
    })

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold drop-shadow-sm text-center">
                    <span className="text-yellow-300">N</span>
                    <span className="text-[#CFCFD0]">otter </span>
                    <span className="text-cyan-300">Gem</span>
                </h1>
                <p className="m-2">Заказ #{merchantOrderId} {isSuccess ? "успешно оплачен!" : "не был успешно оплачен"}</p>
                <Link href="/dashboard">
                    <Button variant={"outline"}>На главную</Button>
                </Link>
            </div>
        </div>
    );
}