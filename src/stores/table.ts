import { defineStore } from "pinia";
import { ref } from 'vue'
import { useToastStore } from "./toast";

export type ModeTypes = 'list' | 'category' | 'paid' | 'unpaid'

export const useTableStore = defineStore('table', () => {
  const mode = ref('list')
  
  const setLayoutMode = (value: ModeTypes) => {
    mode.value = value
    const text = {
      'list': 'All expenses',
      'category': 'Category view',
      'paid': 'Paid expenses',
      'unpaid': 'Unpaid expenses'
    }
    useToastStore().setToast(true, `Now displaying ${ text[mode.value] }`)
  }
  
  return {
    setLayoutMode,
    mode
  }
})