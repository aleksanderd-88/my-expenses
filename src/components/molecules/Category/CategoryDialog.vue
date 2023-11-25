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
    <BaseButton 
      danger 
      :style="{ marginTop: '.5rem !important' }"
      icon="trash"
      v-if="useCategoryStore().edit"
      @click="useCategoryStore().deleteCategory(useCategoryStore().category._id)">
      Remove category
    </BaseButton>

    <p 
      class="mt-2 color-dark" 
      :style="{ fontWeight: '500' }"
      v-if="useCategoryStore().categories.length"
      >
      Categories
      <br />
      <span :style="{ fontSize: '.8rem', fontWeight: 'initial' }">(Click on category to edit)</span>
    </p>

    <div class="col col--flex">
      <LvBadge 
        color="info" 
        v-for="item in useCategoryStore().categories" 
        :key="item._id"
        :style="{ cursor: 'pointer !important' }"
        @click="onBadgeClick(item)"
        title="Click to change label"
      >
        {{ item.label }}
      </LvBadge>
    </div>

    <template #footer>
      <BaseButton 
        icon="x" 
        class="lv-button--ml-10"
        @click="cancel()"
      >
        Cancel
      </BaseButton>

      <BaseButton 
        icon="check"
        class="lv-button--ml-10"
        success
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
import LvBadge from 'lightvue/badge'

const onBadgeClick = (category: { _id: string,  label: string }) => {
  useCategoryStore().edit = true
  useCategoryStore().label = category.label
  useCategoryStore().category = category
}

const cancel = () => {
  //- Exit `edit` state on cancel when enabled
  if ( useCategoryStore().edit )
    return useCategoryStore().cancelEditMode()

  useCategoryStore().resetDialog()
}
</script>

<style scoped>

</style>