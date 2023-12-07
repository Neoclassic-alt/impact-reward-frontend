<script setup lang="ts">
import { /*RouterLink , */ RouterView } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
</script>

<template>
  <header class="header">
    <img src="./assets/impact_logo.png" alt="Logo" class="header__logo" />
  </header>
  <div class="main-wrapper">
    <NavigationMenu />
    <RouterView />
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

.main-wrapper {
  display: flex;
  min-height: calc(100vh - 120px);
}
.footer {
  background: #f0f0f0;
  padding: 10px 60px;
}
</style>
