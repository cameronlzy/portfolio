import type { UserType } from "@/types/User"
import { User, ArrowLeft, MoreVertical } from "lucide-react"
import { useNavigate } from "react-router-dom"

const MessageProfile = ({ otherUser }: { otherUser: UserType }) => {
  const navigate = useNavigate()

  return (
    <div className="flex w-full items-center justify-between px-4 py-2 rounded-full bg-gray-100 inset-x-0 top-0">
      {/* Left section: user avatar + name */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
          <User className="h-6 w-6 text-black" />
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-black">{otherUser.name}</span>
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Always active
          </span>
        </div>
      </div>

      {/* Right section: actions */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-full hover:bg-gray-300 transition"
          onClick={() => navigate("/")}
        >
          <span className="sr-only">Back</span>
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-300 transition">
          <span className="sr-only">Menu</span>
          <MoreVertical className="h-5 w-5 text-black" />
        </button>
      </div>
    </div>
  )
}

export default MessageProfile
