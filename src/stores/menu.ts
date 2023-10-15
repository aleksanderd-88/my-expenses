import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppMenu = defineStore('menu', () => {
  const isVisible = ref(false)

  const setMenuVisibility = (value: boolean) => isVisible.value = value

  return {
    isVisible,
    setMenuVisibility
  }
})