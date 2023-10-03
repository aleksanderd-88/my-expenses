<template>
  <LvDialog 
    header="Add new expense" 
    v-model="dialogVisible"
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
        icon="thumb-up" 
        class="lv-button--ml-10"
        @click="markAsPaid()"
        success
        v-if="editMode"
      >
        {{ isPaid ? 'Un-mark as paid' : 'Mark as paid' }}
      </BaseButton>

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
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, type PropType } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';
import API from '@/services/api'

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

const props = defineProps({
  expenseDialogIsVisible: {
    type: Boolean,
    default: false
  },
  editMode: {
    type: Boolean,
    default: false
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  rowData: {
    type: Object as PropType<RowType>,
    default: () => ({})
  }
})

const emit = defineEmits<{
  (event: 'close', value: boolean): void
  (event: 'do-search'): void
  (event: 'set-edit-mode', value: boolean): void
}>()

const expenseInitialValue = {
  name: null,
  cost: null,
  paymentDue: null
}
const expense = reactive({ ...expenseInitialValue })
const initialColor = ref('#607C8A')
const selectedOption = ref(null)
const options = ref([
  { id: 1, label: 'Bank account 1' },
  { id: 2, label: 'Bank account 2' },
  { id: 3, label: 'Bank account 3' },
  { id: 4, label: 'Bank account 4' }
])

watch(() => props.expenseDialogIsVisible, (val: boolean) => {
  if ( !val ) {
    resetDialog()
    emit('set-edit-mode', false)
  }
})

const dialogVisible = computed({
  get: () => props.expenseDialogIsVisible,
  set: (value: boolean) => {
    emit('close', value)
  }
})

const resetDialog = () => {
  dialogVisible.value = false
  Object.assign(expense, expenseInitialValue)
  emit('close', true)
}

const updateExpense = () => {
  if ( !props.editMode || !props.rowData )
    return

  const id = props.rowData?._id
  return API.updateExpense(id, { data: expense })
  .then(() => {
    resetDialog()
    emit('do-search')
  })
  .catch(err => console.log(`Error: ${ err }`))
}

const createExpense = () => {
  if ( props.editMode )
    updateExpense()

  if ( !expense || Object.values(expense).some(o => !o) ) 
    return

  API.createExpense({ data: expense })
  .then(() => {
    resetDialog()
    emit('do-search')
  })
  .catch(err => console.log(`Error: ${ err }`))
}

const deleteExpense = () => {
  if ( !props.editMode || !props.rowData )
    return

  const id = props.rowData?._id
  return API.deleteExpense(id)
    .then(() => {
      resetDialog()
      emit('do-search')
    })
    .catch(err => console.log(`Error: ${ err }`))
}

const markAsPaid = () => {
  if ( !props.editMode || !props.rowData )
    return

  const id = props.rowData?._id
  let paidStatus = JSON.parse(JSON.stringify(props.rowData?.isPaid))
  return API.updateExpense(id, { data: { isPaid: (paidStatus = !paidStatus) } } )
    .then(() => {
      resetDialog()
      emit('do-search')
    })
    .catch(err => console.log(`Error: ${ err }`))
}
</script>

<style scoped>

</style>