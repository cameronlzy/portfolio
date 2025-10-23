import http from "./httpService"
import type { UserType } from "@/types/User.ts"

const apiEndpoint = import.meta.env.VITE_API_URL + "/users"

export async function getOwner() {
  const { data } = await http.get<{ data: { user: UserType } }>(
    `${apiEndpoint}/owner`
  )
  return data.data.user
}
