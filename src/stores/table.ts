import { defineStore } from "pinia";
import { ref } from 'vue'
import { useToastStore } from "./toast";

export type ModeTypes = 'list' | 'category' | 'paid'

export const useTableStore = defineStore('table', () => {
  const mode = ref('list')
  
  const setLayoutMode = (value: ModeTypes) => {
    mode.value = value
    useToastStore().setToast(true, `Now displaying ${ mode.value } view`)
  }
  
  return {
    setLayoutMode,
    mode
  }
})