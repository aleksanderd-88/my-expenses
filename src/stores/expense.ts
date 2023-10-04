import { formatCurrency } from "@/utils/formatter";
import { defineStore } from "pinia";
import { ref, computed, reactive, watch } from 'vue'
import API from '@/services/api'
import Sugar from 'sugar-date'

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
}

export const useExpenseStore = defineStore('expense', () => {
  const expenseInitialValue = {
    name: null,
    cost: null,
    paymentDue: null
  }

  const data = reactive({ ...expenseInitialValue })
  const rowData = ref<RowType | null>(null)
  const editMode = ref(false)
  const expenseDialogVisible = ref(false)

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
      resetDialog()
  })

  const expense = computed(() => data)
  const rowsLength = computed(() => table.rows.length)
  const expenseIsPaid = computed(() => rowData.value?.isPaid)

  const doSearch = (offset: number, limit: number, order: string, sort: string) => {
    console.log(offset, limit, order, sort);
  
    return API.listExpenses().then(({ data }) => {
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
  };

  const resetDialog = () => {
    expenseDialogVisible.value = false
    Object.assign(data, expenseInitialValue)
  }
  
  const updateExpense = () => {
    if ( !editMode.value || !rowData.value )
      return
  
    const id = rowData.value?._id
    return API.updateExpense(id, { data: data })
    .then(() => resetDialog())
    .catch(err => console.log(`Error: ${ err }`))
  }
  
  const createExpense = () => {
    if ( editMode.value )
      updateExpense()
  
    if ( !expense.value || Object.values(expense.value).some(o => !o) ) 
      return
    
    API.createExpense({ data: data })
    .then(() => resetDialog())
    .catch(err => console.log(`Error: ${ err }`))
  }
  
  const deleteExpense = () => {
    if ( !editMode.value || !rowData.value )
      return
  
    const id = rowData.value?._id
    return API.deleteExpense(id)
      .then(() => resetDialog())
      .catch(err => console.log(`Error: ${ err }`))
  }
  
  const markAsPaid = () => {
    if ( !editMode.value || !rowData.value )
      return
  
    const id = rowData.value?._id
    let paidStatus = JSON.parse(JSON.stringify(rowData.value?.isPaid))
    return API.updateExpense(id, { data: { isPaid: (paidStatus = !paidStatus) } } )
      .then(() => resetDialog())
      .catch(err => console.log(`Error: ${ err }`))
  }

  const setRowData = (row: RowType) => {
    rowData.value = row
    editMode.value = true
    expenseDialogVisible.value = true
    const parsedPaymentDueDate = Sugar.Date(new Date(row.paymentDue)).format('{yyyy}-{MM}-{dd}').raw
    Object.assign(data, { ...rowData.value, paymentDue: parsedPaymentDueDate })
  }

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
    rowData
  }
})