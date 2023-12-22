import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { response as loginResponse } from '@/api-types/login'

export const useCommonStore = defineStore('common', () => {
  const commonInfo = ref<loginResponse | null>(null)

  function setCommonInfo(info: loginResponse) {
    commonInfo.value = info
    isAuthenticated.value = true
  }

  const isAuthenticated = ref(false)

  return { isAuthenticated, commonInfo, setCommonInfo }
})
