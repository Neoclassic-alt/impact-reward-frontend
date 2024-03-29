import { defineStore } from 'pinia'
import type { request as loginRequest, response as loginResponse } from '@/types/api/login'
import axios, { type AxiosResponse } from 'axios'

export const useAuthStore = defineStore('auth', () => {
  async function fetchLogin(accountInfo: loginRequest): Promise<AxiosResponse<loginResponse, any>> {
    const response = await axios.post('/login', accountInfo)
    return response
  }

  function setAccountData(access_token: string) {
    localStorage.setItem('account', access_token)
  }

  function getAccountData() {
    return localStorage.getItem('account')
  }

  function clearAccountData() {
    localStorage.removeItem('account')
  }

  return {
    fetchLogin,
    setAccountData,
    getAccountData,
    clearAccountData,
  }
})
