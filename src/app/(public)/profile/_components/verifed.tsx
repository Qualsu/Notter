import { Check } from 'lucide-react'
import { useState } from 'react'

type VerifedBadgeProps = {
  text: string;
  size: number;
  clicked?: boolean;
  down?: boolean;
}

export default function VerifedBadge({ text, size, clicked = false, down = false }: VerifedBadgeProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    if (clicked) {
      setIsClicked(!isClicked)
    }
  }

  const handleMouseLeave = () => {
    if (clicked && isClicked) {
      setIsClicked(false)
    }
  }

  return (
    <div
      className="relative select-none sm:block group"
      onMouseLeave={handleMouseLeave}
    >
      <Check
        className={`w-${size} h-${size} text-yellow-400 transform transition-transform duration-200 hover:scale-110 cursor-pointer`}
        onClick={handleClick}
      />
      <span
        className={`absolute ${down ? "top-5 ml-8" : "-top-8"} left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs transition-opacity duration-200 text-center whitespace-nowrap text-yellow-200 
          ${clicked ? (isClicked ? 'opacity-100' : 'opacity-0') : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        {text}
      </span>
    </div>
  )
}
