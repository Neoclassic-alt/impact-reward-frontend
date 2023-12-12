<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

type BonusShopTabs = 'community' | 'gold'

const currentTab = ref<BonusShopTabs>('community')
</script>

<template>
  <main class="main">
    <h2 class="page-header">Магазин бонусов</h2>
    <menu class="bonus-shop__tabs list-to-menu">
      <li class="bonus-shop__tab" :class="{ active: currentTab === 'community' }">
        Бонусы сообщества
      </li>
      <li class="bonus-shop__tab in_development" :class="{ active: currentTab === 'gold' }">
        <span>Золотые бонусы</span> <span class="soon-label">скоро</span>
      </li>
    </menu>
    <RouterView />
  </main>
</template>

<style scoped>
.bonus-shop__tabs {
  display: flex;
  border-bottom: 1px #e1e1e1 solid;
}

.bonus-shop__tab {
  padding: 12px 20px;
  font-weight: 500;
  padding-top: 0;
}

.active {
  color: #67d2e9;
  border-bottom: 3px var(--brand-main-color) solid;
}
</style>
