<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import './../assets/tabs.css'
import { useWindowSize } from '@vueuse/core'
import AlertBlock from '@/components/AlertBlock.vue'
import VueMultiselect from 'vue-multiselect'
import { monthNC } from '@/constants/months'

const currentMonth = monthNC[new Date().getMonth()]

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
    if (dateMode.value == 'Последняя активность') {
      columns.push({
        text: '30 дней',
        value: 'coins.received_coins_per_last_30_days',
        sortable: true,
      })
    }
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

type RatingTabs = 'bonuses' | 'coins' | 'rewards'

const currentTab = ref<RatingTabs>('coins')

const { width } = useWindowSize()

const searchInput = ref<HTMLInputElement | null>(null)
const searchValue = ref('')

const selectedFields = ref([
  { type: '7_days', label: '7 дней' },
  { type: '30_days', label: '30 дней' },
  { type: 'coins_spent', label: 'Всего монет', caption: 'Монеты' },
  { type: 'balance', label: 'Баланс', caption: 'Монеты' },
  { type: 'total_rewards', label: 'Всего наград', caption: 'Награды' },
])

type dateModes = 'Период' | 'Последняя активность'

const dateMode = ref<dateModes>('Последняя активность')

// Увеличение ячейки пользоавателя при наведении на неё

onMounted(() => {
  const tbody = document.querySelectorAll('.vue3-easy-data-table__body')

  const mouseover = (event: Event) => {
    const td = (event.target as HTMLElement)?.closest('td')
    if (
      td?.children[0] &&
      td.children[0].classList.contains('account') &&
      td.clientWidth < td.scrollWidth
    ) {
      const { top, left } = td.getBoundingClientRect()
      const newTd = td.cloneNode(true) as HTMLElement
      newTd.classList.add('td-over')
      newTd?.setAttribute(
        'style',
        `top: ${top + window.scrollY - 1}px; left: ${left + window.scrollX - 1}px`,
      )
      newTd?.children[0].setAttribute('style', 'max-width: none')
      newTd.dataset.clone = ''
      document.body.append(newTd)
    }
  }
  tbody[0].addEventListener('pointerover', mouseover)
  tbody[1].addEventListener('pointerover', mouseover)

  const removeClones = (event: Event) => {
    const pointerEvent = event as PointerEvent
    const newTds = document.querySelector('[data-clone]')
    if (!newTds) return
    const point = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY)
    const newTd2 = point?.closest('[data-clone]')
    if (newTd2 != newTds) {
      newTds.remove()
    }
  }

  const removeClones2 = () => {
    const newTds = document.querySelector('[data-clone]')
    newTds?.remove()
  }

  document.addEventListener('pointermove', removeClones)
  document.addEventListener('touchend', removeClones2)
  document.addEventListener('touchmove', removeClones2)
  document.addEventListener('scroll', removeClones2)
})

const allOptions = [
  { type: '7_days', label: '7 дней' },
  { type: '30_days', label: '30 дней' },
  { type: 'current_week', label: 'Эта неделя' },
  { type: 'current_month', label: currentMonth },
  { type: 'coins_spent', label: 'Всего монет', rating: 'coins' },
  { type: 'balance', label: 'Баланс', rating: 'coins' },
  { type: 'total_rewards', label: 'Всего наград', rating: 'rewards' },
]

const tableOptions = computed(() => {
  return allOptions.filter(
    (option) => option.rating === undefined || option.rating === currentTab.value,
  )
})

function toggleFields() {
  if (selectedFields.value.length == 7) {
    selectedFields.value = []
  } else {
    selectedFields.value = allOptions
  }
}
</script>

<template>
  <main class="main">
    <h2 class="page-header">Рейтинг участников сообщества</h2>
    <div class="table-settings">
      <div class="table-search" @click="searchInput?.focus()">
        <img src="../assets/icons/search.svg" />
        <input
          class="table-search__input"
          placeholder="Поиск участников в таблице"
          ref="searchInput"
          v-model="searchValue"
          maxlength="32"
        />
        <img
          src="../assets/icons/close.svg"
          class="clear-input-button"
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
            <img src="../assets/icons/eye-slash.svg" height="20" />
            <span v-if="!isOpen">Показать/скрыть колонки</span>
            <span v-else>
              <span v-if="values.length && values.length != 6">
                {{
                  values.length == 7
                    ? 'Все колонки показаны'
                    : `${7 - values.length} колонки скрыты`
                }}
              </span>
              <span v-if="values.length == 6">1 колонка скрыта</span>
              <span v-if="!values.length">Все колонки скрыты</span>
            </span>
          </div>
        </template>
        <template #beforeList>
          <li class="multiselect__element custom-multiselect__element" @click="toggleFields">
            <span class="multiselect__option" v-if="selectedFields.length != 7"
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
        :class="{ active: currentTab === 'rewards' }"
        @click="currentTab = 'rewards'"
      >
        Награды
      </li>
    </menu>
    <AlertBlock type="warning" v-if="width < 768">
      Рекомендуется просматривать таблицу с&nbsp;компьютеров
    </AlertBlock>
    <div v-show="currentTab == 'coins'">
      <EasyDataTable
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
        empty-message="Участники не найдены"
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
            <span v-if="item.profile.tg_username">
              <a
                :href="`https://t.me/${item.profile.tg_username}`"
                class="link"
                target="_blank"
                rel="noopener"
                >{{ item.profile.tg_username }}</a
              >
            </span>
          </div>
        </template>
        <template #[`item-profile.impact-account`]="item">
          {{ item.profile['impact-account'].split('.')[0] }}
        </template>
        <template #loading>
          <div data-v-32683533="" class="vue3-easy-data-table__loading">
            <div data-v-32683533="" class="vue3-easy-data-table__loading-mask"></div>
            <div data-v-32683533="" class="loading-entity">
              <div
                data-v-1fa3a520=""
                data-v-32683533=""
                class="lds-ring"
                style="--26774109: #67d2e9"
              >
                <div data-v-1fa3a520=""></div>
                <div data-v-1fa3a520=""></div>
                <div data-v-1fa3a520=""></div>
                <div data-v-1fa3a520=""></div>
              </div>
            </div>
            <p style="margin-left: 10px">Загрузка данных занимает несколько секунд, подождите…</p>
          </div>
        </template>
      </EasyDataTable>
      <p style="margin-top: 25px">
        Рейтинг сформирован по количеству монет, полученных пользователями за соответствующий
        период.
      </p>
    </div>
    <div v-show="currentTab == 'rewards'">
      <EasyDataTable
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
        empty-message="Участники не найдены"
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
            <span v-if="item.profile.tg_username">
              <a
                :href="`https://t.me/${item.profile.tg_username}`"
                class="link"
                target="_blank"
                rel="noopener"
                >{{ item.profile.tg_username }}</a
              >
            </span>
          </div>
        </template>
        <template #[`item-profile.impact-account`]="item">
          {{ item.profile['impact-account'].split('.')[0] }}
        </template>
        <template #loading>
          <div data-v-32683533="" class="vue3-easy-data-table__loading">
            <div data-v-32683533="" class="vue3-easy-data-table__loading-mask"></div>
            <div data-v-32683533="" class="loading-entity">
              <div
                data-v-1fa3a520=""
                data-v-32683533=""
                class="lds-ring"
                style="--26774109: #67d2e9"
              >
                <div data-v-1fa3a520=""></div>
                <div data-v-1fa3a520=""></div>
                <div data-v-1fa3a520=""></div>
                <div data-v-1fa3a520=""></div>
              </div>
            </div>
            <p style="margin-left: 10px">Загрузка данных занимает несколько секунд, подождите…</p>
          </div>
        </template>
      </EasyDataTable>
      <p style="margin-top: 25px">
        Рейтинг сформирован по количеству наград, полученных пользователями за соответствующий
        период.
      </p>
    </div>
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
  white-space: nowrap;
  max-width: 145px;
}
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
  padding: 9px 40px 0 12px !important;
  height: 40px;
}

.multiselect-mode.multiselect > .multiselect__tags > .multiselect__single {
  position: relative;
  left: -6px;
  top: -2px;
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
