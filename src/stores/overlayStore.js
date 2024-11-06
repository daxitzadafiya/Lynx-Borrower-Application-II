import { computed, ref} from 'vue'
import { defineStore } from 'pinia'

export const useOverlayStore = defineStore('overlayStore', () => {
  const overlayVisible = ref(false)

  const isOverlayVisible = computed(() => {
    return overlayVisible.value
  })

  const toggleOverlay = (val) => {
    overlayVisible.value = val
  }

  return { overlayVisible, isOverlayVisible, toggleOverlay }
})
