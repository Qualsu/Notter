"use client" 

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog" 
import { ModeToggle } from "../mode-toggle" 
import { useSettings } from "../../../hooks/use-settings" 
import { Label } from "../ui/label" 
import { Separator } from "@radix-ui/react-dropdown-menu"
import { SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function SettingsModal(){
  const settings = useSettings() 
  const router = useRouter()

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Настройки</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Тема</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Настройте Notter, для комфортной работы
            </span>
          </div>
          <ModeToggle />
        </div>
        <Separator/>
        <div onClick={() => {router.push("/"); settings.onClose()}} className="m-auto hover:text-primary/80">
          <SignOutButton>
              Выйти из аккаунта
          </SignOutButton>
        </div>
      </DialogContent>
    </Dialog>
  ) 
} 