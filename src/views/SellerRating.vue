<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import './../assets/tabs.css'
import AlertBlock from '@/components/AlertBlock.vue'
import VueMultiselect from 'vue-multiselect'
import { monthNC } from '@/constants/months'
import RatingTable from '@/components/rating/RatingTable.vue'
import expandCell from '@/functions/rating/expandCell'

import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import EyeOffIcon from 'vue-material-design-icons/EyeOff.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

const currentMonth = monthNC[new Date().getMonth()]

/* Разработка API для такой функции, возвращающей computed<Header[]> */
/* generateColumns({
    '7_days': 'bonuses.spent_per_last_7_days',
    current_week: 'bonuses.spent_per_current_week',
    current_month: 'rewards.spent_per_current_month',
    '30_days': 'bonuses.spent_per_last_30_days',
    total_spent: {
      label: 'Потрачено монет',
      value: 'bonuses.total_spent',
      sortable: true
    }
})
 */

/*interface IGeneratorOptions {
  [key: string]: string | Header;
}*/

const coinsHeaders = computed<Header[]>(() => {
  const columns: Header[] = [
    { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
    { text: 'Участник', value: 'profile.tg_username', sortable: true },
  ]
  if (selectedFields.value.find((field) => field.type == '7_days')) {
    columns.push({
      text: `7 дней`,
      value: 'coins.received_coins_per_last_7_days',
      sortable: true,
    })
  }
  if (selectedFields.value.find((field) => field.type == 'current_week')) {
    columns.push({
      text: 'Эта неделя',
      value: 'coins.received_coins_per_current_week',
      sortable: true,
    })
  }
  if (selectedFields.value.find((field) => field.type == '30_days')) {
    columns.push({
      text: '30 дней',
      value: 'coins.received_coins_per_last_30_days',
      sortable: true,
    })
  }
  if (selectedFields.value.find((field) => field.type == 'current_month')) {
    columns.push({
      text: currentMonth,
      value: 'coins.received_coins_per_current_month',
      sortable: true,
    })
  }
  if (selectedFields.value.find((field) => field.type == 'coins_spent')) {
    columns.push({ text: 'Всего монет', value: 'coins.total_received_coins', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'balance')) {
    columns.push({ text: 'Баланс', value: 'profile.current_balance', sortable: true })
  }
  return columns
})

const rewardsHeaders = computed<Header[]>(() => {
  const columns: Header[] = [
    { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
    { text: 'Участник', value: 'profile.tg_username', sortable: true },
  ]
  if (selectedFields.value.find((field) => field.type == '7_days')) {
    columns.push({ text: `7 дней`, value: 'rewards.rewards_per_last_7_days', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'current_week')) {
    columns.push({ text: 'Эта неделя', value: 'rewards.rewards_per_current_week', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'current_month')) {
    columns.push({
      text: currentMonth,
      value: 'rewards.rewards_per_current_month',
      sortable: true,
    })
  }
  if (selectedFields.value.find((field) => field.type == '30_days')) {
    columns.push({ text: '30 дней', value: 'rewards.rewards_per_last_30_days', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'total_rewards')) {
    columns.push({ text: 'Всего наград', value: 'rewards.total_rewards', sortable: true })
  }
  return columns
})

const bonusesHeaders = computed<Header[]>(() => {
  const columns: Header[] = [
    { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
    { text: 'Участник', value: 'profile.tg_username', sortable: true },
  ]
  if (selectedFields.value.find((field) => field.type == '7_days')) {
    columns.push({ text: `7 дней`, value: 'bonuses.spent_per_last_7_days', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'current_week')) {
    columns.push({ text: 'Эта неделя', value: 'bonuses.spent_per_current_week', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'current_month')) {
    columns.push({ text: currentMonth, value: 'rewards.spent_per_current_month', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == '30_days')) {
    columns.push({ text: '30 дней', value: 'bonuses.spent_per_last_30_days', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == 'total_spent')) {
    columns.push({ text: 'Потрачено монет', value: 'bonuses.total_spent', sortable: true })
  }
  return columns
})

const { data: coinsItems } = useQuery({
  queryKey: ['rating', 'rating_by_coins'],
  queryFn: async () => {
    const start = performance.now()
    const res = await axios.get('/seller/rating_by_coins')
    const time = performance.now() - start
    console.log('Rating by coins', (time / 1000).toFixed(2), 's')
    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

const { data: rewardsItems } = useQuery({
  queryKey: ['rating', 'rating_by_rewards'],
  queryFn: async () => {
    const start = performance.now()
    const res = await axios.get('/seller/rating_by_rewards')
    const time = performance.now() - start
    console.log('Rating by rewards', (time / 1000).toFixed(2), 's')
    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

const { data: bonusesItems } = useQuery({
  queryKey: ['rating', 'rating_by_bonuses'],
  queryFn: async () => {
    const start = performance.now()
    const res = await axios.get('/seller/rating_by_bonuses')
    const time = performance.now() - start
    console.log('Rating by bonuses', (time / 1000).toFixed(2), 's')
    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

type RatingTabs = 'bonuses' | 'coins' | 'rewards'

const currentTab = ref<RatingTabs>('coins')

const searchInput = ref<HTMLInputElement | null>(null)
const searchValue = ref('')

const selectedFields = ref([
  { type: '7_days', label: '7 дней' },
  { type: '30_days', label: '30 дней' },
  { type: 'coins_spent', label: 'Всего монет', caption: 'Монеты' },
  { type: 'balance', label: 'Баланс', caption: 'Монеты' },
  { type: 'total_rewards', label: 'Всего наград', caption: 'Награды' },
  { type: 'total_spent', label: 'Потрачено монет', rating: 'bonuses' },
])

const allOptions = [
  { type: '7_days', label: '7 дней' },
  { type: '30_days', label: '30 дней' },
  { type: 'current_week', label: 'Эта неделя' },
  { type: 'current_month', label: currentMonth },
  { type: 'coins_spent', label: 'Всего монет', rating: 'coins' },
  { type: 'balance', label: 'Баланс', rating: 'coins' },
  { type: 'total_rewards', label: 'Всего наград', rating: 'rewards' },
  { type: 'total_spent', label: 'Потрачено монет', rating: 'bonuses' },
]

const tableOptions = computed(() => {
  return allOptions.filter(
    (option) => option.rating === undefined || option.rating === currentTab.value,
  )
})

function toggleFields() {
  if (selectedFields.value.length == allOptions.length) {
    selectedFields.value = []
  } else {
    selectedFields.value = allOptions
  }
}

onMounted(() => {
  expandCell()
})
</script>

<template>
  <main class="main">
    <h2 class="page-header">Рейтинг участников сообщества</h2>
    <div class="table-settings">
      <div class="table-search" @click="searchInput?.focus()">
        <MagnifyIcon fillColor="#999999" style="height: 24px" />
        <input
          class="table-search__input"
          placeholder="Поиск участников в таблице"
          ref="searchInput"
          v-model="searchValue"
          maxlength="32"
        />
        <CloseIcon 
          class="clear-input-button icon"
          v-show="searchValue"
          @click="searchValue = ''"
        />
      </div>
      <VueMultiselect
        v-model="selectedFields"
        :options="tableOptions"
        selectLabel="Показать"
        deselectLabel="Скрыть"
        selectedLabel=""
        :searchable="false"
        label="label"
        track-by="type"
        placeholder=""
        class="multiselect-custom multiselect-width"
        :multiple="true"
        :close-on-select="false"
      >
        <template #selection="{ values, isOpen }">
          <div style="display: flex; align-items: center; gap: 12px">
            <EyeOffIcon fillColor="#999999" style="height: 24px" />
            <span v-if="!isOpen">Показать/скрыть колонки</span>
            <span v-else>
              <span v-if="values.length && values.length !== allOptions.length - 1">
                {{
                  values.length == allOptions.length
                    ? 'Все колонки показаны'
                    : `${allOptions.length - values.length} ${allOptions.length - values.length < 5 ? 'колонки' : 'колонок'} ${allOptions.length - values.length < 5 ? 'скрыты' : 'скрыто'}`
                }}
              </span>
              <span v-if="values.length == allOptions.length - 1">1 колонка скрыта</span>
              <span v-if="!values.length">Все колонки скрыты</span>
            </span>
          </div>
        </template>
        <template #beforeList>
          <li class="multiselect__element custom-multiselect__element" @click="toggleFields">
            <span class="multiselect__option" v-if="selectedFields.length != allOptions.length"
              >Показать все колонки</span
            >
            <span class="multiselect__option" v-else>Скрыть все колонки</span>
          </li>
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
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'bonuses' }"
        @click="currentTab = 'bonuses'"
      >
        Бонусы
      </li>
      <li
        class="bonus-shop__tab"
        :class="{ active: currentTab === 'rewards' }"
        @click="currentTab = 'rewards'"
      >
        Награды
      </li>
    </menu>
    <AlertBlock type="warning" class="warn">
      Рекомендуется просматривать таблицу с&nbsp;компьютеров
    </AlertBlock>
    <div v-show="currentTab == 'coins'">
      <RatingTable
        :headers="coinsHeaders"
        :items="coinsItems"
        :search-value="searchValue"
      />
      <p style="margin-top: 25px">
        Рейтинг сформирован по количеству монет, полученных пользователями за соответствующий период.
      </p>
    </div>
    <div v-show="currentTab == 'bonuses'">
      <RatingTable
        :headers="bonusesHeaders"
        :items="bonusesItems"
        :search-value="searchValue"
      />
      <p style="margin-top: 25px">
        Рейтинг сформирован по количеству монет, потраченных пользователями на покупку бонусов сообщества за соответствующий период.
      </p>
    </div>
    <div v-show="currentTab == 'rewards'">
      <RatingTable
        :headers="rewardsHeaders"
        :items="rewardsItems"
        :search-value="searchValue"
      />
      <p style="margin-top: 25px">
        Рейтинг сформирован по количеству наград, полученных пользователями за соответствующий период.
      </p>
    </div>
  </main>
</template>

<style scoped>
.table-settings {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;
  gap: 15px;
}

.table-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--brand-main-color);
  border-radius: 4px;
  padding: 7px 12px;
  cursor: text;
  user-select: none;
  width: 310px;
  box-sizing: border-box;
}

.table-search__input {
  width: 100%;
  border: none;
  outline: none;
}

.multiselect-width {
  width: 260px;
  box-sizing: border-box;
}

.custom-multiselect__element:hover {
  background-color: #41b883;
  color: #fff;
}

.clear-input-button {
  opacity: 0.5;
  cursor: pointer;
}

.warn {
  display: none;
}

@media screen and (max-width: 768px) {
  .warn {
    display: block;
  }
}

@media screen and (max-width: 980px) and (min-width: 769px) {
  .table-settings {
    margin-top: 25px;
  }
  .multiselect-width {
    width: 310px;
  }
}

@media screen and (max-width: 624px) {
  .multiselect-width,
  .table-search {
    width: 100%;
  }
  .table-settings {
    margin-top: 25px;
  }
}
</style>

<style>
/* Нужно для корректного показа кнопок */
.buttons-pagination > .button {
  all: unset;
}

.account::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #aaa; /* or add it to the track */
}

.account::-webkit-scrollbar-thumb {
  background: #727272;
}

:root {
  --max-table-width: 998px;
}

.vue3-easy-data-table__body td:nth-child(2) {
  text-align: left !important;
}

.vue3-easy-data-table__header th {
  white-space: nowrap;
}

.vue3-easy-data-table__header th:nth-child(2) .direction-center {
  justify-content: flex-start !important;
}

.vue3-easy-data-table__header th:nth-child(3) .direction-center {
  justify-content: flex-start !important;
}

.vue3-easy-data-table__header th {
  font-size: 14px !important;
}

.vue3-easy-data-table__body tr {
  font-size: 14px !important;
}

.multiselect-custom {
  margin-left: initial;
}

.multiselect.multiselect-custom > .multiselect__tags {
  font-size: 13px !important;
  padding: 7px 40px 0 12px !important;
  height: 40px;
}

.td-over {
  position: absolute;
  width: fit-content;
  z-index: 4;
  background-color: white;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  padding: 0 10px;
}

.main-margins {
  max-width: 1300px;
}

.table-fixed table {
  table-layout: auto !important;
}
</style>
