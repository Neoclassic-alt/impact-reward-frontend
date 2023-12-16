import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { bonusCost, bonusCosts } from '@/types/bonuses'

export const useBonusAvailableStore = defineStore('bonusAvailable', () => {
  const bonusAvaliableCosts = ref<bonusCosts>(new Set([]))

  function setAvaliableCosts(newAvaliableCosts: bonusCost[]) {
    newAvaliableCosts.forEach((item) => bonusAvaliableCosts.value.add(item))
  }

  function removeAvaliableCosts(cost: bonusCost): boolean {
    return bonusAvaliableCosts.value.delete(cost)
  }

  return { bonusAvaliableCosts, setAvaliableCosts, removeAvaliableCosts }
})
