<template>
  <LvDialog 
    header="Add category" 
    v-model="useCategoryStore().categoryDialogVisible"
    :style="{ 
      width: '95%',
      maxWidth: '700px'
    }"
  >
    <LvInput 
      type="text"
      v-model="useCategoryStore().label"
      label="Add new category"
      placeholder="E.g. car bills"
      bottom-bar
      clearable 
    />

    <template #footer>
      <BaseButton 
        icon="x" 
        class="lv-button--ml-10"
        @click="useCategoryStore().resetDialog()"
      >
        Cancel
      </BaseButton>

      <BaseButton 
        icon="check"
        class="lv-button--ml-10"
        @click="useCategoryStore().createCategory()"
      >
        Save
      </BaseButton>
    </template>
  </LvDialog>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import BaseButton from '@/components/atoms/BaseButton.vue'

</script>

<style scoped>

</style>