import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import API from '@/services/api'
import { useToastStore } from "./toast";
import { useLoadingStore } from "./loader";

export const useIncomeStore = defineStore('income', () => {
  const initialIncomeValue: { amount: null | number } = { amount: null }
  const income = reactive({ ...initialIncomeValue })
  const incomeDialogVisible = ref(false)
  const addedIncome = ref()

  watch(() => incomeDialogVisible.value, (val: boolean) => {
    if ( !val ) 
      resetDialog()
  
    if ( addedIncome.value )
      income.amount = Number(addedIncome.value)
  })


  const resetDialog = () => {
    Object.assign(income, initialIncomeValue)
    incomeDialogVisible.value = false
  }

  const getIncome = () => {

    useLoadingStore().setLoading(true)

    return API.getIncome()
    .then(({ data }: { data: { amount: number | null } }) => {
      income.amount = data.amount
      addedIncome.value = data.amount // TODO: Fix this redundant assignment
    })
    .catch(err => console.log(`Error: ${ err }`))
    .finally(() => useLoadingStore().setLoading(false))
  }

  const createIncome = () => {
    if ( !income || Object.values(income).some(o => !o) ) 
      return
    
    useLoadingStore().setLoading(true)

    API.updateIncome({ data: income })
    .then(() => {
      resetDialog()
      getIncome()
      useToastStore().setToast(true, 'Income updated')
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const clearAll = () => Object.assign(income, initialIncomeValue)

  return {
    addedIncome,
    incomeDialogVisible,
    createIncome,
    income,
    resetDialog,
    getIncome,
    clearAll
  }
})