import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '../views/GeneralInfo.vue'
import { useMenuStore } from '@/stores/pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GeneralInfo',
      component: GeneralInfo,
      meta: {
        requiresAuth: true,
        menuItem: 'GeneralInfo',
      },
    },
    {
      path: '/bonus-shop',
      component: () => import('../views/BonusShop.vue'),
      meta: {
        requiresAuth: true,
        menuItem: 'BonusShop',
      },
      children: [
        {
          path: '',
          name: 'BonusShop',
          component: () => import('../views/bonuses/CommunityBonuses.vue'),
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: '/add-bonus-group/:cost',
      name: 'AddBonusGroup',
      component: () => import('../views/bonuses/AddBonusGroup.vue'),
      meta: {
        menuItem: 'BonusShop',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/ImpactLogin.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
})

router.beforeEach((to) => {
  const menuStore = useMenuStore()
  const { changeItem } = menuStore
  if (to.meta.menuItem == 'GeneralInfo') {
    changeItem('generalInfo')
  }
  if (to.meta.menuItem == 'BonusShop') {
    changeItem('bonusShop')
  }
})

export default router
