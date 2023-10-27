import { defineStore } from "pinia";
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref(JSON.parse(localStorage.getItem('mode') as string) || '')

  //- value params should be 'light' | 'dark'
  const setTheme = (value: string) => {
    if ( value === 'light' )
      document.body.classList.remove('dark')

    mode.value = value
    document.body.classList.add(value)
    localStorage.setItem('mode', JSON.stringify(value))
  }

  const isDarkMode = computed(() => mode.value === 'dark')

  return {
    setTheme,
    isDarkMode
  }
})