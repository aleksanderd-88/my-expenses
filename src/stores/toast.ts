import { defineStore } from "pinia";
import { computed, ref } from "vue";

type ToastPropType = {
  visible: boolean
  text: string
  onError: boolean
  duration: number
}

export const useToastStore = defineStore('toast', () => {
  const toast = ref({} as ToastPropType)
  const timerId = ref<NodeJS.Timeout>()

  const setToast = (visible: boolean, text = 'Dummy text', onError = false, duration = 5000) => {
    clear()
    toast.value = { visible, text, onError, duration }
    timerId.value = setTimeout(() => {
      toast.value.visible = false
    }, duration);
  }

  const closeToast = () => {
    toast.value.visible = false
    clear()
  }

  const clear = () => clearTimeout(timerId.value)

  const isVisible = computed(() => toast.value?.visible)
  const onError = computed(() => toast.value.onError)
  const text = computed(() => toast.value.text)

  return {
    setToast,
    isVisible,
    closeToast,
    onError,
    text
  }
})