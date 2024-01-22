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
        Бонусы&nbsp;сообщества
      </li>
      <li class="bonus-shop__tab nav_in-development" :class="{ active: currentTab === 'gold' }">
        <span>Золотые&nbsp;бонусы</span>&nbsp;<span class="soon-label">скоро</span>
      </li>
    </menu>
    <RouterView />
  </main>
</template>

<style scoped>
.bonus-shop__tabs {
  display: flex;
  border-bottom: 1px #e1e1e1 solid;
  flex: 0;
  text-wrap: nowrap;
  overflow-x: auto;
  user-select: none;
}

.bonus-shop__tab {
  padding: 12px 20px;
  font-weight: 500;
  padding-top: 0;
  text-align: center;
}

.active {
  color: #67d2e9;
  border-bottom: 3px var(--brand-main-color) solid;
}

.bonus-shop__tab:not(.active) {
  border-bottom: 3px transparent solid;
}

@media screen and (max-width: 450px) {
  .bonus-shop__tabs {
    margin-left: -25px;
    border-bottom: none;
    width: 100vw;
    gap: 20px;
  }
  .bonus-shop__tab:first-child {
    margin-left: 25px;
  }
  .bonus-shop__tab:last-child {
    margin-right: 25px;
  }
  .bonus-shop__tab {
    padding: 8px 0;
  }
  .page-header {
    margin-bottom: 0;
  }
}
</style>
