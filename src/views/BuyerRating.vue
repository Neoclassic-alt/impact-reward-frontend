<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import axios from 'axios'
import { useQueries } from '@tanstack/vue-query'
import './../assets/tabs.css'
import AlertBlock from '@/components/common/AlertBlock.vue'
import VueMultiselect from 'vue-multiselect'
import { monthNC } from '@/constants/months'
import RatingTable from '@/components/rating/RatingTable.vue'
import expandCell from '@/functions/rating/expandCell'
import type { Profile } from '@/types/api/rating'
import { vOnClickOutside } from '@vueuse/components'
import { getEntries } from '@/functions'

import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import EyeOffIcon from 'vue-material-design-icons/EyeOff.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'
import DownloadIcon from 'vue-material-design-icons/Download.vue'
import FilterOffIcon from 'vue-material-design-icons/FilterOff.vue'

const currentMonth = monthNC[new Date().getMonth()]

const commonHeaders = [
  { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
  { text: 'Участник', value: 'profile.tg_username', sortable: true },
]

type Column = {
  label: string
  type: string
  coins?: string
  bonuses?: string
  rewards?: string
  sortable?: boolean
}

const differentHeaders: Column[] = [
  {
    label: '7 дней',
    type: '7_days',
    coins: 'coins.received_coins_per_last_7_days',
    bonuses: 'bonuses.spent_per_last_7_days',
    rewards: 'rewards.rewards_per_last_7_days',
    sortable: true,
  },
  {
    label: 'Эта неделя',
    type: 'current_week',
    coins: 'coins.received_coins_per_current_week',
    bonuses: 'bonuses.spent_per_current_week',
    rewards: 'rewards.rewards_per_current_week',
    sortable: true,
  },
  {
    label: currentMonth,
    type: 'current_month',
    coins: 'coins.received_coins_per_current_month',
    bonuses: 'bonuses.spent_per_current_month',
    rewards: 'rewards.rewards_per_current_month',
    sortable: true,
  },
  {
    label: '30 дней',
    type: '30_days',
    coins: 'coins.received_coins_per_last_30_days',
    bonuses: 'bonuses.spent_per_last_30_days',
    rewards: 'rewards.rewards_per_last_30_days',
    sortable: true,
  },
  {
    label: 'Всего монет',
    type: 'coins_spent',
    coins: 'coins.total_received_coins',
    sortable: true,
  },
  { label: 'Баланс', type: 'balance', coins: 'profile.current_balance', sortable: true },
  {
    label: 'Всего наград',
    type: 'total_rewards',
    rewards: 'rewards.total_rewards',
    sortable: true,
  },
  { label: 'Потрачено монет', type: 'total_spent', bonuses: 'bonuses.total_spent', sortable: true },
]

const currentHeaders = computed<Header[]>(() => {
  const columns: Header[] = structuredClone(commonHeaders)
  selectedFields.value.forEach((field) => {
    const header = differentHeaders.find((header) => header.type == field.type)
    const headerValue = header?.[currentTab.value]
    if (headerValue) {
      columns.push({ text: field.label, value: headerValue, sortable: true })
    }
  })
  return columns
})

const fetches = [
  { key: 'rating_by_coins', tab: 'coins', url: '/seller/rating_by_coins' },
  { key: 'rating_by_bonuses', tab: 'bonuses', url: '/seller/rating_by_bonuses' },
  { key: 'rating_by_rewards', tab: 'rewards', url: '/seller/rating_by_rewards' },
]

const allItems = useQueries({
  queries: fetches.map((fetch) => ({
    queryKey: ['rating', fetch.key],
    queryFn: async () => {
      const res = await axios.get(fetch.url)
      // для целей поиска
      res.data.rating.forEach(({ profile }: { profile: Profile }) => {
        const searchItem = `${profile.tg_username ?? ''} ${profile.tg_nickname}`
        profile.tg_search = searchItem
      })
      return res
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })),
  combine: (results) => {
    return {
      data: results.map((result) => result.data),
    }
  },
})

const currentItems = computed(() => {
  const ratingTabIndex = fetches.findIndex((fetchInfo) => fetchInfo.tab == currentTab.value)
  if (ratingTabIndex !== -1) {
    return allItems.value.data[ratingTabIndex]
  }
  return []
})

type RatingTabs = 'bonuses' | 'coins' | 'rewards'

const currentTab = ref<RatingTabs>('coins')

const tabs: ReadonlyArray<{ tab: RatingTabs; label: string }> = [
  { tab: 'coins', label: 'Монеты' },
  { tab: 'rewards', label: 'Награды' },
  { tab: 'bonuses', label: 'Бонусы' },
]

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

const appliedFilters = [] // TODO

const isDownloadModalOpen = ref(false)

const downloadSettings = reactive({
  types: {
    bonuses: true,
    rewards: true,
    coins: true,
  },
  separator: {
    symbol: ';',
    label: 'Точка с запятой',
  },
})

const separators = [
  { symbol: ';', label: 'Точка с запятой' },
  { symbol: ',', label: 'Запятая' },
  { symbol: '\t', label: 'Табуляция' },
]

// те колонки, что не вошли в таблицу
const downloadColumns = [
  { type: 'profile.tg_nickname', label: 'Никнейм' },
  /*{type: 'profile.tg_avatar', label: 'URL аватара'},*/
  { type: 'profile.wallet_bot_status', label: 'Бот включён' },
]

function downloadRatings() {
  const entries = Object.entries(downloadSettings.types)
  entries.map((entry) => {
    if (entry[1]) {
      const itemsIndex = fetches.findIndex((fetch) => fetch.tab == entry[0])
      const data = allItems.value.data[itemsIndex]
      dataToCSV(data?.data.rating, entry[0])
    }
  })
}

function dataToCSV(rating: any, tab: string) {
  const csv_data = []
  const separator = downloadSettings.separator.symbol
  const rawHeaders = getEntries(rating[0]).map((entry: any[]) => entry[0])
  const namedHeaders = rawHeaders.map(nameColumn, { tab })
  const nullNumbers = namedHeaders
    .map((el: string | null, index: number) => (el === null ? index : null))
    .filter((el: number | null) => el !== null)
  csv_data.push(namedHeaders.filter((el: string | null) => el !== null).join(separator))

  for (let i = 0; i < rating.length; i++) {
    const entries = getEntries(rating[i])
    const row = entries.map((entry: [string, string | number | null]) => entry[1] ?? 'N/A')
    csv_data.push(
      row
        .filter((el: string | number, index: number) => !nullNumbers.includes(index))
        .join(separator),
    )
  }

  const csv_ready_data = csv_data.join('\n')

  downloadCSVFile(csv_ready_data, tab)
}

function nameColumn(this: { tab: RatingTabs }, header: string) {
  const commonColumn = commonHeaders.find((_header) => _header.value == header)
  if (commonColumn) {
    return commonColumn.text
  }
  const diffColumn = differentHeaders.find((_header) => _header[this.tab] == header)
  if (diffColumn) {
    return diffColumn.label
  }
  const downloadColumn = downloadColumns.find((_header) => _header.type == header)
  if (downloadColumn) {
    return downloadColumn.label
  }
  return null
}

function downloadCSVFile(csv_data: string, tab: string) {
  const CSVFile = new Blob([csv_data], { type: 'text/csv' })

  let temp_link = document.createElement('a')

  temp_link.download = `${tab}.csv`
  let url = window.URL.createObjectURL(CSVFile)
  temp_link.href = url

  temp_link.style.display = 'none'
  document.body.appendChild(temp_link)

  temp_link.click()
  document.body.removeChild(temp_link)
}
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
          v-model.trim="searchValue"
          maxlength="100"
        />
        <CloseIcon class="clear-input-button icon" v-show="searchValue" @click="searchValue = ''" />
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
      <div style="flex: 1"></div>
      <a
        class="button bonus-add__button download-button"
        href="#"
        @click="isDownloadModalOpen = true"
        ><DownloadIcon style="height: 20px" fillColor="#999999"
      /></a>
      <!--<a class="button bonus-add__button download-button button-disabled" href="#"
        ><FilterOffIcon style="height: 22px" fillColor="#999999"
      /></a>-->
    </div>
    <menu class="bonus-shop__tabs list-to-menu">
      <li
        v-for="tab in tabs"
        :key="tab.tab"
        class="bonus-shop__tab"
        :class="{ active: currentTab === tab.tab }"
        @click="currentTab = tab.tab"
      >
        {{ tab.label }}
      </li>
    </menu>
    <AlertBlock type="warning" class="warn">
      Рекомендуется просматривать таблицу с&nbsp;компьютеров
    </AlertBlock>
    <RatingTable :headers="currentHeaders" :items="currentItems" :search-value="searchValue" />
    <p v-show="currentTab == 'coins'" style="margin-top: 25px">
      Рейтинг сформирован по количеству монет, полученных пользователями за соответствующий период.
    </p>
    <p v-show="currentTab == 'bonuses'" style="margin-top: 25px">
      Рейтинг сформирован по количеству монет, потраченных пользователями на покупку бонусов
      сообщества за соответствующий период.
    </p>
    <p v-show="currentTab == 'rewards'" style="margin-top: 25px">
      Рейтинг сформирован по количеству наград, полученных пользователями за соответствующий период.
    </p>
  </main>
  <div class="modal" v-show="isDownloadModalOpen">
    <div v-on-click-outside="() => (isDownloadModalOpen = false)">
      <h2 class="bonus__title">Скачать в формате <em>csv</em></h2>
      <form style="width: 100%">
        <ul class="list-to-menu">
          <li>
            <input
              type="checkbox"
              id="checkbox-coins"
              v-model="downloadSettings.types.coins"
              class="custom-checkbox"
            />
            <label for="checkbox-coins">Монеты</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="checkbox-rewards"
              v-model="downloadSettings.types.rewards"
              class="custom-checkbox"
            />
            <label for="checkbox-rewards">Награды</label>
          </li>
          <li>
            <input
              type="checkbox"
              id="checkbox-bonuses"
              v-model="downloadSettings.types.bonuses"
              class="custom-checkbox"
            />
            <label for="checkbox-bonuses">Бонусы</label>
          </li>
          <li style="margin-top: 0.5em" v-show="!(downloadSettings.types.coins || 
          downloadSettings.types.rewards || 
          downloadSettings.types.bonuses)"><em>Вы должны выбрать хотя бы один<br/> тип рейтинга</em></li>
        </ul>
        <p style="margin-block-end: 0.5em">Разделитель</p>
        <VueMultiselect
          v-model="downloadSettings.separator"
          :options="separators"
          selectLabel=""
          deselectLabel=""
          selectedLabel=""
          :searchable="false"
          label="label"
          track-by="symbol"
          placeholder="Разделитель"
          :allow-empty="false"
          class="multiselect-custom multiselect-width"
          style="margin-bottom: 20px"
        />
        <div class="modal-button-group">
          <button
            class="button main-button"
            style="border-color: transparent; margin-right: 16px"
            :disabled="
              !(
                downloadSettings.types.coins ||
                downloadSettings.types.rewards ||
                downloadSettings.types.bonuses
              )
            "
            @click.prevent="
              () => {
                downloadRatings()
                isDownloadModalOpen = false
              }
            "
          >
            <span>Скачать</span>
          </button>
          <a
            href="#"
            class="button"
            style="border-color: var(--brand-main-color)"
            @click.prevent="isDownloadModalOpen = false"
            >Отмена</a
          >
        </div>
      </form>
    </div>
  </div>
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

.button {
  /*font-size: 0.9em;*/
  /*padding: 8px 16px 10px 11px;*/
  padding: 8px 11px 10px 11px;
  border: 1px solid var(--brand-main-color);
}

.download-button {
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 11px;
  border-radius: 5px;
}

.button-disabled {
  opacity: 60%;
  cursor: not-allowed;
}

.button-disabled:hover {
  background-color: unset;
}

.modal > div {
  align-items: flex-start;
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
  padding: 8px 40px 0 12px !important;
  height: 42px;
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

.main {
  max-width: 1100px;
}

.table-fixed table {
  table-layout: auto !important;
}
</style>
