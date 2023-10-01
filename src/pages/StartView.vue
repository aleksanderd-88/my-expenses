<template>
  <div>
    <p class="start__caption caption center-align" v-if="!rowsLength">No expenses created yet ...</p>
    
    <template v-else>
      <TableLite
        title="Expenses"
        :is-slot-mode="true"
        :is-loading="table.isLoading"
        :columns="table.columns"
        :rows="table.rows"
        :total="table.totalRecordCount"
        :sortable="table.sortable"
        @do-search="doSearch"
        @is-finished="table.isLoading = false"
        @row-clicked="rowClicked"
      />
  
      <div class="col col--flex col--flex-end">
        <h2 class="sub-headline">
          Total expenses: {{ formatCurrency(Number(totalExpense)) }}
          <p v-if="addedIncome"> 
            Remaining income: <span :style="{ color: `${ Number(addedIncome) < Number(totalExpense) ? '#ef5350' : '#495057'}` }"><b>{{ formatCurrency(Number(addedIncome) - Number(totalExpense)) }}</b></span>
          </p>
        </h2>
      </div>
    </template>

    <div class="start__actions">
      <LvOverlayPanel 
        ref="op" 
        class="start__panel"
        align-right
      >
        <ul class="start__options">
          <li class="start__option">
            <BaseButton 
              icon="stack"
              icon-left
              class="start__action-btn"
              @click="displayExpenseDialog()"
            >
              Add expenses
            </BaseButton>
          </li>

          <li class="start__option">
            <BaseButton 
              icon="currency-euro"
              icon-left
              class="start__action-btn"
              @click="displayIncomeDialog()"
            >
              Update income
            </BaseButton>
          </li>

          <li class="start__option">
            <BaseButton 
              icon="file-check"
              icon-left
              class="start__action-btn"
            >
              Create category
            </BaseButton>
          </li>
        </ul>
      </LvOverlayPanel>
  
      <BaseButton 
        class="start__add-btn lv-button--center-content" 
        icon="plus" 
        deep-shadow
        @click="togglePanel($event)"
      />
    </div>

    <!-- Expense dialog -->
    <LvDialog 
      header="Add new expense" 
      v-model="expenseDialogIsVisible"
      :style="{ 
        width: '95%',
        maxWidth: '700px'
      }"
    >
      <LvInput 
        type="text"
        v-model="expense.name"
        label="Give your expense a name"
        placeholder="E.g. Telenor"
        bottom-bar
        clearable 
      />

      <div class="col col--flex">
        <LvInput 
          type="text"
          v-model="expense.cost"
          label="Enter expense cost"
          placeholder="E.g. 600 SEK"
          bottom-bar
          clearable 
        />

        <LvInput 
          type="date"
          v-model="expense.paymentDue"
          label="Enter due date"
          bottom-bar
          clearable 
        />
      </div>

      <h2 class="sub-headline">Optional</h2>

      <div class="col col--flex">
        <LvColorpicker 
          v-model="initialColor" 
          clearable
          bottom-bar
          label="Attach a color" 
        />

        <lv-dropdown 
          v-model="selectedOption" 
          :options="options" 
          placeholder="Select bank account" 
          optionLabel="label"
          label="Choose bank account"
          clearable 
        />
      </div>

      <template #footer>
        <BaseButton 
          icon="trash" 
          class="lv-button--ml-10"
          @click="deleteExpense()"
          danger
          v-if="editMode"
        >
          Delete
        </BaseButton>

        <BaseButton 
          icon="x" 
          class="lv-button--ml-10"
          @click="resetDialog()"
        >
          Cancel
        </BaseButton>

        <BaseButton 
          icon="check"
          class="lv-button--ml-10"
          @click="createExpense()"
        >
          Save
        </BaseButton>
      </template>
    </LvDialog>
    <!-- End -->

    <!-- Incomde dialog -->
    <LvDialog 
      header="Update income" 
      v-model="incomeDialogVisible"
      :style="{ 
        width: '95%',
        maxWidth: '700px'
      }"
    >
      <LvInput 
        type="text"
        v-model="income.amount"
        label="Enter monthly income"
        placeholder="E.g. 34,000 SEK"
        bottom-bar
        clearable 
      />

      <template #footer>
        <BaseButton 
          icon="x" 
          class="lv-button--ml-10"
          @click="resetDialog()"
        >
          Cancel
        </BaseButton>

        <BaseButton 
          icon="check"
          class="lv-button--ml-10"
          @click="createIncome()"
        >
          Save
        </BaseButton>
      </template>
    </LvDialog>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvOverlayPanel  from 'lightvue/overlay-panel'
import LvDialog from 'lightvue/dialog';
import LvInput from 'lightvue/input';
import { reactive, ref, computed, watch } from 'vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';
import API from '@/services/api'
import Sugar from 'sugar-date'
import { formatCurrency } from '@/utils/formatter'

type RowType = { 
  no: number, 
  name: string, 
  cost: number,
  strCost: string
  paymentDue: string,
  createdAt: string 
}

const op = ref()
const editMode = ref(false)
const expenseDialogIsVisible = ref(false)
const incomeDialogVisible = ref(false)
const expenseInitialValue = {
  name: null,
  cost: null,
  paymentDue: null
}
const rowData = ref()
const initialIncomeValue = { amount: null }
const initialColor = ref('#607C8A')
const selectedOption = ref(null)
const options = ref([
  { id: 1, label: 'Bank account 1' },
  { id: 2, label: 'Bank account 2' },
  { id: 3, label: 'Bank account 3' },
  { id: 4, label: 'Bank account 4' }
])
const addedIncome = ref<null | string>(null)
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
      label: "Created at",
      field: "createdAt",
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
});

const expense = reactive({ ...expenseInitialValue })
const income = reactive({ ...initialIncomeValue })

watch(() => expenseDialogIsVisible.value, (val: boolean) => {
  if ( !val ) {
    editMode.value = false
    resetDialog()
  }
})


watch(() => incomeDialogVisible.value, (val: boolean) => {
  if ( !val ) 
    resetDialog()
})

const rowsLength = computed(() => table.rows.length)

const totalExpense = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.cost, 0)
})

const rowClicked = (row: RowType) => {
  editMode.value = true
  rowData.value = row
  expenseDialogIsVisible.value = true
  const parsedDate = Sugar.Date(new Date(row.paymentDue)).format('{yyyy}-{MM}-{dd}').raw
  Object.assign(expense, { ...row, paymentDue: parsedDate })
};

const doSearch = (offset: number, limit: number, order: string, sort: string) => {
  console.log(offset, limit, order, sort);

  return API.listExpenses().then(({ data }) => {
    const rows = data.rows.map((r: RowType, index: number) => {
      r.no = index + 1
      r.createdAt = Sugar.Date(new Date(r.createdAt)).long().raw
      r.paymentDue = Sugar.Date(new Date(r.paymentDue)).medium().raw
      r.strCost = formatCurrency(Number(r.cost))
      return r
    })

    table.rows = rows;
    table.totalRecordCount = rows.length
    table.sortable.order = order;
    table.sortable.sort = sort;

    getIncome()
  })
  .catch((err) => console.log(`Error: ${ err }`))
};

/**
 * Table search finished event
**/
// const tableLoadingFinish = (elements) => {
//   table.isLoading = false;
// };

// Get data first
doSearch(0, 10, 'id', 'asc');

const resetDialog = () => {
  Object.assign(expense, expenseInitialValue)
  Object.assign(income, initialIncomeValue)
  expenseDialogIsVisible.value = false
  incomeDialogVisible.value = false
}

const togglePanel = (event: Event) => op.value.toggle(event)
const displayExpenseDialog = () => {
  editMode.value = false
  togglePanel(op.value)
  expenseDialogIsVisible.value = true
}

const displayIncomeDialog = () => {
  togglePanel(op.value)
  incomeDialogVisible.value = true
}

const updateExpense = () => {
  if ( !editMode.value || !rowData.value )
    return

  const id = rowData.value?._id
  return API.updateExpense(id, { data: expense })
    .then(() => {
      doSearch(0, 10, 'id', 'asc')
      resetDialog()
    })
    .catch(err => console.log(`Error: ${ err }`))
}

const createExpense = () => {

  if ( editMode.value )
    updateExpense()

  if ( !expense || Object.values(expense).some(o => !o) ) 
    return

  API.createExpense({ data: expense })
    .then(() => {
      doSearch(0, 10, 'id', 'asc')
      resetDialog()
    })
    .catch(err => console.log(`Error: ${ err }`))
}

const getIncome = () => {
  return API.getIncome().then(({ data }: { data: { amount: number } }) => addedIncome.value = data.amount.toString())
  .catch(err => console.log(`Error: ${ err }`))
}

const createIncome = () => {
  if ( !income || Object.values(income).some(o => !o) ) 
    return

  API.updateIncome({ data: income })
    .then(() => {
      doSearch(0, 10, 'id', 'asc')
      resetDialog()
    })
    .catch(err => console.log(`Error: ${ err }`))
}

const deleteExpense = () => {
  if ( !editMode.value || !rowData.value )
    return

  const id = rowData.value?._id
  return API.deleteExpense(id)
    .then(() => {
      doSearch(0, 10, 'id', 'asc')
      resetDialog()
    })
    .catch(err => console.log(`Error: ${ err }`))
}
</script>

<style lang="scss" scoped>
  .start {
    &__caption {
      width: 100%;
      text-align: center;
    }

    &__actions {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      width: 100%;
      max-width: auto;
      display: flex;
      justify-content: flex-end;

      @media (min-width: 1024px) {
        right: 1.5rem;
        bottom: 1.5rem;
      }
    }

    &__add-btn {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }

    &__panel {
      right: 0 !important;
      left: unset !important;
      top: unset !important;
      bottom: calc(100% + .5rem) !important;
    }

    &__options {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    &__action-btn {
      width: 100%;
    }
  }
</style>