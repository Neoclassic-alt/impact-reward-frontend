import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '@/views/GeneralInfo.vue'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/pages'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

// GeneralInfo - информация на главной странице,
// а commonInfo - общая информация для всех страниц

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
      path: '/add-bonus-group/:group_name',
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

const toLoginPath = {
  name: 'Login',
  query: {
    message: 'non-auth',
  },
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const userInfoStore = useUserStore()
  const { userInfo } = storeToRefs(userInfoStore)
  const { fetchUserAndSave } = userInfoStore
  const { getAccountData } = authStore
  // Authorization flow: https://drive.google.com/file/d/1DxDP2ZnxCgn8JFOPnXB-7zGNSq9YR5Mf/view?usp=sharing
  if (!userInfo.value && to.meta.requiresAuth) {
    const account_key = getAccountData()
    if (account_key) {
      try {
        await fetchUserAndSave()
      } catch {
        return toLoginPath
      }
    } else {
      return toLoginPath
    }
  }

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
