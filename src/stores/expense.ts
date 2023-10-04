import { formatCurrency } from "@/utils/formatter";
import { defineStore } from "pinia";
import { ref, computed, reactive } from 'vue'
import API from '@/services/api'
import Sugar from 'sugar-date'

type RowType = { 
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
  const data = ref()
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

  const expense = computed(() => data)
  const rowsLength = computed(() => table.rows.length)

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

  return {
    expense,
    table,
    doSearch,
    rowsLength
  }
})