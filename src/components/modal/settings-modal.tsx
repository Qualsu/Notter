import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { ModeToggle } from "../mode-toggle"
import { useSettings } from "../../../hooks/use-settings"
import { Label } from "../ui/label"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { SignOutButton, useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { getById as getUserById } from "../../../server/users/user"
import { getById as getOrgById } from "../../../server/orgs/org"
import { updateUser } from "../../../server/users/user"
import { updateOrg } from "../../../server/orgs/org"

export function SettingsModal() {
  const settings = useSettings()
  const router = useRouter()
  const { user } = useUser()
  const { organization } = useOrganization()
  const [isPrivated, setIsPrivated] = useState<boolean>(false)
  const [watermark, setWatermark] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>(null)
  const isOrg = organization?.id !== undefined
  const id = isOrg ? organization?.id : user?.id as string

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const data = isOrg ? await getOrgById(id) : await getUserById(id)
        if (data) {
          setUserData(data)
          setIsPrivated(data.privated || false)
          setWatermark(data.watermark || false) // Устанавливаем watermark, если premium === 2
        }
      }
    }

    fetchData()
  }, [user, id, isOrg])

  const handlePrivacyToggle = async (value: boolean) => {
    setIsPrivated(value)

    if (id) {
      if (isOrg) {
        await updateOrg(id, null, null, null, null, value)
      } else {
        await updateUser(id, null, null, null, null, value)
      }

      return null
    }
  }

  const handleWatermarkToggle = async (value: boolean) => {
    setWatermark(value)

    if (id) {
      if (isOrg) {
        await updateOrg(id, null, null, null, null, null, null, null, null, null, value)
      } else {
        await updateUser(id, null, null, null, null, null, null, null, null, value)
      }
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

        {(userData?.owner === user?.id || !isOrg) && (
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
        )}

        {(userData?.premium === 2 && userData?.owner === user?.id || !isOrg) && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label>Логотип Notter</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Убрать логотип с публичных заметок
              </span>
            </div>
            <Switch
              checked={watermark}
              onCheckedChange={handleWatermarkToggle}
            />
          </div>
        )}

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