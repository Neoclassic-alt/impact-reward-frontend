<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import './../assets/tabs.css'

type BonusShopTabs = 'community' | 'gold'

const currentTab = ref<BonusShopTabs>('community')
</script>

<template>
  <main class="main">
    <h2 class="page-header">Магазин бонусов</h2>
    <menu class="bonus-shop__tabs list-to-menu">
      <li class="bonus-shop__tab" :class="{ active: currentTab === 'community' }">
        Бонусы&nbsp;сообщества
      </li>
      <li class="bonus-shop__tab nav_in-development" :class="{ active: currentTab === 'gold' }">
        <span>Золотые&nbsp;бонусы</span>&nbsp;<span class="soon-label">скоро</span>
      </li>
    </menu>
    <RouterView />
  </main>
</template>

<style scoped></style>
