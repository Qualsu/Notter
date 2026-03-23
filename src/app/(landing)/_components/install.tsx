import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = async (evt: React.MouseEvent) => {
    evt.preventDefault();
    if (!promptInstall) return;
    try {
      await promptInstall.prompt();
      await promptInstall.userChoice?.then(() => null).catch(() => null);
    } finally {
      setPromptInstall(null);
      setSupportsPWA(false);
    }
  };

//   if (!supportsPWA) return null;

  return (
    <Button
      className="link-button"
      id="setup_button"
      aria-label="Установить приложение"
      title="Установить приложение"
      onClick={onClick}
      variant={"outline"}
    >
      Установить <Download/>
    </Button>
  );
};

export default InstallPWA;