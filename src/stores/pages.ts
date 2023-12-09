import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { menuStates } from '@/types/pages'

export const useMenuStore = defineStore('menu', () => {
  const activeItem = ref<menuStates>('generalInfo')

  function changeItem(newItem: menuStates) {
    if (newItem === activeItem.value) {
      return
    }
    activeItem.value = newItem
  }

  return { activeItem, changeItem }
})
