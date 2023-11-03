import { defineStore } from "pinia";
import { reactive, ref, watch, computed, watchEffect } from "vue";
import API from '@/services/api'
import { useToastStore } from "./toast";
import { useLoadingStore } from "./loader";
import pick from 'lodash/pick'
import get from "lodash/get";

export type IncomeType = {
  amount: number
  userId: string
  _id: string
  name?: string
}

export const useIncomeStore = defineStore('income', () => {
  const initialIncomeValue: { 
    amount: null | number, 
    name?: string | null,
    _id: string | null
  } = { amount: null, name: null, _id: null }

  const income = reactive({ ...initialIncomeValue })
  const incomeDialogVisible = ref(false)
  const addedIncome = ref()
  const addNew = ref(false)
  const isEditMode = ref(false)
  const incomeList = ref([] as IncomeType[])

  watch(() => incomeDialogVisible.value, (val: boolean) => {
    if ( !val ) 
      resetDialog()
    else
      // getIncome() //TODO:: Maybe remove later
  
    if ( addedIncome.value )
      income.amount = Number(addedIncome.value)
  })

  watchEffect(() => {
    // Set amount field to null if creating new income
    if ( addNew.value && !isEditMode.value ) {
      income.amount = null
      income._id = null
    }
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
    .then(({ data }: { data: { amount: number | null, _id: string | null } }) => {
      income.amount = data.amount || null
      income._id = data._id || null
      addedIncome.value = data.amount || 0 // TODO: Fix this redundant assignment
    })
    .catch(err => console.log(`Error: ${ err }`))
    .finally(() => useLoadingStore().setLoading(false))
  }

  const createIncome = () => {
    if ( addNew.value )
      if ( !get(income, 'name', null) ) 
        return

    useLoadingStore().setLoading(true)

    if ( income._id ) {
      return updateIncome()
    } 

    return API.createIncome({ data: income })
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

    // if ( isEditMode.value ) {
    //   // We need change field name to match database collection field name
    //   Object.assign(income, { ...income, editNew: isEditMode.value })
    // }
  }

  const updateIncome = () => {
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
    if ( addNew.value )
      addNew.value = false

    // Set edit mode
    isEditMode.value = true

    //- Merge income data to display field values in modal
    console.log({ ...pick(params, ['_id', 'name', 'amount']) });
    Object.assign(income, { ...pick(params, ['_id', 'name', 'amount']) })
  }
  
  const deleteIncome = () => {
    useLoadingStore().setLoading(true)

    return API.deleteIncome(income._id as string)
    .then(() => {
      resetDialog()
      getIncome()
      listIncome()
      useToastStore().setToast(true, 'Income deleted')
    })
    .catch(err => console.log(`Error: ${ err }`))
    .finally(() => useLoadingStore().setLoading(false))
  }

  const clearAll = () => Object.assign(income, { ...initialIncomeValue })

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
    editIncome,
    deleteIncome,
    isEditMode
  }
})