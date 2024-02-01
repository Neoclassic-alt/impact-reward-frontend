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
  { text: 'Пользователь', value: 'profile.tg_username', sortable: true },
  { text: 'За эту неделю', value: 'coins.received_coins_per_current_week', sortable: true },
  { text: 'За последние 7 дней', value: 'coins.received_coins_per_last_7_days', sortable: true },
  { text: 'За текущий месяц', value: 'coins.received_coins_per_current_month', sortable: true },
  { text: 'За последние 30 дней', value: 'coins.received_coins_per_last_30_days', sortable: true },
  { text: 'Всего денег', value: 'coins.total_received_coins', sortable: true },
  { text: 'Баланс', value: 'profile.current_balance', sortable: true },
]

const awardsHeaders: Header[] = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', width: 100, fixed: true },
  { text: 'Пользователь', value: 'profile.tg_username', sortable: true },
  { text: 'За эту неделю', value: 'rewards.rewards_per_current_week', sortable: true },
  { text: 'За последние 7 дней', value: 'rewards.rewards_per_last_7_days', sortable: true },
  { text: 'За текущий месяц', value: 'rewards.rewards_per_current_month', sortable: true },
  { text: 'За последние 30 дней', value: 'rewards.rewards_per_last_30_days', sortable: true },
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
    <h2 class="page-header">Рейтинг покупателей</h2>
    <menu class="bonus-shop__tabs list-to-menu">
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'coins' }"
        @click="currentTab = 'coins'"
      >
        Рейтинг по монетам
      </li>
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'awards' }"
        @click="currentTab = 'awards'"
      >
        Рейтинг по наградам
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
    >
      <template #[`item-profile.tg_username`]="item">
        <div class="account">
          <img v-if="item.profile.tg_avatar" :src="item.profile.tg_avatar" class="avatar" />
          <span>{{ item.profile.tg_username }}</span>
        </div>
      </template>
      <template #[`item-profile.impact-account`]="item">
        {{ item.profile['impact-account'].split('.')[0] }}
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
    >
      <template #[`item-profile.tg_username`]="item">
        <div class="account">
          <img v-if="item.profile.tg_avatar" :src="item.profile.tg_avatar" class="avatar" />
          <span>{{ item.profile.tg_username }}</span>
        </div>
      </template>
      <template #[`item-profile.impact-account`]="item">
        {{ item.profile['impact-account'].split('.')[0] }}
      </template>
    </EasyDataTable>
  </main>
</template>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 25%;
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
</style>
