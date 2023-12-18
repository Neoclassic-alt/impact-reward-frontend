<script setup lang="ts">
import { useMenuStore } from '@/stores/pages'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { menuStates } from '@/types/pages'
import { capitalizeFirstLetter } from '@/functions'
import { onMounted } from 'vue'

const store = useMenuStore()
const { activeItem } = storeToRefs(store) // деконструкция параметра с storeToRefs()
const { changeItem } = store // действия деконструируются без функций
const router = useRouter()

function GoToPageFromMenu(newItem: menuStates) {
  changeItem(newItem)
  // роуты называется точно так же, как menuStates, за исключением первой буквы
  router.push({ name: capitalizeFirstLetter(newItem) })
}

// сделаем меню непрокручиваемым после шапки
onMounted(() => {
  const header = document.getElementById('header')! as HTMLDivElement
  const nav = document.querySelector('.nav')! as HTMLDivElement
  const footer = document.querySelector('.footer')! as HTMLDivElement
  document.addEventListener('scroll', () => {
    if (document.documentElement.clientWidth < 768) {
      return
    }
    if (window.scrollY > header.offsetHeight) {
      nav.style.top = window.scrollY - header.offsetHeight + 'px'
      if (
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight -
          window.scrollY <
        footer.offsetHeight
      ) {
        nav.style.height = document.documentElement.clientHeight - footer.offsetHeight + 'px'
      } else {
        nav.style.height = document.documentElement.clientHeight + 'px'
      }
    } else {
      nav.style.top = '0'
    }
  })
})
</script>

<template>
  <nav class="nav" ref="nav">
    <h2 class="nav__header"></h2>
    <menu class="list-to-menu">
      <li
        class="nav__item"
        :class="{ active: activeItem === 'generalInfo' }"
        @click="GoToPageFromMenu('generalInfo')"
      >
        <img src="../assets/icons/info.svg" /><span class="nav__text">Информация</span>
      </li>
      <li
        class="nav__item"
        :class="{ active: activeItem === 'bonusShop' }"
        @click="GoToPageFromMenu('bonusShop')"
      >
        <img src="../assets/icons/shop.svg" /> <span class="nav__text">Магазин бонусов</span>
      </li>
      <li class="nav__item in_development" :class="{ active: activeItem === 'stats' }">
        <img src="../assets/icons/stats.svg" /> <span class="nav__text">Статистика</span>
        <span class="soon-label">скоро</span>
      </li>
      <li class="nav__item in_development" :class="{ active: activeItem === 'rating' }">
        <img src="../assets/icons/cup_with_star.svg" /> <span class="nav__text">Рейтинг</span>
        <span class="soon-label">скоро</span>
      </li>
    </menu>
    <ul class="list-to-menu">
      <li class="nav__item">
        <img src="../assets/icons/logout.svg" style="display: block" />
        <span class="nav__text" style="color: var(--danger-color)">Выйти</span>
      </li>
    </ul>
  </nav>
  <div class="float-menu">
    <img src="../assets/icons/menu-hamburger.svg" style="display: block" />
  </div>
</template>

<style scoped>
.nav {
  max-width: fit-content;
  background: var(--light-gray);
  flex-direction: column;
  justify-content: space-between;
  position: relative; /* Для реализации прокрутки */
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
}

.nav__item:not(.in_development) {
  cursor: pointer;
}

.nav__item:not(.in_development, .active):hover {
  background-color: var(--light-hover);
  transition: background-color 0.1s linear;
}

.nav__text {
  margin-left: 12px;
  font-weight: 500;
  text-wrap: nowrap;
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
  background-color: #e0e0e0;
  padding: 8px;
  top: 12px;
  right: 40px;
  border-radius: 12px;
}

.float-menu {
  display: none;
}

/*@media screen and (max-width: 768px) {
  .nav {
    position: static;
    display: none;
  }
}

@media screen and (min-width: 768px) {
  .float-menu {
    display: none;
  }
}*/
</style>
