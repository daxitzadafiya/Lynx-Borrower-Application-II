import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useUpdateProfileStore = defineStore('updateProfileStore', () => {
    const isModalVisible = ref(false)
  
    const isVisible = computed(() => {
      return isModalVisible.value
    })
  
    const onToggle = (val) => {
        isModalVisible.value = val
    }
  
    return { isVisible, onToggle }
  })