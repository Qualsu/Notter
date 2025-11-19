import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import PremiumCard from "./premium-card";

export function Premium() {
  const [isTeam, setIsTeam] = useState(false);

  const toggleAccountType = (type: "personal" | "team") => {
    setIsTeam(type === "team");
  };

  const amberPrice = isTeam ? 149 : 29;
  const diamondPrice = isTeam ? 299 : 99;
  const freePrice = 0;

  const limits = {
    free: { notes: "75", publicNotes: "10", upload: "1" },
    amber: { notes: isTeam ? "500" : "200", publicNotes: isTeam ? "250" : "100", upload: "3" },
    diamond: { notes: "1000", publicNotes: "1000", upload: "10" },
  };

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold drop-shadow-sm">
        <span className="text-logo-yellow">N</span>
        <span className="text-logo-light-yellow">otter </span>
        <span className="text-logo-cyan">Gem</span>
      </h1>

      <p className="m-4">Подписка, улучшающая и делающая работу еще приятнее</p>

      <div className="flex justify-center items-center mb-6 space-x-6">
        <Button onClick={() => toggleAccountType("personal")} className={`text-lg ${!isTeam ? "underline" : ""}`} variant={"ghost"}>
          Личная
        </Button>
        <span>|</span>
        <Button onClick={() => toggleAccountType("team")} className={`text-lg ${isTeam ? "underline" : ""}`} variant={"ghost"}>
          Командная
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        <PremiumCard
          title="Free"
          price={freePrice}
          className="border-gray-300"
          features={[
            `До ${limits.free.notes} заметок`, 
            `До ${limits.free.publicNotes} публичных заметок`, 
            `Загрузка изображений до ${limits.free.upload} МБ`
          ]}
          btn={false}
        />
        <PremiumCard
          title="Amber"
          price={amberPrice}
          className="border-yellow-300"
          icon="/badge/Amber.png"
          features={[
            "Сокращенные ссылки для публичных заметок",
            "Уникальный значок в профиле",
            `До ${limits.amber.notes} заметок`,
            `До ${limits.amber.publicNotes} публичных заметок`,
            `Загрузка изображений до ${limits.amber.upload} МБ`
          ]}
        />
        <PremiumCard
          title="Diamond"
          price={diamondPrice}
          className="border-cyan-300"
          icon="/badge/Diamond.png"
          features={[
            "Все преимущества Amber",
            "Кастомные ссылки",
            "Отключение упоминаний Notter",
            "Скачивание/Загрузка заметок в JSON",
            `До ${limits.diamond.notes} заметок`,
            `До ${limits.diamond.publicNotes} публичных заметок`,
            `Загрузка изображений до ${limits.diamond.upload} МБ`
          ]}
        />
      </div>

      <Table className="mt-6">
        <TableCaption>Сравнение лимитов тарифов</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Характеристика</TableHead>
            <TableHead>Free</TableHead>
            <TableHead className="text-yellow-500">Amber</TableHead>
            <TableHead className="text-cyan-500">Diamond</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-left">
          <TableRow>
            <TableCell>Заметки</TableCell>
            <TableCell>{limits.free.notes}</TableCell>
            <TableCell>{limits.amber.notes}</TableCell>
            <TableCell>{limits.diamond.notes}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Публичные заметки</TableCell>
            <TableCell>{limits.free.publicNotes}</TableCell>
            <TableCell>{limits.amber.publicNotes}</TableCell>
            <TableCell>{limits.diamond.publicNotes}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Максимальный размер загружаемых изображений</TableCell>
            <TableCell>{limits.free.upload} МБ</TableCell>
            <TableCell>{limits.amber.upload} МБ</TableCell>
            <TableCell>{limits.diamond.upload} МБ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Значок в профиле</TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Сокращенные ссылки</TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Кастомные ссылки</TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Отключение упоминаний</TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Скачивание/загрузка в JSON</TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><X size={16} /></TableCell>
            <TableCell><Check size={16} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}