import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore('loader', () => {
  const isLoading = ref(false)

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  return {
    isLoading,
    setLoading
  }
})