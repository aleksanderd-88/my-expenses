<template>
  <LvDialog 
    header="Set payment date" 
    v-model="visible"
    :style="{ 
      width: '95%',
      maxWidth: '400px'
    }"
  >
  <LvInput 
    type="date"
    v-model="useExpenseStore().expense.paidAt"
    label="Set date of payment"
    bottom-bar
    clearable
  />
  <BaseButton 
    icon="thumb-up" 
    class="lv-button--ml-10"
    @click="useExpenseStore().onMarkPayment()"
    success
    :style="{ marginTop: '1rem !important', marginLeft: 'auto !important' }"
  >
    Save
  </BaseButton>
  </LvDialog>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useExpenseStore } from '@/stores/expense';
import LvInput from 'lightvue/input'
import { computed } from 'vue'

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
    set: val => {
      if ( !val )
        emit('close')
    }
  })
</script>

<style scoped>

</style>