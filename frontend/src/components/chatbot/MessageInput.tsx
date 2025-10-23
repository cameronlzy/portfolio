import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Mic, Send } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageInputProps = {
  handleMessage: (value: string) => void
  placeholder?: string
  className?: string
}

const MessageInput = ({
  handleMessage,
  placeholder = "Type a message...",
  className,
}: MessageInputProps) => {
  const [value, setValue] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    handleMessage(v)
    setValue("")
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex items-center gap-3", className)}
    >
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-full border border-gray-300 bg-white pr-12 pl-4 text-[15px] focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <button
          type="button"
          aria-label="Voice input"
          className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <Mic size={18} />
        </button>
      </div>

      <Button
        type="submit"
        disabled={!value.trim()}
        className="grid h-12 w-12 place-items-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        <Send size={18} />
      </Button>
    </form>
  )
}

export default MessageInput
