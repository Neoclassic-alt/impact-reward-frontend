<script setup lang="ts">
import { ref } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import './../assets/tabs.css'
import { useWindowSize } from '@vueuse/core'
import AlertBlock from '@/components/AlertBlock.vue'
import VueMultiselect from 'vue-multiselect'

const coinsHeaders: Header[] = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
  { text: 'Участник', value: 'profile.tg_username', sortable: true },
  /*{ text: 'За эту неделю', value: 'coins.received_coins_per_current_week', sortable: true },*/
  { text: `7 дней`, value: 'coins.received_coins_per_last_7_days', sortable: true },
  /*{ text: 'За текущий месяц', value: 'coins.received_coins_per_current_month', sortable: true },*/
  { text: '30 дней', value: 'coins.received_coins_per_last_30_days', sortable: true },
  { text: '365 дней', value: 'todo', sortable: true },
  { text: 'Всего монет', value: 'coins.total_received_coins', sortable: true },
  { text: 'Баланс', value: 'profile.current_balance', sortable: true },
]

const rewardsHeaders: Header[] = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
  { text: 'Участник', value: 'profile.tg_username', sortable: true },
  /*{ text: 'За эту неделю', value: 'rewards.rewards_per_current_week', sortable: true },*/
  { text: '7 дней', value: 'rewards.rewards_per_last_7_days', sortable: true },
  /*{ text: 'За текущий месяц', value: 'rewards.rewards_per_current_month', sortable: true },*/
  { text: '30 дней', value: 'rewards.rewards_per_last_30_days', sortable: true },
  { text: '365 дней', value: 'todo', sortable: true },
  { text: 'Всего наград', value: 'rewards.total_rewards', sortable: true },
]

// TODO
/*const bonusesHeaders: Header[] = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', width: 100, fixed: true },
  { text: 'Участник', value: 'profile.tg_username', sortable: true, width: 125 },
  { text: 'За эту неделю', value: 'bonuses.bonuses_per_current_week', sortable: true },
  { text: 'За 7\u{00a0}дней', value: 'bonuses.bonuses_per_last_7_days', sortable: true },
  { text: 'За текущий месяц', value: 'bonuses.bonuses_per_current_month', sortable: true },
  { text: 'За 30\u{00a0}дней', value: 'bonuses.bonuses_per_last_30_days', sortable: true },
  { text: 'Всего наград', value: 'bonuses.total_bonuses', sortable: true },
]*/

const { data: coinsItems } = useQuery({
  queryKey: ['rating', 'rating_by_coins'],
  queryFn: async () => {
    const start = performance.now()
    const res = await axios.get('/seller/rating_by_coins')
    const time = performance.now() - start
    console.log("Rating by coins", (time / 1000).toFixed(2), "s")
    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

/*const { data: bonusesItems } = useQuery({
  queryKey: ['rating', 'rating_by_bonuses'],
  queryFn: () => axios.get('/seller/rating_by_bonuses'),
})*/

const { data: rewardsItems } = useQuery({
  queryKey: ['rating', 'rating_by_rewards'],
  queryFn: async () => {
    const start = performance.now()
    const res = await axios.get('/seller/rating_by_rewards')
    const time = performance.now() - start
    console.log("Rating by rewards", (time / 1000).toFixed(2), "s")
    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

type RatingTabs = 'bonuses' | 'coins' | 'rewards'

const currentTab = ref<RatingTabs>('coins')

const { width } = useWindowSize()

const searchInput = ref<HTMLInputElement | null>(null)
const searchValue = ref("")

const selectedFields = ref([
  { type: 'tg_username', russianLabel: 'Участник' },
  { type: '7_days', russianLabel: '7 дней' },
  { type: '30_days', russianLabel: '30 дней' },
  { type: '365_days', russianLabel: '365 дней' },
])
</script>

<template>
  <main class="main">
    <h2 class="page-header">Рейтинг участников сообщества</h2>
    <div style="display: flex">
      <div class="table-search" @click="searchInput?.focus()">
        <img src="../assets/icons/search.svg" />
        <input class="table-search__input" placeholder="Поиск участников в таблице" ref="searchInput" v-model="searchValue" maxlength="32" />
      </div>
      <VueMultiselect
        v-model="selectedFields"
        :options="[
          { type: 'tg_username', russianLabel: 'Участник' },
          { type: '7_days', russianLabel: '7 дней' },
          { type: '30_days', russianLabel: '30 дней' },
          { type: '365_days', russianLabel: '365 дней' },
        ]"
        :showLabels="false"
        :searchable="false"
        label="russianLabel"
        track-by="type"
        placeholder="Выберите поля"
        style="width: 200px"
        class="multiselect-custom"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
      >
        <template #selection="{ values }">
          <span class="multiselect__single" v-if="values.length">
            {{ values.length == 4 ? "Все" : values.length }} поля выбраны
          </span>
        </template>
      </VueMultiselect>
    </div>
    <menu class="bonus-shop__tabs list-to-menu">
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'coins' }"
        @click="currentTab = 'coins'"
      >
        Монеты
      </li>
      <!--<li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'bonuses' }"
        @click="currentTab = 'bonuses'"
      >
        Бонусы
      </li>-->
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'rewards' }"
        @click="currentTab = 'rewards'"
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
      :items="coinsItems?.data.rating || []"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      fixed-header
      :rows-items="[15, 20, 25]"
      theme-color="#67d2e9"
      :rows-per-page="10"
      rows-of-page-separator-message="из"
      rows-per-page-message="Записей на странице:"
      empty-message="Нет данных"
      :loading="!coinsItems?.data.rating"
      :buttons-pagination="width >= 570"
      show-index
      show-index-symbol="№"
      :index-column-width="40"
      sort-by="coins.received_coins_per_last_30_days"
      sort-type="desc"
      :table-min-height="100"
      :prevent-context-menu-row="false"
      search-field="profile.tg_username"
      :search-value="searchValue"
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
      v-show="currentTab == 'rewards'"
      :headers="rewardsHeaders"
      :items="rewardsItems?.data.rating || []"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      fixed-header
      :rows-items="[15, 20, 25]"
      theme-color="#67d2e9"
      :rows-per-page="10"
      rows-of-page-separator-message="из"
      rows-per-page-message="Записей на странице:"
      empty-message="Нет данных"
      :loading="!rewardsItems?.data.rating"
      :buttons-pagination="width >= 570"
      show-index
      show-index-symbol="№"
      :index-column-width="40"
      sort-by="rewards.rewards_per_last_30_days"
      sort-type="desc"
      :table-min-height="100"
      :prevent-context-menu-row="false"
      search-field="profile.tg_username"
      :search-value="searchValue"
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
    <!--<EasyDataTable
      v-show="currentTab == 'bonuses'"
      :headers="bonusesHeaders"
      :items="bonusesItems?.data.rating || []"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      :rows-items="[15, 20, 25]"
      theme-color="#67d2e9"
      :rows-per-page="10"
      rows-of-page-separator-message="из"
      rows-per-page-message="Записей на странице:"
      empty-message="Нет данных"
      :loading="!bonusesItems?.data.rating"
      :buttons-pagination="width >= 570"
      show-index
      show-index-symbol="№"
      sort-by="bonuses.bonuses_per_last_30_days"
      sort-type="desc"
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
    </EasyDataTable>-->
  </main>
</template>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 25%;
  background-color: aliceblue;
  user-select: none;
}
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}

.table-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 7px 10px;
  margin-bottom: 25px;
  cursor: text;
  user-select: none;
  width: 280px;
}

.table-search__input {
  width: 100%;
  border: none;
  outline: none;
}

</style>

<style>
/* Нужно для корректного показа кнопок */
.buttons-pagination > .button {
  all: unset;
}
/*.account {
  overflow-x: auto;
}*/

.account::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #aaa; /* or add it to the track */
}

.account::-webkit-scrollbar-thumb {
  background: #727272;
}

.vue3-easy-data-table__body td:nth-child(2) {
  text-align: left !important;
}

.vue3-easy-data-table__main.table-fixed table {
  table-layout: auto;
}


.vue3-easy-data-table__header th {
  white-space: nowrap;
}

.vue3-easy-data-table__body tr {
  font-size: 13px !important;
}
</style>
