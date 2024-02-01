<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userInfoStore = useUserStore()
const { getUserInfo: userInfo } = storeToRefs(userInfoStore)

const communityLink = computed(() => userInfo.value?.community.username.slice(1))
</script>

<template>
  <main class="main">
    <h2 class="page-header">{{ userInfo?.community.name }}</h2>
    <section class="block-info big-block">
      <p class="block-info__title_1">Профиль</p>
      <p class="block-info__item">
        <span class="block-info__prop">Импакт-аккаунт</span>
        <span>{{ userInfo?.profile.account }}</span>
      </p>
      <p class="block-info__item">
        <span class="block-info__prop">Адрес</span>
        <a
          :href="'http://t.me/' + communityLink"
          class="link"
          v-if="userInfo?.community.username !== 'Закрытая группа'"
          ><span>{{ communityLink }}</span>
          <img src="./../assets/icons/external-link.svg" style="position: relative; top: 2px"
        /></a>
        <span v-else><i>Закрытая группа</i></span>
      </p>
      <div class="block-info__item" style="display: flex">
        <span class="block-info__prop">Описание</span>
        <span>{{ userInfo?.community.description }}</span>
      </div>
    </section>
    <div class="blocks-group">
      <section class="block-info">
        <p class="block-info__title_1">Монетный двор</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монетные прессы</span>
          <span>{{ userInfo && Math.floor(userInfo.profile.capital / 10000) }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монета</span>
          <span>{{ userInfo?.coin.name }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Тикер</span>
          <span>{{ userInfo?.coin.ticker }}</span>
        </p>
      </section>
      <section class="block-info">
        <p class="block-info__title_1">Касса</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Осталось наград</span>
          <span
            >{{ userInfo?.rewards.current_possible_rewards }}/{{
              userInfo?.rewards.max_possible_rewards
            }}</span
          >
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Размер награды</span>
          <span>{{ userInfo?.rewards.reward_amount }} {{ userInfo?.coin.ticker }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Темп пополнения</span>
          <span>{{ userInfo?.rewards.regeneration_value }} нагр./час</span>
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.blocks-group {
  display: flex;
  gap: 30px;
}
.block-info {
  flex: 1;
}
.block-info__prop {
  display: inline-block;
}
.block-info__item_justify {
  display: flex;
  justify-content: space-between;
}

.big-block .block-info__prop {
  min-width: 150px;
}

@media screen and (max-width: 1024px) {
  .blocks-group {
    display: block;
  }
}
</style>
