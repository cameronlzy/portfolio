import * as React from "react"
import type { KeyboardEvent } from "react"

type OptionProps = {
  index: number
  focusIndex: number
  setFocusIndex: (i: number) => void
  optionCount: number
  onClick: (value: string) => void
  text: string
  onClose: () => void
  icon?: React.ReactNode
}

const Option = React.forwardRef<HTMLButtonElement, OptionProps>(
  (
    {
      index,
      focusIndex,
      setFocusIndex,
      optionCount,
      onClick,
      text,
      onClose,
      icon,
    },
    ref
  ) => {
    const handleSelect = () => {
      onClick(text)
      onClose()
    }

    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleSelect()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusIndex((focusIndex + 1) % optionCount)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusIndex((focusIndex - 1 + optionCount) % optionCount)
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    return (
      <button
        ref={ref}
        role="menuitem"
        tabIndex={focusIndex === index ? 0 : -1}
        onClick={handleSelect}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition active:scale-[0.99]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-slate-200 focus-visible:ring-offset-2`}
      >
        <span className="flex items-center gap-2">
          {icon}
          <span className="truncate">{text}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4 opacity-60"
        >
          <path d="M7 5l5 5-5 5" fill="currentColor" />
        </svg>
      </button>
    )
  }
)

Option.displayName = "Option"
export default Option
