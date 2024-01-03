import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { response as userInfoResponse } from '@/types/api/user'
import axios from 'axios'

export const useUserStore = defineStore('user-info', () => {
  const userInfo = ref<userInfoResponse | null>(null)

  async function fetchUserAndSave() {
    const res = await axios.get('/user')

    if (res.status == 200) {
      userInfo.value = res.data
    }
    return res.status == 200
  }

  const getUserInfo = computed(() => userInfo.value?.seller)
  const getBonusGroups = computed(() => userInfo.value?.seller.bonus_groups)

  function clearUserInfo() {
    userInfo.value = null
  }

  return { userInfo, getUserInfo, getBonusGroups, fetchUserAndSave, clearUserInfo }
})
