import { useRef, useState, useLayoutEffect, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Menu from "./Menu.tsx"
import { Trash2 } from "lucide-react"

type MessageProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  _id: string
  direction?: "left" | "right"
  otherUser?: { name: string }
  scrollToMessage?: () => void
  onDelete: (_id: string) => void
  timeStamp: string
}

export function Message(props: MessageProps) {
  const {
    _id,
    direction = "left",
    otherUser,
    scrollToMessage,
    onDelete,
    timeStamp,
    children,
    className,
    ...rest
  } = props

  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const rounded =
    direction === "left"
      ? "rounded-tr-full rounded-br-full rounded-bl-full"
      : "rounded-tl-full rounded-bl-full rounded-br-full"

  const contentRef = useRef<HTMLDivElement>(null)
  const selfRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(0)

  useLayoutEffect(() => {
    if (contentRef.current) setH(contentRef.current.scrollHeight)
  }, [open, children])

  useEffect(() => {
    if (!open) return
    if (scrollToMessage) {
      scrollToMessage()
    } else {
      selfRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [open, scrollToMessage])

  useEffect(() => {
    if (!open) return
    const first = menuContainerRef.current?.querySelector<HTMLElement>(
      'button,[role="menuitem"],[tabindex]:not([tabindex="-1"])'
    )
    first?.focus()
  }, [open])

  const handleDelete = () => {
    setOpen(false)
    setIsDeleting(true)
  }

  const items = otherUser
    ? [
        {
          text: "Delete for me",
          onClick: handleDelete,
          icon: <Trash2 className="h-4 w-4" />,
        },
        {
          text: `Delete for me and ${otherUser.name}`,
          onClick: handleDelete,
          icon: <Trash2 className="h-4 w-4" />,
        },
      ]
    : [
        {
          text: "Delete for me",
          onClick: handleDelete,
          icon: <Trash2 className="h-4 w-4" />,
        },
      ]

  const msgTextId = `msg-${_id}-text`
  const metaId = `msg-${_id}-meta`
  const buttonId = `msg-${_id}-button`
  const menuId = `msg-${_id}-menu`

  const onKeyDownBubble: React.KeyboardEventHandler<HTMLButtonElement> = (
    e
  ) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(true)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          ref={selfRef}
          role="listitem"
          aria-label={
            otherUser ? `Message from ${otherUser.name}` : "Message from you"
          }
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (isDeleting) onDelete(_id)
          }}
          className={cn(
            "relative flex mb-1",
            direction === "left" ? "justify-start" : "justify-end"
          )}
        >
          <div
            className={cn(
              "relative inline-flex w-fit max-w-[20rem] flex-col gap-1",
              direction === "left" ? "items-start" : "items-end"
            )}
          >
            <button
              ref={buttonRef}
              id={buttonId}
              aria-haspopup="menu"
              aria-controls={open ? menuId : undefined}
              aria-expanded={open}
              aria-describedby={metaId}
              onKeyDown={onKeyDownBubble}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "mx-4 w-fit break-words whitespace-pre-wrap px-5 py-3 font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-zinc-900",
                direction === "right"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-black hover:bg-gray-200",
                rounded,
                className
              )}
              {...rest}
            >
              <span id={msgTextId}>{children}</span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: h, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className={cn(
                    direction === "left" ? "self-start" : "self-end",
                    "overflow-hidden w-full"
                  )}
                >
                  <div
                    ref={contentRef}
                    className={cn(
                      "absolute mt-1",
                      direction === "left" ? "left-4" : "right-4"
                    )}
                  >
                    <div
                      ref={menuContainerRef}
                      id={menuId}
                      role="menu"
                      aria-labelledby={buttonId}
                    >
                      <Menu onClose={() => setOpen(false)} options={items} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={cn(
              "absolute text-xs bottom-0 translate-y-7",
              direction === "left" ? "left-4 text-left" : "right-4 text-right"
            )}
            aria-hidden="true"
          >
            {timeStamp}
          </div>

          <span id={metaId} className="sr-only">
            {otherUser ? `From ${otherUser.name}. ` : "From you. "}
            Sent at {timeStamp}.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
