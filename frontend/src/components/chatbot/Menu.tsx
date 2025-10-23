import { useEffect, useRef, useState } from "react"
import Option from "./common/Option"

export default function Menu({
  options,
  onClose,
}: {
  options: {
    text: string
    onClick: (v: string) => void
    icon: React.ReactNode
  }[]
  onClose: () => void
}) {
  const [focusIndex, setFocusIndex] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    refs.current[focusIndex]?.focus()
  }, [focusIndex])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setFocusIndex((p) => (p + 1) % options.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setFocusIndex((p) => (p - 1 + options.length) % options.length)
    } else if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="w-56 rounded-xl bg-gray-100 text-slate-900 shadow-xl ring-1 ring-slate-200 p-1"
    >
      {options.map((opt, idx) => (
        <Option
          icon={opt.icon}
          key={opt.text}
          ref={(el) => {
            refs.current[idx] = el
          }}
          index={idx}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          optionCount={options.length}
          text={opt.text}
          onClick={opt.onClick}
          onClose={onClose}
        />
      ))}
    </div>
  )
}
