<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationMenu from './components/NavigationMenu.vue'
import { useGeneralStore } from './stores/general';
import { storeToRefs } from 'pinia';

const generalInfo = useGeneralStore()
const { communityTitle } = storeToRefs(generalInfo)
const { setCommunityTitle } = generalInfo

setCommunityTitle('Маркетинг без границ')
</script>

<template>
  <header class="header" id="header">
    <img src="./assets/impact_logo.png" alt="Logo" class="header__logo" />
    <p class="community-title">{{ communityTitle }}</p>
  </header>
  <div class="container">
    <NavigationMenu v-if="$route.meta.requiresAuth !== false"/>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
