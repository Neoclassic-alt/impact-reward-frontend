<script setup lang="ts">
import { /*RouterLink , */ RouterView } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
</script>

<template>
  <header class="header">
    <img src="../impact_logo.png" alt="Logo" class="header__logo" />
    <img src="https://yt3.googleusercontent.com/ytc/AGIKgqPhYXrYUfEsq1MuFToT2kq9urkpa4VgACegL9_lCQ=s900-c-k-c0x00ffffff-no-rj" alt="Avatar" class="header__avatar">
  </header>
  <div class="main-wrapper">
    <NavigationMenu />
    <RouterView />
  </div>
  <footer class="footer"> Plain text </footer>
</template>

<style scoped>
.header {
  background: var(--brand-main-color);
  padding: 10px 60px;
  display: flex;
  justify-content: space-between;
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
  background: #F0F0F0;
  padding: 10px 60px;
}
</style>
