import { defineStore } from "pinia";
import { computed, ref } from "vue";
import API from '@/services/api'
import { useLoadingStore } from "./loader";
import { useToastStore } from "./toast";

type UserPropType = {
  name?: string | null
  email: string | null
  password: string | null
  verifiedPassword?: string | null
  token?: string | null
}

type UserResponseType = Omit<UserPropType, 'verifiedPassword'>

export const useUserStore = defineStore('user', () => {
  const user = ref({} as UserResponseType)

  const createUser = (params: UserPropType) => {
    useLoadingStore().setLoading(true)
    
    return API.createUser({ data: params })
    .then(({ data }: { data: UserPropType }) => setUser(data))
    .catch((err) => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const authUser = (params: UserPropType) => {
    useLoadingStore().setLoading(true)
    
    return API.authUser({ data: params })
    .then(({ data }: { data: UserPropType }) => setUser(data))
    .catch((err) => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const setUser = (data: UserResponseType) => {
    user.value = data
    localStorage.setItem('__user__', JSON.stringify(user.value))
  }

  const currentUser = computed(() => user.value)

  return {
    createUser,
    currentUser,
    authUser,
    setUser
  }
})