import { defineStore } from "pinia";
import { ref } from 'vue'
import { useToastStore } from "./toast";

type modePropType = 'list' | 'category'

export const useTableStore = defineStore('table', () => {
  const mode = ref('list' as modePropType)
  const isCategoryMode = ref(false)

  const setLayoutMode = () => {
    isCategoryMode.value = !isCategoryMode.value
    mode.value = isCategoryMode.value ? 'category' : 'list'
    useToastStore().setToast(true, `Layout has been change to ${ mode.value } mode`)
  }
  
  return {
    setLayoutMode,
    mode
  }
})