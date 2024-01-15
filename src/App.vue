<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import NavigationMenu from '@/components/NavigationMenu.vue'
import LoadingScreen from './components/LoadingScreen.vue'

const router = useRouter()
const isLoaded = ref(false)

onMounted(async () => {
  await router.isReady()
  isLoaded.value = true
})
</script>

<template>
  <LoadingScreen v-if="!isLoaded" />
  <header class="header" id="header">
    <div class="header__container">
      <img src="./assets/impact_logo.png" alt="Logo" class="header__logo" />
    </div>
  </header>
  <div class="container">
    <NavigationMenu v-if="$route.meta.requiresAuth === true" />
    <div class="main-margins">
      <RouterView />
    </div>
  </div>
  <footer class="footer">
    <section class="footer__content">
      <img src="./assets/community_02.png" style="border-radius: 50%" width="100" height="100" />
      <p class="footer__text" style="color: white; margin-top: 34px; margin-bottom: 10px">
        По всем вопросам:<br />
        Светлана Макаревская
      </p>
      <p class="footer__text">
        <a href="https://t.me/Svetlana_IMPACT" target="_blank" rel="noopener" class="footer__link"
          >t.me/Svetlana_IMPACT</a
        >
      </p>
    </section>
  </footer>
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
  min-height: calc(100vh - 160px);
}
.footer {
  background: rgb(44, 49, 50);
  padding-top: 100px;
  padding-bottom: 100px;
}

.community-title {
  color: white;
  font-weight: 500;
  font-size: 1.1em;
}

.footer__content {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.footer__text {
  font-size: 22px;
  text-align: center;
  opacity: 0.4;
}

.footer__link {
  color: rgb(25, 188, 230);
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
