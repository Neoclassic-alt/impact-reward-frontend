<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationMenu from '@/components/NavigationMenu.vue'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'

const commonStore = useCommonStore()
const { commonInfo } = storeToRefs(commonStore)
</script>

<template>
  <header class="header" id="header">
    <div class="header__container">
      <img src="./assets/impact_logo.png" alt="Logo" class="header__logo" />
      <p class="community-title" v-if="$route.name != 'Login'">{{ commonInfo?.seller.community.community_name }}</p>
    </div>
  </header>
  <div class="container">
    <NavigationMenu v-if="$route.meta.requiresAuth === true" />
    <div class="main-margins">
      <RouterView />
    </div>
  </div>
  <footer class="footer">Plain text</footer>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.header {
  background: var(--brand-main-color);
  padding: 10px 20px;
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1288px;
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

.community-title {
  color: white;
  font-weight: 500;
  font-size: 1.1em;
}

/*@media screen and (max-width: 768px) {
  .container {
    display: block;
  }
  .header__logo {
    height: 40px;
  }
}*/
</style>
