<template>
  <LvDialog 
    :header="titleLabel" 
    v-model="visible"
    :style="{ 
      width: '95%',
      maxWidth: '400px'
    }"
  >
    <BaseButton 
      icon="x" 
      class="lv-button--ml-10"
      @click="onDeleteRows()"
      danger
      :style="{ marginTop: '1rem !important', marginLeft: 'auto !important' }"
    >
      Delete
    </BaseButton>
  </LvDialog>
</template>

<script setup lang="ts">
import LvDialog from 'lightvue/dialog'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { computed } from 'vue'
import { useExpenseStore } from '@/stores/expense';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const visible = computed({
  get: () => props.isVisible,
  set: () => emit('close')
})

const selectedItemCount = computed(() => useExpenseStore().selectedRows.length)

const titleLabel = computed(() => `${ selectedItemCount.value } ${ selectedItemCount.value > 1 ? 'items' : 'item' } selected`)

const selectedRows = computed(() => useExpenseStore().selectedRows)

const onDeleteRows = () => {
  if ( !confirm('This will delete the selected item(s). Continue?') )
    return

  useExpenseStore().deleteSelectedExpenses(selectedRows.value)
    ?.then(() => visible.value = false)
}
</script>

<style scoped>

</style>