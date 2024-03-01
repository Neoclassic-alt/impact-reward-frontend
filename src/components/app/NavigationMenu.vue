<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { menuStates } from '@/types/pages'
import { capitalizeFirstLetter } from '@/functions'
import { useAuthStore, useMenuStore, useUserStore } from '@/stores'
import { useWindowSize } from '@vueuse/core'
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'
import StoreIcon from 'vue-material-design-icons/Store.vue'
import ChartBarIcon from 'vue-material-design-icons/ChartBar.vue'
import TrophyAwardIcon from 'vue-material-design-icons/TrophyAward.vue'
import LogoutIcon from 'vue-material-design-icons/Logout.vue'
import MenuIcon from 'vue-material-design-icons/Menu.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

const router = useRouter()

const store = useMenuStore()
const { activeItem } = storeToRefs(store) // деконструкция параметра с storeToRefs()
const { changeItem } = store // действия деконструируются без функций
const { clearAccountData } = useAuthStore()

function logout() {
  router.push({ name: 'Login' }).then(() => {
    clearAccountData()
    router.go(0) // reload
  })
}

const isMenuOpen = ref(false)

function GoToPageFromMenu(newItem: menuStates) {
  isMenuOpen.value = false
  changeItem(newItem)
  // роуты называется точно так же, как menuStates, за исключением первой буквы
  router.push({ name: capitalizeFirstLetter(newItem) })
}

const { width } = useWindowSize()

watch(isMenuOpen, (isOpen) => {
  document.documentElement.style.overflow = isOpen ? 'hidden' : 'visible'
})
</script>

<template>
  <nav class="nav" ref="nav" v-show="isMenuOpen || width > 768">
    <h2 class="nav__header"></h2>
    <menu class="list-to-menu">
      <li
        class="nav__item"
        :class="{ active: activeItem === 'generalInfo' }"
        @click="GoToPageFromMenu('generalInfo')"
      >
        <InformationOutlineIcon class="nav__icon" /><span class="nav__text">Информация</span>
      </li>
      <li
        class="nav__item"
        :class="{ active: activeItem === 'bonusShop' }"
        @click="GoToPageFromMenu('bonusShop')"
      >
        <StoreIcon class="nav__icon" /> <span class="nav__text">Магазин бонусов</span>
      </li>
      <li
        class="nav__item"
        :class="{ active: activeItem === 'stats' }"
        @click="GoToPageFromMenu('stats')"
      >
        <ChartBarIcon /> <span class="nav__text">Статистика</span>
      </li>
      <li
        class="nav__item"
        :class="{ active: activeItem === 'rating' }"
        @click="GoToPageFromMenu('rating')"
      >
        <TrophyAwardIcon class="nav__icon" /> <span class="nav__text">Рейтинг</span>
      </li>
    </menu>
    <ul class="list-to-menu">
      <li class="nav__item nav_danger" @click="logout" style="color: var(--danger-color)">
        <LogoutIcon class="nav__icon" /> <span class="nav__text">Выйти</span>
      </li>
    </ul>
  </nav>
  <a class="float-menu" href="#" @click="isMenuOpen = !isMenuOpen">
    <MenuIcon style="display: block" v-if="!isMenuOpen" fillColor="white" />
    <CloseIcon style="display: block" v-else fillColor="white" />
  </a>
</template>

<style scoped>
.nav {
  max-width: fit-content;
  background: var(--light-gray);
  flex-direction: column;
  justify-content: space-between;
  position: relative; /* Для реализации прокрутки */
  z-index: 4;
}

.nav__header {
  margin-left: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.nav__item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  user-select: none;
}

.nav__item:not(.nav_in-development) {
  cursor: pointer;
}

.nav__item:not(.nav_in-development, .active, .nav_danger):hover {
  background-color: var(--light-hover);
  transition: background-color 0.1s linear;
}

.nav__item.nav_danger:hover {
  background-color: rgb(241, 34, 27, 0.16);
  transition: background-color 0.1s linear;
}

.nav__text {
  margin-left: 12px;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
}

.nav__icon {
  height: 24px;
}

.active {
  background: var(--brand-main-color);
  color: #ffffff;
}

.active img {
  filter: invert(1);
}

.float-menu {
  position: absolute;
  z-index: 9998;
  /*background-color: #e0e0e0;*/
  padding: 8px;
  top: 12px;
  right: 15px;
  border-radius: 12px;
}

@media screen and (max-width: 768px) {
  .nav {
    max-width: none;
    width: 100svw;
    position: fixed;
    height: 100svh;
    z-index: 4;
  }
}

@media screen and (min-width: 769px) {
  .float-menu {
    display: none;
  }
}
</style>
