<template>
  <div>
    <p class="start__caption caption center-align" v-if="!data">No expenses created yet ...</p>

    <TableLite
      v-else
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
            >
              Add income
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
        placeholder="E.g. phone bills"
        bottom-bar
        clearable 
      />

      <div class="col col--flex">
        <LvInput 
          type="text"
          v-model="expense.cost"
          label="Enter expense cost"
          placeholder="E.g. $59.99"
          bottom-bar
          clearable 
        />

        <LvInput 
          type="date"
          v-model="expense.date"
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
          icon="x" 
          class="lv-button--ml-10"
          @click="closeExpenseDialog()"
        >
          Cancel
        </BaseButton>

        <BaseButton 
          icon="check"
          class="lv-button--ml-10"
          @click.prevent
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
import { reactive, ref } from 'vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';

const op = ref()
const data = ref(true)
const expenseDialogIsVisible = ref(false)
const expenseInitialValue = {
  name: null,
  cost: null,
  date: null
}
const initialColor = ref('#607C8A')
const selectedOption = ref(null)
const options = ref([
  { id: 1, label: 'Bank account 1' },
  { id: 2, label: 'Bank account 2' },
  { id: 3, label: 'Bank account 3' },
  { id: 4, label: 'Bank account 4' }
])

const table = reactive({
  isLoading: false,
  columns: [
    {
      label: "No",
      field: "id",
      width: "3%",
      sortable: true,
      isKey: true,
    },
    {
      label: "Expense name",
      field: "name",
      width: "10%",
      sortable: true,
    },
    {
      label: "Cost",
      field: "cost",
      width: "15%",
      sortable: true,
    },
    {
      label: "Actions",
      field: "actions",
      width: "15%",
      sortable: false,
    }
  ],
  rows: [] as { id: number, name: string, cost: number }[],
  totalRecordCount: 0,
  sortable: {
    order: "id",
    sort: "asc",
  },
});

const expense = reactive({ ...expenseInitialValue })

const rowClicked = (row: { id: number, name: string, cost: number }) => console.log(row);

const doSearch = (offset: number, limit: number, order: string, sort: string) => {
  console.log(offset, limit, order, sort);
  //   table.isLoading = true;

  // Point: your response is like it on this example.
  //   {
  //   rows: [{
  //     id: 1,
  //     name: 'jack',
  //     email: 'example@example.com'
  //   },{
  //     id: 2,
  //     name: 'rose',
  //     email: 'example@example.com'
  //   }],
  //   count: 2,
  //   ...something
  // }

  const rows = [
    {
      id: 1,
      name: 'Telenor',
      cost: 600
    },
    {
      id: 2,
      name: 'Inet',
      cost: 1200
    },
    {
      id: 3,
      name: 'Bil',
      cost: 3200
    },
  ]

  // refresh table rows
  table.rows = rows;
  table.totalRecordCount = rows.length
  table.sortable.order = order;
  table.sortable.sort = sort;
  // End use axios to get data from Server
};

/**
 * Table search finished event
**/
// const tableLoadingFinish = (elements) => {
//   table.isLoading = false;
// };

// Get data first
doSearch(0, 10, 'id', 'asc');

const togglePanel = (event: Event) => op.value.toggle(event)
const displayExpenseDialog = () => {
  togglePanel(op.value)
  expenseDialogIsVisible.value = true
}
const closeExpenseDialog = () => {
  Object.assign(expense, expenseInitialValue)
  expenseDialogIsVisible.value = false
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