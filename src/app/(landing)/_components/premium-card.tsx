import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface PremiumCardProps {
  title: string;
  price: number;
  className: string;
  icon?: string;
  features: string[];
  btn?: boolean
}

export default function PremiumCard({ title, price, className, icon, features, btn = true }: PremiumCardProps){
  return (
    <div className={`border-4 p-6 rounded-lg shadow-lg transition-all hover:scale-105 flex flex-col ${className}`}>
      <div className="flex flex-row items-center">
        {icon && (
          <Image src={icon} alt={title} width={30} height={30} className="object-contain" />
        )}
        <h2 className={`text-3xl font-semibold ml-2 mb-1.5`}>
          <span className={className}>{title}</span> - {price}₽
        </h2>
      </div>
      <ul className="list-disc pl-5 flex-grow mt-2">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      {btn && (
        <Link href={"/buy"} className="mt-auto">
            <Button variant={"outline"} className="mt-2">
            Перейти
            </Button>
        </Link>
      )}
    </div>
  );
};