"use client"

import { useSearchParams } from "next/navigation";
import { checkOrder } from "../../api/order/order";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sendMail } from "../../api/mail/mail";
import { useUser, useOrganization } from "@clerk/nextjs";
import { pages } from "@/config/routing/pages.route";

let flag: boolean = false

export default function SuccessBuy() {
    const searchParams = useSearchParams();
    const merchantOrderId = searchParams.get('MERCHANT_ORDER_ID');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { user } = useUser()
    const { organization } = useOrganization()
    const email = user?.emailAddresses?.[0]?.emailAddress

    const handleSuccess = async () => {
        if (merchantOrderId === null || !user?.id) {
            return
        }

        try {
            const order = await checkOrder(merchantOrderId)
            
            if (!order) {
                if (!flag) {
                    setIsSuccess(false)
                    flag = true
                    toast.error("Заказ не найден");
                    setIsLoading(false)
                }
                return
            }

            const isOwnOrder = order.userid === user.id || (organization && order.userid === organization.id)
            if (!isOwnOrder) {
                if (!flag) {
                    setIsSuccess(false)
                    flag = true
                    toast.error("Этот заказ не принадлежит вам");
                    setIsLoading(false)
                }
                return
            }
            if (order.status === "pending") {
                if (!flag) {
                    setIsSuccess(false)
                    flag = true
                    toast.loading("Платеж обрабатывается, подождите...");
                    setIsLoading(false)
                }
                return
            }

            if (order.status === "success") {
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
                    setIsLoading(false)
                }
            } else {
                if (!flag) {
                    setIsSuccess(false)
                    flag = true
                    toast.error("Платеж не был успешно обработан");
                    setIsLoading(false)
                }
            }
        } catch (error) {
            if (!flag) {
                setIsSuccess(false)
                flag = true
                toast.error("Произошла непредвиденная ошибка");
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        handleSuccess()
    }, [user?.id])

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold drop-shadow-sm text-center">
                    <span className="text-yellow-300">N</span>
                    <span className="text-[#CFCFD0]">otter </span>
                    <span className="text-cyan-300">Gem</span>
                </h1>
                <p className="m-2">
                    {isLoading 
                        ? "Проверка заказа..." 
                        : `Заказ №${merchantOrderId} ${isSuccess ? "успешно оплачен!" : "не был успешно оплачен"}`
                    }
                </p>
                <Link href={pages.DASHBOARD()}>
                    <Button variant={"outline"}>На главную</Button>
                </Link>
            </div>
        </div>
    );
}