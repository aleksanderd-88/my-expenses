<template>
  <LvDialog 
    header="Update income" 
    v-model="useIncomeStore().incomeDialogVisible"
    :style="{ 
      width: '95%',
      maxWidth: '700px'
    }"
  >

    <template v-if="useIncomeStore().addNew">
      <LvInput 
        type="text"
        v-model="useIncomeStore().income.name"
        label="Enter a full name"
        placeholder="Your full name"
        bottom-bar
        clearable
      />

      <div class="mt-2">
        <LvInput
          type="text"
          v-model="useIncomeStore().income.personIncome"
          label="Enter monthly income (after taxes)"
          placeholder="E.g. 34,000 SEK"
          bottom-bar
          clearable 
        />
      </div>
    </template>

    <LvInput
      v-else
      type="text"
      v-model="useIncomeStore().income.amount"
      label="Enter monthly income (after taxes)"
      placeholder="E.g. 34,000 SEK"
      bottom-bar
      clearable 
    />

    <template #footer>
      <BaseButton 
        icon="plus" 
        class="lv-button--ml-10"
        :style="{ marginRight: 'auto !important', marginLeft: '0 !important' }"
        primary
        @click="useIncomeStore().addNew = true"
      >
        Add income
      </BaseButton>

      <BaseButton 
        icon="x" 
        class="lv-button--ml-10"
        @click="useIncomeStore().resetDialog()"
      >
        Cancel
      </BaseButton>

      <BaseButton 
        icon="check"
        class="lv-button--ml-10"
        success
        @click="useIncomeStore().createIncome()"
      >
        Save
      </BaseButton>
    </template>
  </LvDialog>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useIncomeStore } from '@/stores/income';
</script>

<style scoped>

</style>