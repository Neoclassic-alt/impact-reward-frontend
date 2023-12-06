<script setup lang="ts">
import { ref } from 'vue'

type menuStates = 'generalInfo' | 'bonusShop' | 'stats' | 'rating'
const activeElement = ref<menuStates>('generalInfo')
</script>

<template>
  <nav class="nav">
    <h2 class="nav__header">Меню</h2>
    <ul class="nav__menu">
      <li class="nav__item" :class="{ active: activeElement === 'generalInfo' }">
        <img src="../assets/icons/settings.svg" /><span class="nav__text">Общая информация</span>
      </li>
      <li class="nav__item" :class="{ active: activeElement === 'bonusShop' }">
        <img src="../assets/icons/shop.svg" /> <span class="nav__text">Магазин бонусов</span>
      </li>
      <li class="nav__item" :class="{ active: activeElement === 'stats' }">
        <img src="../assets/icons/stats.svg" /> <span class="nav__text">Статистика</span>
      </li>
      <li class="nav__item" :class="{ active: activeElement === 'rating' }">
        <img src="../assets/icons/cup_with_star.svg" /> <span class="nav__text">Рейтинг</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  max-width: fit-content;
  background: var(--light-gray);
}

.nav__header {
  margin-left: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.nav__menu {
  list-style-type: none;
  padding-inline-start: 0;
}

.nav__item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
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
</style>
