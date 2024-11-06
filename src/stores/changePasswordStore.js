import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { changePasswordRequest } from '@/api/changePassword';

export const useChangePasswordStore = defineStore('changePasswordStore', () => {
  const isModalVisible = ref(false)

  const isVisible = computed(() => {
    return isModalVisible.value
  })

  const onToggle = (val) => {
    isModalVisible.value = val
  }

  const changeUserPassword = async (user) => {
    try {
      const response = await changePasswordRequest(user)
      return response;
    } catch (error) {
      throw (
        error.response.data.Message || 'An error occurred while trying to login. Please try again.'
      )
    } finally {
    }
  }

  return { isVisible, onToggle, changeUserPassword }
})
