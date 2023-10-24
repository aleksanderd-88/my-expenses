import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import API from '@/services/api'
import { useToastStore } from "./toast";
import { useLoadingStore } from "./loader";

type IncomeType = {
  amount: number
  userId: string
  _id: string
  name?: string
}

export const useIncomeStore = defineStore('income', () => {
  const initialIncomeValue: { 
    amount: null | number, 
    newName?: string | null,
    newAmount?: number | null
  } = { amount: null, newName: null, newAmount: null }

  const income = reactive({ ...initialIncomeValue })
  const incomeDialogVisible = ref(false)
  const addedIncome = ref()
  const addNew = ref(false)
  const incomeList = ref([] as IncomeType[])

  watch(() => incomeDialogVisible.value, (val: boolean) => {
    if ( !val ) 
      resetDialog()
  
    if ( addedIncome.value )
      income.amount = Number(addedIncome.value)
  })


  const resetDialog = () => {
    Object.assign(income, { ...initialIncomeValue })
    incomeDialogVisible.value = false
    addNew.value = false
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

    if ( addNew.value ) {
      return API.createIncome({ data: { name: income.newName, amount: income.newAmount }})
      .then(() => {
        resetDialog()
        getIncome()
        listIncome()
        useToastStore().setToast(true, 'New income added')
      })
      .catch(err => {
        console.log(`Error: ${ err }`)
        useToastStore().setToast(true, err, true)
      })
      .finally(() => useLoadingStore().setLoading(false))
    }

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

  const listIncome = () => {
    useLoadingStore().setLoading(true)

    return API.listIncome()
    .then(({ data }: { data: IncomeType[] }) => {
      incomeList.value = data
    })
    .catch(err => console.log(`Error: ${ err }`))
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
    clearAll,
    addNew,
    listIncome,
    incomeList
  }
})