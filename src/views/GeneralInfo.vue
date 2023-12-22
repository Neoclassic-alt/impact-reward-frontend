<script setup lang="ts">
import { computed } from 'vue'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'

const commonStore = useCommonStore()
const { commonInfo } = storeToRefs(commonStore)
const common = computed(() => commonInfo.value?.seller)

const communityLink = computed(() => common.value?.community.community_username.slice(1))
</script>

<template>
  <main class="main">
    <h2 class="page-header">Управление сообществом</h2>
    <section class="block-info">
      <p class="block-info__title_1">Профиль</p>
      <p class="block-info__item">
        <span class="block-info__prop" style="margin-right: 39px">Импакт-аккаунт</span>
        <span>{{ common?.community.community_name }}</span>
      </p>
      <p class="block-info__item">
        <span class="block-info__prop" style="margin-right: 109px">Адрес</span>
        <a :href="'http://t.me/' + communityLink" class="link">{{ communityLink }}</a>
      </p>
      <div class="block-info__item" style="display: flex">
        <span class="block-info__prop" style="margin-right: 82px">Описание</span>
        <span
          >{{ common?.community.community_description }}</span
        >
      </div>
    </section>
    <div class="blocks-group">
      <section class="block-info">
        <p class="block-info__title_1">Монетный двор</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монетные прессы</span>
          <span>{{ common && Math.floor(common.profile.capital / 10000) }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монета</span>
          <span>{{ common?.coin.name }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Тикер</span>
          <span>{{ common?.coin.ticker }}</span>
        </p>
      </section>
      <section class="block-info">
        <p class="block-info__title_1">Касса</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Осталось наград</span>
          <span>{{ common?.rewards.current_possible_rewards }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Размер награды</span>
          <span>{{ common?.rewards.reward_amount }} {{ common?.coin.ticker }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Темп пополнения</span>
          <span>{{ common?.rewards.regeneration_value }} награды в час</span>
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

/*@media screen and (max-width: 1024px) {
  .blocks-group {
    display: block;
  }
}*/
</style>
