<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
import { onMounted } from 'vue'
import { useMenuStore } from './stores/pages'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const { changeItem } = menuStore

onMounted(async () => {
  await router.isReady()
  if (route.name === 'BonusShop') {
    changeItem('bonusShop')
  }
})
</script>

<template>
  <header class="header" id="header">
    <img src="./assets/impact_logo.png" alt="Logo" class="header__logo" />
  </header>
  <div class="container">
    <NavigationMenu />
    <div class="main-margins">
      <RouterView />
    </div>
  </div>
  <footer class="footer">Plain text</footer>
</template>

<style scoped>
.header {
  background: var(--brand-main-color);
  padding: 10px 60px;
}
.header__logo {
  height: 60px;
}

.header__avatar {
  height: 60px;
  border-radius: 50%;
}

.container {
  display: flex;
  min-height: calc(100vh - 124px);
}
.footer {
  background: #f0f0f0;
  padding: 10px 60px;
}
</style>
