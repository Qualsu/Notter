"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { ModeToggle } from "../mode-toggle"
import { useSettings } from "../../../hooks/use-settings"
import { Label } from "../ui/label"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch" // импортируем компонент Switch из Shadcn UI
import { getById, updateUser } from "../../../server/users/user"

export function SettingsModal() {
  const settings = useSettings()
  const router = useRouter()
  const { user } = useUser()
  const [isPrivated, setIsPrivated] = useState<boolean>(false)

  useEffect(() => {
    if (user?.id) {
      const fetchUserData = async () => {
        const userData = await getById(user.id)
        if (userData) {
          setIsPrivated(userData.privated || false)
        }
      }

      fetchUserData()
    }
  }, [user])

  const handlePrivacyToggle = async (value: boolean) => {
    setIsPrivated(value)

    if (user?.id) {
      await updateUser(user.id, null, null, null, null, value)
    }
  }

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
              Настройте Notter для комфортной работы
            </span>
          </div>
          <ModeToggle />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Приватный профиль</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Скройте свои заметки от лишних глаз
            </span>
          </div>
          <Switch
            checked={isPrivated}
            onCheckedChange={handlePrivacyToggle}
          />
        </div>

        <Separator />
        <div
          onClick={() => {
            router.push("/")
            settings.onClose()
          }}
          className="m-auto hover:text-primary/80"
        >
          <SignOutButton>Выйти из аккаунта</SignOutButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
