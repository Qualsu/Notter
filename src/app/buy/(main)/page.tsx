"use client";

import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrder } from "../../../../server/order/order";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useConvexAuth } from "convex/react";
import { getById as getUser } from "../../../../server/orgs/org";
import { getById as getOrg } from "../../../../server/users/user";
import { User } from "../../../../server/users/types";
import { Org } from "../../../../server/orgs/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PriceCalculation = {
    price: number;
    oldPrice: number;
};

export default function BuyPremium() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const { organization } = useOrganization();
    const { user } = useUser();
    const { isAuthenticated } = useConvexAuth();
    const isOrg = organization?.id !== undefined;
    const id = isOrg ? organization.id : user?.id;
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<User | Org | null>(null);

    const basePrices: { [key: string]: number } = {
        "1": isOrg ? 149 : 29,
        "2": isOrg ? 299 : 99,
    };

    const calculatePrice = (): PriceCalculation => {
        if (!selectedPlan || !profile) return { price: 0, oldPrice: 0 };

        let price = basePrices[selectedPlan];
        let oldPrice = 0;

        if (profile?.premium === 1 && selectedPlan === "2") {
            price -= basePrices["1"];
            oldPrice = basePrices["2"];
        }

        return { price: price > 0 ? price : 0, oldPrice };
    };

    const canPurchasePlan = () => {
        if (profile?.premium === 1 && selectedPlan === "1") {
            toast.error("Вы уже приобрели этот тариф.");
            return false;
        }
        if (profile?.premium === 2 && selectedPlan === "2") {
            toast.error("Вы уже приобрели этот тариф.");
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/sign-in");
        }
        
        const fetchProfile = async () => {
            if (id) {
                if (isOrg) {
                    const userProfile = await getUser(id);
                    setProfile(userProfile);
                } else {
                    const orgProfile = await getOrg(id);
                    setProfile(orgProfile);
                }
            }
        };

        fetchProfile();
    }, [id, isOrg, isAuthenticated, router]);

    const handlePayment = async () => {
        if (!selectedPlan) {
            toast.error("Пожалуйста, выберите тариф");
            return;
        }

        if (!canPurchasePlan()) {
            return;
        }

        setLoading(true);
        const { price, oldPrice } = calculatePrice();

        const orderResponse: any = await createOrder(organization?.id ?? "", id ?? null, parseInt(selectedPlan), "pending", price);
        if (orderResponse) {
            window.location.href = orderResponse;
        } else {
            toast.error("Произошла ошибка при создании заказа");
        }
        setLoading(false);
    };

    const getCurrentPlan = (): string => {
        if (!profile) return "Free";
        switch (profile.premium) {
            case 1:
                return "Amber";
            case 2:
                return "Diamond";
            default:
                return "Free";
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center gap-3">
                <h1 className="text-5xl font-bold drop-shadow-sm text-center">
                    <span className="text-logo-yellow">N</span>
                    <span className="text-logo-light-yellow">otter </span>
                    <span className="text-logo-cyan">Gem</span>
                    <Image src="/badge/Diamond.png" alt="Notter Gem" width={40} height={40} className="inline-block ml-2" />
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-2 whitespace-nowrap">
                    <p>Выберите аккаунт/организацию:</p>
                    <OrganizationSwitcher />
                </div>
                <div className="flex flex-col sm:flex-row items-center whitespace-nowrap gap-2">
                    <p>Выберите тариф:</p>
                    <Select onValueChange={(value) => setSelectedPlan(value)} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Выберите тариф" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Amber</SelectItem>
                            <SelectItem value="2">Diamond</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-primary/50 text-xs">Ваш текущий: {getCurrentPlan()}</p>
                {selectedPlan && (
                    <div className="flex flex-row items-center gap-2">
                        <span>Цена:
                        <span> </span>
                        {calculatePrice().oldPrice > 0 && (
                            <span className="line-through text-primary/70">{calculatePrice().oldPrice}₽</span>
                        )}
                        <span> </span>
                        {calculatePrice().price}₽</span>
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
