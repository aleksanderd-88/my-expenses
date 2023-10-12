import { defineStore } from "pinia";
import { ref } from "vue";
import API from '@/services/api'
import { useLoadingStore } from "./loader";
import { useToastStore } from "./toast";

type CategoryPropType = {
  _id: string
  label: string
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([] as CategoryPropType[])
  const label = ref('')
  const categoryDialogVisible = ref(false)

  const createCategory = () => {
    useLoadingStore().setLoading(true)

    return API.createCategory({ data: { label: label.value } })
    .then(({ data }) => {
      categories.value = [ ...categories.value, data ]
      useToastStore().setToast(true, 'Category added')
      label.value = ''
    })
    .catch((err) => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const listCategories = () => {
    useLoadingStore().setLoading(true)

    return API.listCategories()
    .then(({ data }) => categories.value = data)
    .catch((err) => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const resetDialog = () => {
    label.value = ''
    categoryDialogVisible.value = false
  }

  return {
    categories,
    createCategory,
    label,
    categoryDialogVisible,
    resetDialog,
    listCategories
  }
})