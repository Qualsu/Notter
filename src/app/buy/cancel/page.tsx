"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { pages } from "@/config/routing/pages.route";

export default function CancelBuy() {
    const searchParams = useSearchParams();
    const merchantOrderId = searchParams.get('MERCHANT_ORDER_ID');
    
    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-card/60 dark:bg-zinc-900/60 backdrop-blur rounded-2xl p-8 shadow-lg text-center">
                <div className="mb-4">
                    <h1 className="text-3xl font-extrabold">
                        <span className="text-logo-yellow">N</span>
                        <span className="text-logo-light-yellow">otter</span>
                        <span className="text-logo-cyan"> Gem</span>
                    </h1>
                </div>

                <p className="text-muted-foreground mb-6">Заказ #{merchantOrderId ?? "—"} был отменён</p>

                <div className="flex items-center justify-center gap-3">
                    <Link href={pages.ROOT}>
                        <Button variant={"outline"}>На главную</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}