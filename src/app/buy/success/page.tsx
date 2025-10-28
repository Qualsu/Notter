"use client"

import { redirect, useSearchParams } from "next/navigation";
import { success } from "../../../../server/order/order";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SuccessBuy() {
    const searchParams = useSearchParams();
    const merchantOrderId = searchParams.get('MERCHANT_ORDER_ID');

    console.log(merchantOrderId)

    const handleSuccess = async () => {
        if (merchantOrderId === null) {
            return redirect('/not-found')
        }

        const response = await success(merchantOrderId)
        if (response){
            toast.success("Заказ успешно оплачен");
        } else {
            toast.error("Произошла ошибка при проверке заказа");
        }
    }

    useEffect(() => {
        handleSuccess()
    })

    return (
        <div className="mt-24 flex flex-col items-center justify-center">
            <p>Order ID: {merchantOrderId}</p>
        </div>
    );
}