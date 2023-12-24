import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '@/views/GeneralInfo.vue'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/pages'
import { useCommonStore } from '@/stores/auth-common'

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

const toLoginPath = {
  name: 'Login',
  query: {
    message: 'non-auth',
  },
}

router.beforeEach(async (to) => {
  const commonStore = useCommonStore()
  const { isCommonInfoLoaded } = storeToRefs(commonStore)
  const { useLocalStorage, fetchLogin, setCommonInfo } = commonStore
  // Authorization flow: https://drive.google.com/file/d/1DxDP2ZnxCgn8JFOPnXB-7zGNSq9YR5Mf/view?usp=sharing
  if (!isCommonInfoLoaded.value && to.meta.requiresAuth) {
    const storage = useLocalStorage()
    if (storage) {
      try {
        const res = await fetchLogin(storage.value)
        setCommonInfo(res.data)
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
