import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import API from '@/services/api'
import { useLoadingStore } from "./loader";
import { useToastStore } from "./toast";
import { useAppMenu } from "./menu";
import router from "@/router";

type UserPropType = {
  _id: string
  name?: string | null
  email: string | null
  password: string | null
  verifiedPassword?: string | null
  token?: string | null
}

type UserResponseType = Omit<UserPropType, 'verifiedPassword'> | null

export const useUserStore = defineStore('user', () => {
  const user = ref<UserResponseType | null>(null)

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

  const getUser = (id: string) => {
    useLoadingStore().setLoading(true)
    
    return API.getUser(id)
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
    if ( !data ) {
      console.log(data);
      return clearUser()
    }

    user.value = data
    localStorage.setItem('__user__', JSON.stringify(user.value))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('__user__')
  }

  const currentUser = computed(() => user.value)

  watch(() => currentUser.value, val => {
    if ( !val ) {
      useAppMenu().setMenuVisibility(false)
      return router.replace({ name: 'login' })
    }
  })

  return {
    createUser,
    currentUser,
    authUser,
    setUser,
    getUser,
    clearUser
  }
})