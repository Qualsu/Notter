"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useMutation, useQuery } from "convex/react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Check, Copy, Globe } from "lucide-react"
import { Doc } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"
import { Checkbox } from "@/components/ui/checkbox"
import { useOrigin } from "../../../../hooks/use-origin"
import { Protect, useOrganization, useUser } from "@clerk/nextjs"
import { getById as getUserByID, updateUser } from "../../../../server/users/user"
import { getById as getOrgByID, updateOrg } from "../../../../server/orgs/org"
import { User } from "../../../../server/users/types"
import { Org } from "../../../../server/orgs/types"

interface PublishProps {
  initialData: Doc<"documents">
}

export function Publish({ initialData }: PublishProps) {
  const origin = useOrigin()
  const update = useMutation(api.document.update)
  const { user } = useUser()
  const { organization } = useOrganization()

  const isOrg = organization?.id !== undefined
  const orgId = (isOrg ? organization?.id : user?.id) as string

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publicDocumentLimit, setPublicDocumentLimit] = useState<number>(10)
  const [userData, setUserData] = useState<User | Org | null>(null)

  const [isShortUrl, setIsShortUrl] = useState<boolean>(Boolean(initialData.isShort))
  const [customShortId, setCustomShortId] = useState<string>(initialData.shortId || '')
  const [previousShortId, setPreviousShortId] = useState<string>(initialData.shortId || '') // Состояние для предыдущего значения
  const [editingShortId, setEditingShortId] = useState<boolean>(false)

  useEffect(() => {
    setIsShortUrl(Boolean(initialData.isShort))
  }, [initialData.isShort])

  const currentPublicDocuments = useQuery(api.document.getPublicDocumentCount, {
    userId: orgId
  })

  const fetchUserData = async () => {
    if (!orgId) return
    const u = isOrg ? await getOrgByID(orgId) : await getUserByID(orgId)
    if (u) {
      setUserData(u)
      setPublicDocumentLimit(u.premium === 1 ? 100 : u.premium === 2 ? 1000 : 10)
    }
  }

  useEffect(() => {
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, isOrg])

  // Проверка премиума и автоматическое снятие галочки
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    const next = checked === true

    // Если уровень премиума равен 0, сбрасываем галочку и ссылку
    if (userData?.premium === 0 && next) {
      setIsShortUrl(false) // Снимаем галочку
      setCustomShortId(initialData.shortId)  // Очищаем ссылку
      toast.error("Для использования сокращенных ссылок требуется премиум уровень 1 или 2")
      return
    }

    setIsShortUrl(next)
    setCustomShortId(initialData.shortId) // Сбрасываем значение customShortId, если чекбокс не активен
    setEditingShortId(false) // Выключаем редактирование при отключении чекбокса
    update({
      id: initialData._id,
      isPublished: initialData.isPublished,
      userId: orgId,
      lastEditor: user?.username as string,
      isShort: next,
    }).catch(() => toast.error("Не удалось обновить параметр ссылки"))
  }

  const handleCustomShortIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShortId = e.target.value
    setCustomShortId(newShortId)
  }

  const handleValidateAndSave = () => {
    // Проверяем на валидность только если поле не пустое
    if (customShortId === "") {
      toast.error("Ссылка не может быть пустой.")
      setCustomShortId(previousShortId) // Сброс значения на предыдущее
      return
    }

    // Проверка на допустимые символы
    if (!/^[a-z0-9-]*$/i.test(customShortId) || customShortId.length < 4 || customShortId.length > 30) {
      toast.error("ShortId должен содержать от 4 до 30 символов и только буквы, цифры и дефис.")
      setCustomShortId(previousShortId) // Сброс значения на предыдущее
      return
    }

    // Если все проверки прошли, сохраняем новое значение и отправляем запрос
    setPreviousShortId(customShortId) // Обновляем предыдущее значение
    update({
      id: initialData._id,
      isPublished: initialData.isPublished,
      userId: orgId,
      lastEditor: user?.username as string,
      shortId: customShortId,  // Устанавливаем новый shortId
      isShort: true,  // Включаем флаг isShort
    }).catch(() => toast.error("Не удалось обновить ShortId"))
  }

  const handleBlur = () => {
    setEditingShortId(false)
    // Если валидация прошла успешно, показываем toast
    handleValidateAndSave()

    // Показываем успешный toast, если нет ошибок
    if (customShortId !== previousShortId) {
      toast.success("Ссылка успешно обновлена!")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleValidateAndSave()
    }
  }

  const url = isShortUrl
    ? `${origin}/${customShortId}`
    : `${origin}/view/${initialData._id}`

  const onPublish = async () => {
    if (currentPublicDocuments !== undefined && (currentPublicDocuments as number) >= publicDocumentLimit) {
      toast.error(`Вы достигли лимита на публикацию в ${publicDocumentLimit} публичных заметок`)
      return
    }
    setIsSubmitting(true)
    const promise = update({
      id: initialData._id,
      isPublished: true,
      userId: orgId,
      lastEditor: user?.username as string,
      isShort: isShortUrl,
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: "Публикуем...",
      success: "Заметка опубликована!",
      error: "Не удалось опубликовать",
    })
  }

  const onUnpublish = async () => {
    setIsSubmitting(true)
    const promise = update({
      id: initialData._id,
      isPublished: false,
      userId: orgId,
      lastEditor: user?.username as string,
      isShort: isShortUrl,
    }).finally(() => setIsSubmitting(false))

    if (userData?.pined === initialData._id) {
      if (isOrg) {
        await updateOrg(orgId, null, null, null, null, null, "")
      } else {
        await updateUser(orgId, null, null, null, null, null, "")
      }
    }

    toast.promise(promise, {
      loading: "Отменяем публикацию...",
      success: "Заметка убрана с публикации!",
      error: "Не удалось отменить публикацию",
    })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const canUseShort = userData?.premium === 1 || userData?.premium === 2
  const canUseCustomShort = userData?.premium === 2 // Только для premium 2

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" variant="ghost">
          Опубликовать
          {initialData.isPublished && <Globe className="h-4 w-4 text-sky-500" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                Эта заметка находится в открытом доступе
              </p>
            </div>

            <div className="flex items-center">
              <input
                value={editingShortId ? customShortId : url}
                className="h-8 flex-1 rounded-l-md border bg-muted px-2 text-xs"
                onClick={() => {
                  if (isShortUrl && canUseCustomShort) { // Условие для редактирования только при премиум 2
                    setEditingShortId(true); // Активируем редактирование, только если стоит галочка и премиум 2
                  }
                }}
                onBlur={handleBlur}
                onChange={handleCustomShortIdChange}
                onKeyPress={handleKeyPress} // Добавляем обработчик для клавиши Enter
                autoFocus
                disabled={!isShortUrl || !canUseCustomShort} // Делаем поле неактивным, если не стоит галочка или премиум не 2
              />
              <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex flex-row items-center">
              <Checkbox
                checked={isShortUrl}
                onCheckedChange={handleCheckboxChange}
                disabled={!canUseShort} // Чекбокс доступен только для премиум 1 и 2
              />
              <p className="ml-1 text-xs">
                Сократить ссылку
                <span className="italic">{!canUseShort && " (доступно с тарифа Amber)"}</span>
              </p>
            </div>

            <Protect
              condition={(check) => check({ role: "org:admin" }) || organization?.id === undefined}
              fallback={<></>}
            >
              <Button
                size="sm"
                className="w-full text-xs"
                disabled={isSubmitting}
                onClick={onUnpublish}
              >
                Отменить публикацию
              </Button>
            </Protect>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground" />
            <p>Поделитесь своей заметкой</p>
            <Protect
              condition={(check) => check({ role: "org:admin" }) || organization?.id === undefined}
              fallback={
                <span className="text-[0.7rem] text-muted-foreground text-center w-full block">
                  Публиковать могут только администраторы организации
                </span>
              }
            >
              <span className="mb-2 text-xs text-muted-foreground">
                Поделитесь своими мыслями с другими
              </span>
              <Button
                disabled={isSubmitting}
                onClick={onPublish}
                className="w-full text-xs"
                size="sm"
              >
                Опубликовать
              </Button>
            </Protect>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
