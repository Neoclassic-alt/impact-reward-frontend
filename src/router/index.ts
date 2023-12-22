import { createRouter, createWebHistory } from 'vue-router'
import GeneralInfo from '@/views/GeneralInfo.vue'
//import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/pages'
//import { useCommonStore } from '@/stores/common'
import { fetchLogin } from '@/functions/api'
import type { request as loginRequest } from '@/api-types/login'

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
    message: 'non-auth'
  }
}

router.beforeEach((to) => {
  //const commonStore = useCommonStore()
  //const { isAuthenticated } = storeToRefs(commonStore)
  if (to.meta.requiresAuth) {
    const accountString = localStorage.getItem('account')
    if (!localStorage.length || !accountString) {
      return toLoginPath
    }
    else {
      const { account, active_key } = JSON.parse(accountString) as loginRequest
      fetchLogin(account, active_key)
      // TODO
    }
  }
  /*if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login', 
      query: {
        message: 'non-auth'
      }
    }
  }*/

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
