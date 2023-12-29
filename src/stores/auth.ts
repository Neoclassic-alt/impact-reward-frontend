import { defineStore } from 'pinia'
import type { response as loginResponse, request as loginRequest } from '@/types/api/login'
import axios from 'axios'
import { API_LOGIN } from '@/constants/endpoints'
import type { AxiosResponse } from 'axios'

export const useAuthStore = defineStore('auth', () => {
  async function fetchLogin(accountInfo: loginRequest): Promise<AxiosResponse<loginResponse, any>> {
    const response = await axios.post(API_LOGIN, accountInfo, {
      headers: {
        'Api-Key': '85506a63-c670-443c-9148-b6ad6f990fdf',
      },
    })
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
