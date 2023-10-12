import { defineStore } from "pinia";
import { ref } from 'vue'

type modePropType = 'list' | 'category'

export const useTableStore = defineStore('table', () => {
  const mode = ref('list' as modePropType)
  const isCategoryMode = ref(false)

  const setLayoutMode = () => {
    isCategoryMode.value = !isCategoryMode.value
    mode.value = isCategoryMode.value ? 'category' : 'list'
  }
  
  return {
    setLayoutMode,
    mode
  }
})