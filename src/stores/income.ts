import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import API from '@/services/api'

export const useIncomeStore = defineStore('income', () => {
  const initialIncomeValue: { amount: null | number } = { amount: null }
  const data = reactive({ ...initialIncomeValue })
  const incomeDialogVisible = ref(false)

  watch(() => incomeDialogVisible.value, (val: boolean) => {
    if ( !val ) 
      resetDialog()
  
    if ( addedIncome.value )
      data.amount = Number(addedIncome.value)
  })

  const addedIncome = computed(() => data.amount)

  const resetDialog = () => {
    Object.assign(data, initialIncomeValue)
    incomeDialogVisible.value = false
  }

  const createIncome = () => {
    if ( !data || Object.values(data).some(o => !o) ) 
      return
  
    API.updateIncome({ data })
      .then(() => resetDialog())
      .catch(err => console.log(`Error: ${ err }`))
  }

  return {
    addedIncome,
    incomeDialogVisible,
    data,
    createIncome,
    resetDialog
  }
})