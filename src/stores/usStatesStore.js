import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllUsStates } from '@/api/usStates'
import { toast } from 'vue3-toastify';

export const useUsStatesStore = defineStore('usStatesStore', () => {
  const usStates = ref(null)

  const getUsStates = async () => {
    try {
      const result = await getAllUsStates()
      if (result !== 'Not found') {
        usStates.value = result
      }
    } catch (error) {
      toast.error("An error occurred while trying to get us states. Please try again.");
    } finally {
    }
  }
  return { usStates, getUsStates }
})
