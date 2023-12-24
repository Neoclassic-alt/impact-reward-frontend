import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import type { response as loginResponse, request as loginRequest } from '@/api-types/login'
import axios from 'axios'
import { API_LOGIN } from './../constants/endpoints'
import type { AxiosResponse } from 'axios'

export const useCommonStore = defineStore('auth-common', () => {
  const commonInfo = ref<loginResponse | null>(null)
  const isCommonInfoLoaded = computed(() => !!commonInfo.value)

  function useLocalStorage(): Ref<loginRequest> | null {
    const accountRaw = localStorage.getItem('account')
    if (accountRaw) {
      const accountData = ref(JSON.parse(accountRaw) as loginRequest)
      return accountData
    }
    return null
  }

  async function fetchLogin(accountInfo: loginRequest): Promise<AxiosResponse<loginResponse, any>> {
    const response = await axios.post(API_LOGIN, accountInfo)
    return response
  }

  function setAccountData(account: loginRequest) {
    localStorage.setItem('account', JSON.stringify(account))
  }

  function setCommonInfo(info: loginResponse) {
    commonInfo.value = info
  }

  const getCommonInfo = computed(() => (commonInfo.value ? commonInfo.value.issuer : null))

  function clearData() {
    commonInfo.value = null
    localStorage.removeItem('account')
  }

  return {
    isCommonInfoLoaded,
    commonInfo,
    getCommonInfo,
    fetchLogin,
    useLocalStorage,
    setAccountData,
    setCommonInfo,
    clearData,
  }
})
