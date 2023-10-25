import { defineStore } from "pinia";
import { reactive, ref, watch, computed } from "vue";
import API from '@/services/api'
import { useToastStore } from "./toast";
import { useLoadingStore } from "./loader";
import pick from 'lodash/pick'

export type IncomeType = {
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
  const isEditMode = ref(false)
  const incomeList = ref([] as IncomeType[])

  watch(() => incomeDialogVisible.value, (val: boolean) => {
    if ( !val ) 
      resetDialog()
  
    if ( addedIncome.value )
      income.amount = Number(addedIncome.value)
  })

  const calculatedTotalIncome = computed(() => incomeList.value.reduce((sum, item) => sum += item.amount, addedIncome.value))

  const resetDialog = () => {
    Object.assign(income, { ...initialIncomeValue })
    incomeDialogVisible.value = false
    addNew.value = false
    isEditMode.value = false
  }

  const getIncome = () => {

    useLoadingStore().setLoading(true)

    return API.getIncome()
    .then(({ data }: { data: { amount: number | null } }) => {
      income.amount = data.amount
      addedIncome.value = data.amount || 0 // TODO: Fix this redundant assignment
    })
    .catch(err => console.log(`Error: ${ err }`))
    .finally(() => useLoadingStore().setLoading(false))
  }

  const createIncome = () => {
    const requiredFields = addNew.value ? pick(income, ['newAmount', 'newName']) : pick(income, ['amount'])
    if ( !income || Object.values(requiredFields).some(o => !o) ) 
      return

    useLoadingStore().setLoading(true)

    if ( addNew.value && !isEditMode.value ) {
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

    if ( isEditMode.value ) {
      // We need change field name to match database collection field name
      Object.assign(income, { name: income.newName, amount: income.newAmount, editNew: isEditMode.value })
    }
    
    API.updateIncome({ data: income })
    .then(() => {
      resetDialog()
      getIncome()
      listIncome()
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
  
  const editIncome = (params: IncomeType) => {
    addNew.value = true
    // Set edit mode
    isEditMode.value = true

    //- Merge income data to display field values in modal
    Object.assign(income, {
      newName: params.name,
      newAmount: params.amount,
      _id: params._id
    })
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
    incomeList,
    calculatedTotalIncome,
    editIncome
  }
})