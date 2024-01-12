import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { response as userInfoResponse } from '@/types/api/user'
import axios from 'axios'

const bonusAllCosts = [
  { group_name: 'C1', price: 20 },
  { group_name: 'C2', price: 50 },
  { group_name: 'C3', price: 100 },
  { group_name: 'C4', price: 200 },
  { group_name: 'C5', price: 500 },
]

export const useUserStore = defineStore('user-info', () => {
  const userInfo = ref<userInfoResponse | null>(null)

  async function fetchUserAndSave() {
    const res = await axios.get('/user')

    if (res.status == 200) {
      userInfo.value = res.data
    }
    return res.status == 200
  }

  const bonusAvaliableCosts = computed(() => {
    const _bonusAvaliableCosts = structuredClone(bonusAllCosts)

    getBonusGroups.value?.forEach((item) => {
      const index = _bonusAvaliableCosts.findIndex(
        (bonus_group) => bonus_group.group_name == item.group_name,
      )
      if (index + 1) {
        _bonusAvaliableCosts.splice(index, 1)
      }
    })

    return _bonusAvaliableCosts
  })

  const getUserInfo = computed(() => userInfo.value?.seller)
  const getBonusGroups = computed(() => userInfo.value?.seller.bonus_groups)

  function clearUserInfo() {
    userInfo.value = null
  }

  return {
    userInfo,
    getUserInfo,
    getBonusGroups,
    bonusAvaliableCosts,
    bonusAllCosts,
    fetchUserAndSave,
    clearUserInfo,
  }
})
