import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '../views/GeneralInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GeneralInfo',
      component: GeneralInfo,
    },
    {
      path: '/bonus-shop',
      component: () => import('../views/BonusShop.vue'),
      children: [
        {
          path: '',
          name: 'BonusShop',
          component: () => import('../views/bonuses/CommunityBonuses.vue'),
        },
      ],
    },
    {
      path: '/add-bonus-group/:cost',
      name: 'AddBonusGroup',
      component: () => import('../views/bonuses/AddBonusGroup.vue'),
    },
  ],
})

export default router
