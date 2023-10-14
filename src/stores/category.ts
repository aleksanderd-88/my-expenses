import { defineStore } from "pinia";
import { ref, watch } from "vue";
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
  const category = ref({} as CategoryPropType)
  const edit = ref(false)

  const createCategory = () => {
    useLoadingStore().setLoading(true)

    if ( edit.value )
      return updateCategory(category.value)

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

  const updateCategory = (params: CategoryPropType) => {
    return API.updateCategory(params._id, { data: { label: label.value } })
    .then(({ data }) => {
      categories.value = [ ...categories.value, data ]
      useToastStore().setToast(true, 'Category updated')
      category.value.label = ''
      label.value = ''
      listCategories()
    })
    .catch((err) => {
      console.log(`Error: ${ err }`)
      const message = err.response.data ? err.response.data : err
      useToastStore().setToast(true, message, true)
    })
    .finally(() => useLoadingStore().setLoading(false))
  }

  const deleteCategory = (id: string) => {
    
    useLoadingStore().setLoading(true)

    return API.deleteCategory(id)
    .then(() => {
      useToastStore().setToast(true, 'Category deleted')
      category.value.label = ''
      label.value = ''
      listCategories()
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

  watch(() => label.value, (label) => {
    if ( !label )
      return edit.value = false
  }, { deep: true })

  return {
    categories,
    createCategory,
    categoryDialogVisible,
    resetDialog,
    listCategories,
    category,
    edit,
    label,
    deleteCategory
  }
})