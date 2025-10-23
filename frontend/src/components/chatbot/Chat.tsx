import { useEffect, useRef, useState } from "react"
import { Message } from "./Message.tsx"
import MessageInput from "./MessageInput.tsx"
import type { UserType } from "@/types/User.ts"
import MessageProfile from "./MessageProfile.tsx"

type Message = {
  _id: string
  message: string
  otherUser?: UserType
  timestamp: string
}

type ChatProps = {
  otherUser: UserType
}

export default function Chat({ otherUser }: ChatProps) {
  const [messages, setMessages] = useState([
    {
      _id: "1",
      message: "Did the build pipeline finish?",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "2",
      otherUser,
      message: "Yes, the build passed. I'm starting the deployment to staging.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "3",
      message: "Nice. Any warnings we should check first?",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "4",
      otherUser,
      message: "Just a minor deprecation notice, nothing blocking.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "5",
      message: "Okay, let’s proceed. Monitor logs as it goes out.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "6",
      otherUser,
      message: "Staging deploy succeeded. Running smoke tests now.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "7",
      message: "Perfect. If tests are green, push to production.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "8",
      otherUser,
      message: "All tests passed. Triggering production deployment.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "9",
      message: "Remember to notify support before rollout.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "10",
      otherUser,
      message: "Already pinged them. They’re standing by.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "11",
      message: "How many servers updated so far?",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "12",
      otherUser,
      message: "About 30%. No errors in the logs yet.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "13",
      message: "Great. Keep an eye on latency metrics in Grafana.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "14",
      otherUser,
      message: "Latency is stable. Error rate unchanged.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "15",
      message: "Awesome. Let’s wait until rollout hits 75%.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "16",
      otherUser,
      message: "We just hit 75%. Everything still clean.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "17",
      message: "Alright, continue to 100%. Fingers crossed.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "18",
      otherUser,
      message: "Deployment complete. All servers updated successfully.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "19",
      message: "Nice work. Let’s tag the release and update the changelog.",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "20",
      otherUser,
      message: "Done. Release v1.2.0 deployed to production 🚀",
      timestamp: new Date().toISOString(),
    },
  ])
  const [unread, setUnread] = useState(0)
  const [autoStick, setAutoStick] = useState(true)

  const headerRef = useRef<HTMLDivElement | null>(null)
  const msgRefs = useRef<(HTMLDivElement | null)[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLDivElement | null>(null)
  const shouldScrollRef = useRef(false)
  const lastReadIndexRef = useRef<number>(messages.length - 1)

  const handleMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        otherUser,
        message,
        timestamp: new Date().toISOString(),
      },
    ])
    shouldScrollRef.current = true
  }

  const atBottom = () => {
    const c = scrollRef.current
    if (!c) return true
    const footerH = footerRef.current?.offsetHeight ?? 0
    const visibleBottom = c.scrollTop + c.clientHeight - footerH
    const epsilon = 2
    return visibleBottom >= c.scrollHeight - epsilon
  }

  const onScroll: React.UIEventHandler<HTMLDivElement> = () => {
    const stick = atBottom()
    setAutoStick(stick)
    if (stick) {
      lastReadIndexRef.current = messages.length - 1
      setUnread(0)
    }
  }

  const handleDelete = (_id: string) => {
    setMessages([...messages].filter((m) => m._id !== _id))
  }

  useEffect(() => {
    const pool = [
      "Got it.",
      "On my way.",
      "Let me check.",
      "Sounds good.",
      "Can we ship today?",
      "I pushed a fix.",
      "See screenshot.",
      "Ping me in 5.",
      "Deploying now.",
      "All green.",
    ]

    const tick = () => {
      const msg = pool[Math.floor(Math.random() * pool.length)]
      setMessages((prev) => [
        ...prev,
        {
          _id: (prev.length + 1).toString(),
          message: msg,
          timestamp: new Date().toISOString(),
        },
      ])
    }

    intervalRef.current = window.setInterval(tick, 10000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [otherUser])

  useEffect(() => {
    if (shouldScrollRef.current || autoStick) {
      shouldScrollRef.current = false
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      lastReadIndexRef.current = messages.length - 1
      setUnread(0)
    } else {
      const unreadCount = messages.length - 1 - lastReadIndexRef.current
      setUnread(unreadCount > 0 ? unreadCount : 0)
    }
  }, [messages, autoStick])

  const scrollToBottom = () => {
    const cont = scrollRef.current
    const footerH = footerRef.current?.offsetHeight ?? 0
    if (!cont) return
    const target = cont.scrollHeight - cont.clientHeight + footerH
    cont.scrollTo({ top: target, behavior: "smooth" })
    lastReadIndexRef.current = messages.length - 1
    setUnread(0)
  }

  const scrollToMessage = (i: number) => {
    const el = msgRefs.current[i]
    const cont = scrollRef.current
    const headerH = headerRef.current?.offsetHeight ?? 0
    if (!el || !cont) return

    const relTop = el.offsetTop - cont.offsetTop
    const target = Math.max(0, relTop - headerH - 8)
    cont.scrollTo({ top: target, behavior: "smooth" })
  }
  return (
    <div className="h-screen w-full overflow-hidden p-4 bg-white">
      <div className="mx-0 flex w-full flex-col rounded-lg">
        <div className="sticky flex top-0 z-10 w-full items-center">
          <MessageProfile otherUser={otherUser} />
        </div>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="py-5 h-[calc(100vh-200px)] overflow-y-scroll scrollable"
        >
          <div className="flex-1 space-y-4 flex flex-col justify-end px-4">
            {messages.map((m) => {
              const ts = new Date(m.timestamp)
              const now = new Date()
              const isToday =
                ts.getDate() === now.getDate() &&
                ts.getMonth() === now.getMonth() &&
                ts.getFullYear() === now.getFullYear()

              const timeStamp = isToday
                ? ts.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ts.toLocaleDateString([], {
                    day: "2-digit",
                    month: "short",
                  })
              return (
                <div
                  key={m._id}
                  ref={(el) => {
                    msgRefs.current[parseInt(m._id)] = el
                  }}
                  className="mb-10"
                >
                  <Message
                    _id={m._id}
                    direction={m.otherUser ? "right" : "left"}
                    otherUser={m.otherUser}
                    scrollToMessage={() => scrollToMessage(parseInt(m._id))}
                    onDelete={handleDelete}
                    timeStamp={timeStamp}
                  >
                    <div>{m.message}</div>
                  </Message>
                </div>
              )
            })}
            <div ref={bottomRef} />
            {unread > 0 && !autoStick && (
              <button
                onClick={() => {
                  scrollToBottom()
                  setUnread(0)
                }}
                className="absolute bottom-30 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-2 text-white text-sm shadow-lg"
              >
                New messages ({unread})
              </button>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex-shrink-0 p-3">
          <MessageInput handleMessage={handleMessage} />
        </div>
      </div>
    </div>
  )
}
