import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { response as userInfoResponse } from '@/types/api/user-info'
import axios from 'axios'
import { API_USER } from '@/constants/endpoints'

export const useUserInfoStore = defineStore('user-info', () => {
  const userInfo = ref<userInfoResponse | null>(null)

  async function fetchUserInfoAndSave(access_token: string) {
    const res = await axios.get(API_USER, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (res.status == 200) {
      userInfo.value = res.data
    }
    return res.status == 200
  }

  const getUserInfo = computed(() => userInfo.value?.seller)
  const getBonusGroups = computed(() => userInfo.value?.seller.bonus_groups)

  return { userInfo, getUserInfo, getBonusGroups, fetchUserInfoAndSave }
})
