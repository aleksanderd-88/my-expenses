import { useUserStore } from "@/stores/user"

export const isLoggedIn = (): boolean => {
  const user = useUserStore().currentUser
  return !!user
}