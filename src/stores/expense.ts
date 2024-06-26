import { formatCurrency } from "@/utils/formatter";
import { defineStore } from "pinia";
import { ref, computed, reactive, watch } from 'vue'
import API from '@/services/api'
import Sugar from 'sugar-date'
import { useToastStore } from "./toast";
import { useIncomeStore } from "./income";
import pick from "lodash/pick";
import { useUserStore } from "./user";

export type RowType = {
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
    _id: null,
    no: null,
    name: null,
    cost: null,
    isPaid: null,
    strCost: null,
    paymentDue: null,
    paidAt: null,
    createdAt: null,
    updatedAt: null,
    userId: null,
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
  const selectedRows = ref<{ _id: string }[]>([])
  
  const doSearch = (offset: number, limit: number, order: string, sort: string, date: Date) => {
    console.log(offset, limit, order, sort, date);

    return API.listExpenses({ data: { date }}).then(({ data }) => {
      const rows = data.rows.map((r: RowType, index: number) => {
        r.no = index + 1
        r.createdAt = Sugar.Date(new Date(r.createdAt)).long().raw
        r.paymentDue = `${ Sugar.Date(new Date(r.paymentDue)).medium().raw }`
        r.paidAt = r.paidAt ? `${ Sugar.Date(new Date(r.paidAt)).medium().raw }` : ''
        r.strCost = formatCurrency(Number(r.cost))
        return r
      })
  
      table.rows = rows
      table.totalRecordCount = rows.length
      table.sortable.order = order;
      table.sortable.sort = sort;
    })
    .catch((err) => console.log(`Error: ${ err }`))
  };
  
  const resetDialog = () => {
    editMode.value = false
    copyPrevious.value = false
    expenseDialogVisible.value = false
    Object.assign(data, { ...expenseInitialValue })
    rowData.value = null
  }
  
  const updateExpense = () => {
    if ( !editMode.value || !rowData.value )
      return
    
    const id = rowData.value?._id

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
  }
  
  const createExpense = () => {
    if ( editMode.value )
      return updateExpense()

    if ( copyPrevious.value )
      return copyPreviousMonth()

    const requiredFields = pick(data, ['name', 'cost', 'paymentDue'])
    if ( !data || Object.values(requiredFields).some(o => !o) )
      return
    
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
  }

  const copyPreviousMonth = () => {
    const previousEndOfMonth = Sugar.Date().set({ year: expenseMonth.value.year, month: expenseMonth.value.month - 1 }).endOfMonth().raw

    const data = {
      copyPrevious: copyPrevious.value,
      date: previousEndOfMonth
    }

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
  }
  
  const onMarkPayment = () => {
    if ( Object.values(pick(expense.value, ['name', 'cost', 'paymentDue'])).some(e => !e) ) 
      return

    if ( !rowData.value ) {
      Object.assign(data, { ...expense.value, isPaid: true })
      return createExpense()
    }
  
    const id = rowData.value?._id
    let paidStatus = JSON.parse(JSON.stringify(rowData.value?.isPaid))

    
    return API.updateExpense(id, { data: { ...data, isPaid: (paidStatus = !paidStatus) } } )
      .then(() => {
      resetDialog()
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))

      const toastText = 'Expense updated'
      useToastStore().setToast(true, toastText)
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
  }

  const updateSelectedExpenses = (selectedRows: RowType[]) => {
    if ( !selectedRows.length )
      return
  
    return API.updateSelectedRows({ data: selectedRows })
    .then(() => {
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))

      const toastText = 'Row(s) updated'
      useToastStore().setToast(true, toastText)
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
  }

  const deleteSelectedExpenses = (selectedRows: Pick<RowType, '_id'>[]) => {
    if ( !selectedRows.length )
      return
  
    const rowIds = selectedRows.map(r => r._id)
    
    return API.deleteSelectedRows({ data: { ids: rowIds } })
    .then(() => {
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value))

      const toastText = 'Row(s) deleted'
      useToastStore().setToast(true, toastText)
    })
    .catch(err => {
      console.log(`Error: ${ err }`)
      useToastStore().setToast(true, err, true)
    })
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
    Object.assign(expenseMonth.value, {
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    })
    table.totalRecordCount = 0
    useIncomeStore().clearAll()
  }

  watch(() => expenseMonth.value, () => {
    if ( useUserStore().currentUser ) { //- only list expenses when logged in
      doSearch(0, 10, 'id', 'asc', new Date(endOfMonth.value)), { deep: true }
    }
  })

  return {
    expense,
    table,
    doSearch,
    rowsLength,
    createExpense,
    deleteExpense,
    onMarkPayment,
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
    clearAll,
    updateSelectedExpenses,
    deleteSelectedExpenses,
    selectedRows
  }
})