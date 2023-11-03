import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppMenu = defineStore('menu', () => {
  const isVisible = ref(false)
  const filterMenuIsVisible = ref(false)

  const setMenuVisibility = (value: boolean) => isVisible.value = value
  const setFilterMenuVisibility = (value: boolean) => filterMenuIsVisible.value = value

  return {
    isVisible,
    setMenuVisibility,
    filterMenuIsVisible,
    setFilterMenuVisibility
  }
})