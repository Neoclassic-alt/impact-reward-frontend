import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '../views/GeneralInfo.vue'
import type { menuStates } from '@/types/pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GeneralInfo',
      component: GeneralInfo
    },
    {
      path: '/bonus-shop',
      name: 'BonusShop',
      component: () => import('../views/BonusShop.vue')
    }
  ]
})

export default router
