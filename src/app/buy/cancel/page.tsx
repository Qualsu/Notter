"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CancelBuy() {
    const searchParams = useSearchParams();
    const merchantOrderId = searchParams.get('MERCHANT_ORDER_ID');
    
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold drop-shadow-sm text-center">
                    <span className="text-yellow-300">N</span>
                    <span className="text-[#CFCFD0]">otter </span>
                    <span className="text-cyan-300">Gem</span>
                </h1>
                <p className="m-2">Заказ #{merchantOrderId} был отменен</p>
                <Link href="/dashboard">
                    <Button variant={"outline"}>На главную</Button>
                </Link>
            </div>
        </div>
    );
}