"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

const isIosStandalone = () =>
  Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

const InstallPWA = () => {
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => null);
    }

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const updateInstalledState = () => {
      setIsInstalled(standaloneQuery.matches || isIosStandalone());
    };

    const beforeInstallPromptHandler = (event: Event) => {
      event.preventDefault();
      setPromptInstall(event as BeforeInstallPromptEvent);
    };

    const appInstalledHandler = () => {
      setPromptInstall(null);
      setIsInstalled(true);
      toast.success("Notter установлен");
    };

    updateInstalledState();
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", appInstalledHandler);
    standaloneQuery.addEventListener("change", updateInstalledState);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
      standaloneQuery.removeEventListener("change", updateInstalledState);
    };
  }, []);

  const onClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!promptInstall) {
      toast(
        "Если окно установки не появилось, откройте сайт в Chrome или Edge через HTTPS/localhost и нажмите значок установки в адресной строке."
      );
      return;
    }

    try {
      await promptInstall.prompt();
      const choice = await promptInstall.userChoice?.catch(() => null);

      if (choice?.outcome === "accepted") {
        toast.success("Установка запущена");
      }
    } finally {
      setPromptInstall(null);
    }
  };

  if (isInstalled) return null;

  return (
    <Button
      className="link-button"
      id="setup_button"
      aria-label="Установить приложение"
      title="Установить приложение"
      onClick={onClick}
      variant="outline"
    >
      Установить <Download className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default InstallPWA;
