import { formatCurrency } from "@/utils/formatter";
import { defineStore } from "pinia";
import { ref, computed, reactive, watch } from 'vue'
import API from '@/services/api'
import Sugar from 'sugar-date'
import { useToastStore } from "./toast";
import { useLoadingStore } from "./loader";
import omit from 'lodash/omit'

type RowType = {
  _id: string
  no: number
  name: string
  cost: number
  isPaid: boolean
  strCost: string
  paymentDue: string
  paidAt: string
  createdAt: string
  categoryId: string
}

export const useExpenseStore = defineStore('expense', () => {
  const expenseInitialValue = {
    name: null,
    cost: null,
    paymentDue: null,
    categoryId: null
  }

  const data = reactive({ ...expenseInitialValue })
  const rowData = ref<RowType | null>(null)
  const editMode = ref(false)
  const expenseDialogVisible = ref(false)
  const expenseMonth = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })
  const endOfMonth = computed(() => Sugar.Date(expenseMonth.value).endOfMonth().raw)

  const table = reactive({
    isLoading: false,
    columns: [
      {
        label: "No.",
        field: "no",
        width: "1%",
        sortable: true,
        isKey: true,
      },
      {
        label: "Expense name",
        field: "name",
        width: "5%",
        sortable: true,
      },
      {
        label: "Cost",
        field: "strCost",
        width: "5%",
        sortable: true,
      },
      {
        label: "Payment due",
        field: "paymentDue",
        width: "5%",
        sortable: true,
      },
      {
        label: "Paid at",
        field: "paidAt",
        width: "5%",
        sortable: true,
      }
    ],
    rows: [] as RowType[],
    totalRecordCount: 0,
    sortable: {
      order: "no",
      sort: "asc",
    },
  })

  watch(() => expenseDialogVisible.value, (val: boolean) => {
    if ( !val )
      return resetDialog()
  })

  
  const copyPrevious = ref(false)
  const expense = computed(() => data)
  const rowsLength = computed(() => table.rows.length)
  const expenseIsPaid = computed(() => rowData.value?.isPaid)
  
  const doSearch = (offset: number, limit: number, order: string, sort: string, date: Date) => {
    console.log(offset, limit, order, sort, date);
    useLoadingStore().setLoading(true)

    return API.listExpenses({ data: { date }}).then(({ data }) => {
      const rows = data.rows.map((r: RowType, index: number) => {
        r.no = index + 1
        r.createdAt = Sugar.Date(new Date(r.createdAt)).long().raw
        r.paymentDue = `${ Sugar.Date(new Date(r.paymentDue)).medium().raw }`
        r.paidAt = r.paidAt ? `${ Sugar.Date(new Date(r.paidAt)).long().raw }` : ''
        r.strCost = formatCurrency(Number(r.cost))
        return r
      })
  
      table.rows = rows
      table.totalRecordCount = rows.length
      table.sortable.order = order;
      table.sortable.sort = sort;
    })
    .catch((err) => console.log(`Error: ${ err }`))
    .finally(() => useLoadingStore().setLoading(false))
  };
  
  const resetDialog = () => {
    editMode.value = false
    copyPrevious.value = false
    expenseDialogVisible.value = false
    Object.assign(data, expenseInitialValue)
    useLoadingStore().setLoading(false)
  }
  
  const updateExpense = () => {
    if ( !editMode.value || !rowData.value )
      return
    
    const id = rowData.value?._id

    useLoadingStore().setLoading(true)

    return API.updateExpense(id, { data: data })
    .then(() => {
      resetDialog()
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))
      useToastStore().setToast(true, 'Expense updated')
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }
  
  const createExpense = () => {

    if ( editMode.value )
      updateExpense()

    if ( copyPrevious.value )
      return copyPreviousMonth()
    
    if ( !data || Object.values(omit(data, ['categoryId'])).some(o => !o) )
      return
    
    useLoadingStore().setLoading(true)

    API.createExpense({ data: data })
    .then(() => {
      resetDialog()
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))
      useToastStore().setToast(true, 'Expense added')
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const copyPreviousMonth = () => {
    const previousEndOfMonth = Sugar.Date().set({ year: expenseMonth.value.year, month: expenseMonth.value.month - 1 }).endOfMonth().raw

    const data = {
      copyPrevious: copyPrevious.value,
      date: previousEndOfMonth
    }

    useLoadingStore().setLoading(true)

    API.createExpense({ data })
    .then(() => {
      resetDialog()
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))
      useToastStore().setToast(true, 'Previous month expenses added')
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
    .finally(() => resetDialog())
  }
  
  const deleteExpense = () => {
    if ( !editMode.value || !rowData.value )
      return
  
    const id = rowData.value?._id

    useLoadingStore().setLoading(true)

    return API.deleteExpense(id)
      .then(() => {
      resetDialog()
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))
      useToastStore().setToast(true, 'Expense deleted')
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }
  
  const markAsPaid = () => {
    if ( !editMode.value || !rowData.value )
      return
  
    const id = rowData.value?._id
    let paidStatus = JSON.parse(JSON.stringify(rowData.value?.isPaid))

    useLoadingStore().setLoading(true)
    
    return API.updateExpense(id, { data: { isPaid: (paidStatus = !paidStatus) } } )
      .then(() => {
      resetDialog()
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))

      const toastText = 'Expense status has been changed'
      useToastStore().setToast(true, toastText)
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const setRowData = (row: RowType) => {
    rowData.value = row
    editMode.value = true
    expenseDialogVisible.value = true
    const parsedPaymentDueDate = Sugar.Date(new Date(row.paymentDue)).format('{yyyy}-{MM}-{dd}').raw
    Object.assign(data, { ...rowData.value, paymentDue: parsedPaymentDueDate })
  }

  const clearAll = () => {
    table.rows = []
    table.totalRecordCount = 0
  }

  watch(() => expenseMonth.value, () => doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value)), { deep: true })

  return {
    expense,
    table,
    doSearch,
    rowsLength,
    createExpense,
    deleteExpense,
    markAsPaid,
    resetDialog,
    data,
    editMode,
    expenseIsPaid,
    expenseDialogVisible,
    setRowData,
    rowData,
    expenseMonth,
    copyPrevious,
    endOfMonth,
    clearAll
  }
})