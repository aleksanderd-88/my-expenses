<template>
  <TableLight
    :table-title="tableTitle"
    :is-loading="table.isLoading"
    :columns="table.columns"
    :rows="filteredCategoryRows"
    :sortable="table.sortable"
    @selected-rows="$emit('selected-rows', $event)"
  />
</template>

<script setup lang="ts">
import { useExpenseStore } from '@/stores/expense'
import { computed } from 'vue'
import TableLight from '@/components/molecules/Table/TableLight.vue';
import { type RowType } from '@/stores/expense';

const props = defineProps({
  tableTitle: {
    type: String,
    default: 'Other expenses'
  },
  categoryId: {
    type: String,
    default: null
  }
})

const table = useExpenseStore().table

const filteredCategoryRows = computed(() => {
  return table.rows?.filter(r => r.categoryId === props.categoryId).map((r: RowType, index: number) => {
    r.no = index + 1
    return r
  })
})
  
</script>

<style scoped>

</style>