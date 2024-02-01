<script setup lang="ts">
import { ref } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import './../assets/tabs.css'
import { useWindowSize } from '@vueuse/core'
import AlertBlock from '@/components/AlertBlock.vue'

const coinsHeaders: Header[] = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', width: 100, fixed: true },
  { text: 'Пользователь', value: 'profile.tg_username', sortable: true, width: 125 },
  { text: 'За эту неделю', value: 'coins.received_coins_per_current_week', sortable: true },
  { text: `За 7\u{00a0}дней`, value: 'coins.received_coins_per_last_7_days', sortable: true },
  { text: 'За текущий месяц', value: 'coins.received_coins_per_current_month', sortable: true },
  { text: 'За 30\u{00a0}дней', value: 'coins.received_coins_per_last_30_days', sortable: true },
  { text: 'Всего монет', value: 'coins.total_received_coins', sortable: true, width: 80 },
  { text: 'Баланс', value: 'profile.current_balance', sortable: true, width: 70 },
]

const awardsHeaders: Header[] = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', width: 100, fixed: true },
  { text: 'Пользователь', value: 'profile.tg_username', sortable: true, width: 125 },
  { text: 'За эту неделю', value: 'rewards.rewards_per_current_week', sortable: true },
  { text: 'За 7\u{00a0}дней', value: 'rewards.rewards_per_last_7_days', sortable: true },
  { text: 'За текущий месяц', value: 'rewards.rewards_per_current_month', sortable: true },
  { text: 'За 30\u{00a0}дней', value: 'rewards.rewards_per_last_30_days', sortable: true },
  { text: 'Всего наград', value: 'rewards.total_rewards', sortable: true },
]

const { data: items } = useQuery({
  queryKey: ['rating'],
  queryFn: () => axios.get('/seller/ratings'),
})

type RatingTabs = 'coins' | 'awards'

const currentTab = ref<RatingTabs>('coins')

const { width } = useWindowSize()
</script>

<template>
  <main class="main">
    <h2 class="page-header">Рейтинг участников сообщества</h2>
    <menu class="bonus-shop__tabs list-to-menu">
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'coins' }"
        @click="currentTab = 'coins'"
      >
        Монеты
      </li>
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'awards' }"
        @click="currentTab = 'awards'"
      >
        Награды
      </li>
    </menu>
    <AlertBlock type="warning" v-if="width < 768">
      Рекомендуется просматривать таблицу с&nbsp;компьютеров
    </AlertBlock>
    <EasyDataTable
      v-show="currentTab == 'coins'"
      :headers="coinsHeaders"
      :items="items?.data.ratings || []"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      :rows-items="[15, 20, 25]"
      theme-color="#67d2e9"
      :rows-per-page="10"
      rows-of-page-separator-message="из"
      rows-per-page-message="Записей на странице:"
      empty-message="Нет данных"
      :loading="!items?.data.ratings"
      :buttons-pagination="width >= 570"
      show-index
      show-index-symbol="№"
    >
      <template #[`item-profile.tg_username`]="item">
        <div class="account">
          <img v-if="item.profile.tg_avatar" :src="item.profile.tg_avatar" class="avatar" />
          <img v-else src="./../assets/icons/avatar-default.svg" class="avatar" />
          <span>{{ item.profile.tg_username }}</span>
        </div>
      </template>
      <template #[`item-profile.impact-account`]="item">
        {{ item.profile['impact-account'].split('.')[0] }}
      </template>
      <template #loading>
        <div data-v-32683533="" class="vue3-easy-data-table__loading">
          <div data-v-32683533="" class="vue3-easy-data-table__loading-mask"></div>
          <div data-v-32683533="" class="loading-entity">
            <div data-v-1fa3a520="" data-v-32683533="" class="lds-ring" style="--26774109: #67d2e9;">
              <div data-v-1fa3a520=""></div><div data-v-1fa3a520=""></div>
              <div data-v-1fa3a520=""></div><div data-v-1fa3a520=""></div>
            </div>
          </div>
          <p style="margin-left: 10px">Загрузка данных занимает несколько секунд, подождите…</p>
        </div>
      </template>
    </EasyDataTable>
    <EasyDataTable
      v-show="currentTab == 'awards'"
      :headers="awardsHeaders"
      :items="items?.data.ratings || []"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      :rows-items="[15, 20, 25]"
      theme-color="#67d2e9"
      :rows-per-page="10"
      rows-of-page-separator-message="из"
      rows-per-page-message="Записей на странице:"
      empty-message="Нет данных"
      :loading="!items?.data.ratings"
      :buttons-pagination="width >= 570"
      show-index
      show-index-symbol="№"
    >
      <template #[`item-profile.tg_username`]="item">
        <div class="account">
          <img v-if="item.profile.tg_avatar" :src="item.profile.tg_avatar" class="avatar" />
          <img v-else src="./../assets/icons/avatar-default.svg" class="avatar" />
          <span>{{ item.profile.tg_username }}</span>
        </div>
      </template>
      <template #[`item-profile.impact-account`]="item">
        {{ item.profile['impact-account'].split('.')[0] }}
      </template>
      <template #loading>
        <div data-v-32683533="" class="vue3-easy-data-table__loading">
          <div data-v-32683533="" class="vue3-easy-data-table__loading-mask"></div>
          <div data-v-32683533="" class="loading-entity">
            <div data-v-1fa3a520="" data-v-32683533="" class="lds-ring" style="--26774109: #67d2e9;">
              <div data-v-1fa3a520=""></div><div data-v-1fa3a520=""></div>
              <div data-v-1fa3a520=""></div><div data-v-1fa3a520=""></div>
            </div>
          </div>
          <p style="margin-left: 10px">Загрузка данных занимает несколько секунд, подождите…</p>
        </div>
      </template>
    </EasyDataTable>
  </main>
</template>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 25%;
  background-color: aliceblue;
}
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}
</style>

<style>
/* Нужно для корректного показа кнопок */
.buttons-pagination > .button {
  all: unset;
}
.account {
  overflow-x: auto;
}

.account::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #aaa; /* or add it to the track */
}

.account::-webkit-scrollbar-thumb {
  background: #727272;
}

.vue3-easy-data-table__body tr > td:nth-child(2) {
  text-align: left !important;
}
</style>
