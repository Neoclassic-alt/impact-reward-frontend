import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', () => {
  const communityTitle = ref('')

  function setCommunityTitle(title: string) {
    communityTitle.value = title
  }

  return { communityTitle, setCommunityTitle }
})
