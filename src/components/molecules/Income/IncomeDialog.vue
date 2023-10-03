<template>
  <LvDialog 
    header="Update income" 
    v-model="dialogVisible"
    :style="{ 
      width: '95%',
      maxWidth: '700px'
    }"
  >
    <LvInput 
      type="text"
      v-model="income.amount"
      label="Enter monthly income (after taxes)"
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
</template>

<script setup lang="ts">
import { computed, reactive, watch, type PropType } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue'
import API from '@/services/api'

const props = defineProps({
  incomeDialogVisible: {
    type: Boolean,
    default: false
  },
  addedIncome: {
    type: String as PropType<null | string>,
    default: null
  },
})

const emit = defineEmits<{
  (event: 'close', value: boolean): void
  (event: 'do-search', value: boolean): void
}>()

const initialIncomeValue: { amount: null | number } = { amount: null }
const income = reactive({ ...initialIncomeValue })

watch(() => props.incomeDialogVisible, (val: boolean) => {
  if ( !val ) 
    resetDialog()

  if ( props.addedIncome )
    income.amount = Number(props.addedIncome)
})

const dialogVisible = computed({
  get: () => props.incomeDialogVisible,
  set: (value: boolean) => {
    emit('close', value)
  }
})

const resetDialog = () => {
  Object.assign(income, initialIncomeValue)
  dialogVisible.value = false
}

const createIncome = () => {
  if ( !income || Object.values(income).some(o => !o) ) 
    return

  API.updateIncome({ data: income })
    .then(() => {
      resetDialog()
      emit('do-search', true)
    })
    .catch(err => console.log(`Error: ${ err }`))
}

</script>

<style scoped>

</style>