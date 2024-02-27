import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '@/views/GeneralInfo.vue'
import { storeToRefs } from 'pinia'
import { useMenuStore, useAuthStore, useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return { name: 'GeneralInfo' }
      },
    },
    {
      path: '/account',
      name: 'GeneralInfo',
      component: GeneralInfo,
      meta: {
        requiresAuth: true,
        menuItem: 'GeneralInfo',
      },
    },
    {
      path: '/account/bonuses',
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
      path: '/account/add-bonus-group/:group_name',
      name: 'AddBonusGroup',
      component: () => import('../views/bonuses/AddBonusGroup.vue'),
      meta: {
        menuItem: 'BonusShop',
        requiresAuth: true,
      },
      beforeEnter: (to, from) => {
        if (from.name === 'BonusShop') {
          to.meta.transition = 'slide'
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/ImpactLogin.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/account/rating',
      name: 'Rating',
      component: () => import('../views/BuyerRating.vue'),
      meta: {
        menuItem: 'Rating',
        requiresAuth: true,
      },
    },
    {
      path: '/account/stats',
      name: 'Stats',
      component: () => import('../views/SellerStats.vue'),
      meta: {
        menuItem: 'Stats',
        requiresAuth: true,
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

const nonSeller = {
  name: 'Login',
  query: {
    message: 'non-seller',
  },
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const userInfoStore = useUserStore()
  const { userInfo } = storeToRefs(userInfoStore)
  const { fetchUserAndSave, clearUserInfo } = userInfoStore
  const { getAccountData, clearAccountData } = authStore
  // Authorization flow: https://drive.google.com/file/d/1DxDP2ZnxCgn8JFOPnXB-7zGNSq9YR5Mf/view?usp=sharing
  if (!userInfo.value && to.meta.requiresAuth) {
    const account_key = getAccountData()
    if (account_key) {
      try {
        await fetchUserAndSave()
        if (!Object.prototype.hasOwnProperty.call(userInfo.value, 'seller')) {
          clearAccountData()
          clearUserInfo()
          return nonSeller
        }
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
  if (to.meta.menuItem == 'Rating') {
    changeItem('rating')
  }
  if (to.meta.menuItem == 'Stats') {
    changeItem('stats')
  }
})

export default router
