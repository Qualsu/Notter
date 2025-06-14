"use client"

import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react" 
import { useTheme } from "next-themes" 

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover" 

interface IconPickerPorps {
  onChange: (icon: string) => void 
  children: React.ReactNode 
  asChild?: boolean 
}

export function IconPicker({
  onChange,
  children,
  asChild,
}: IconPickerPorps){
  const { resolvedTheme } = useTheme() 
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap 

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT
  } 

  const theme = themeMap[currentTheme] 

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full border-none p-0 shadow-none">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
          emojiStyle={EmojiStyle.TWITTER}
        />
      </PopoverContent>
    </Popover>
  ) 
} 