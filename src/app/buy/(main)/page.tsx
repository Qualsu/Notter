"use client";

import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrder } from "../../../../server/order/order";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useConvexAuth } from "convex/react";

export default function BuyPremium() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const { organization } = useOrganization();
    const { user } = useUser()
    const { isAuthenticated } = useConvexAuth()
    const isOrg = organization?.id !== undefined;
    const id = isOrg ? organization.id : user?.id
    const price = selectedPlan == "1" ? (isOrg ? 149 : 29) : selectedPlan == "2" ? (isOrg ? 299 : 99) : 0;
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!selectedPlan) {
            toast.error("Пожалуйста, выберите тариф");
            return;
        }

        setLoading(true);
        const orderResponse: any = await createOrder(organization?.id ?? "", id ?? null, parseInt(selectedPlan), "pending", price);
        console.log(orderResponse)
        if (orderResponse) {
            window.location.href = orderResponse;
        } else {
            toast.error("Произошла ошибка при создании заказа");
            if(!isAuthenticated){
                return redirect("/auth/sign-in")
            }
        }
        setLoading(false);
    };

    return (
        <>
            <div className="mt-96 flex flex-col items-center justify-center gap-3">
                <h1 className="text-5xl font-bold drop-shadow-sm text-center">
                    <span className="text-yellow-300">N</span>
                    <span className="text-[#CFCFD0]">otter </span>
                    <span className="text-cyan-300">Gem</span>
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 whitespace-nowrap">
                    <p>Выберите аккаунт/организацию:</p>
                    <OrganizationSwitcher />
                </div>
                <div className="flex flex-col sm:flex-row items-center whitespace-nowrap gap-2">
                    <p>Выберите тариф:</p>
                    <Select onValueChange={(value) => setSelectedPlan(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Выберите тариф" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Amber</SelectItem>
                            <SelectItem value="2">Diamond</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {selectedPlan && price > 0 && (
                    <div className="flex flex-row items-center gap-2">
                        <span>Цена: {price}₽</span>
                        <Button
                            onClick={handlePayment}
                            variant={"outline"}
                            disabled={loading}
                        >
                            {loading ? "Ожидание..." : "Оплатить"}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
