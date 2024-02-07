<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import './../assets/tabs.css'
import { useWindowSize } from '@vueuse/core'
import AlertBlock from '@/components/AlertBlock.vue'
import VueMultiselect from 'vue-multiselect'

const coinsHeaders = computed<Header[]>(() => {
  const columns: Header[] = [
    { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
  ]
  if (selectedFields.value.find((field) => field.type == 'tg_username')) {
    columns.push({ text: 'Участник', value: 'profile.tg_username', sortable: true, width: 115 })
  }
  if (selectedFields.value.find((field) => field.type == '7_days/current_week')) {
    if (dateMode.value == 'Период') {
      columns.push({
        text: 'Неделя',
        value: 'coins.received_coins_per_current_week',
        sortable: true,
      })
    }
    if (dateMode.value == 'Последняя активность') {
      columns.push({
        text: `7 дней`,
        value: 'coins.received_coins_per_last_7_days',
        sortable: true,
      })
    }
  }
  if (selectedFields.value.find((field) => field.type == '30_days/current_month')) {
    if (dateMode.value == 'Период') {
      columns.push({
        text: 'Текущий месяц',
        value: 'coins.received_coins_per_current_month',
        sortable: true,
      })
    }
    if (dateMode.value == 'Последняя активность') {
      columns.push({
        text: '30 дней',
        value: 'coins.received_coins_per_last_30_days',
        sortable: true,
      })
    }
  }
  if (selectedFields.value.find((field) => field.type == 'total')) {
    columns.push({ text: 'Всего монет', value: 'coins.total_received_coins', sortable: true })
  }
  columns.push({ text: 'Баланс', value: 'profile.current_balance', sortable: true })
  return columns
})

const rewardsHeaders = computed<Header[]>(() => {
  const columns: Header[] = [
    { text: 'Импакт-аккаунт', value: 'profile.impact-account', fixed: true },
  ]
  if (selectedFields.value.find((field) => field.type == 'tg_username')) {
    columns.push({ text: 'Участник', value: 'profile.tg_username', sortable: true })
  }
  if (selectedFields.value.find((field) => field.type == '7_days/current_week')) {
    if (dateMode.value == 'Период') {
      columns.push({ text: 'Неделя', value: 'rewards.rewards_per_current_week', sortable: true })
    }
    if (dateMode.value == 'Последняя активность') {
      columns.push({ text: `7 дней`, value: 'rewards.rewards_per_last_7_days', sortable: true })
    }
  }
  if (selectedFields.value.find((field) => field.type == '30_days/current_month')) {
    if (dateMode.value == 'Период') {
      columns.push({
        text: 'Текущий месяц',
        value: 'rewards.rewards_per_current_month',
        sortable: true,
      })
    }
    if (dateMode.value == 'Последняя активность') {
      columns.push({ text: '30 дней', value: 'rewards.rewards_per_last_30_days', sortable: true })
    }
  }
  if (selectedFields.value.find((field) => field.type == 'total')) {
    columns.push({ text: 'Всего наград', value: 'rewards.total_rewards', sortable: true })
  }
  return columns
})

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
    console.log('Rating by coins', (time / 1000).toFixed(2), 's')
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
  { type: 'tg_username', 'label.last_activity': 'Участник', 'label.period': 'Участник' },
  {
    type: '7_days/current_week',
    'label.last_activity': '7 дней',
    'label.period': 'Последняя неделя',
  },
  {
    type: '30_days/current_month',
    'label.last_activity': '30 дней',
    'label.period': 'Последний месяц',
  },
  { type: 'total', 'label.last_activity': 'Всего', 'label.period': 'Всего' },
])

type dateModes = 'Период' | 'Последняя активность'

const dateMode = ref<dateModes>('Последняя активность')

// Увеличение ячейки пользоавателя при наведении на неё

onMounted(() => {
  const tbody = document.querySelectorAll('.vue3-easy-data-table__body')

  const mouseover = (event: Event) => {
    const td = (event.target as HTMLElement)?.closest('td')
    if (
      width.value > 768 && td?.children[0] &&
      td.children[0].classList.contains('account') &&
      td.clientWidth < td.scrollWidth
    ) {
      const { top, left } = td.getBoundingClientRect()
      const newTd = td.cloneNode(true) as HTMLElement
      newTd.classList.add('td-over')
      newTd?.setAttribute(
        'style',
        `top: ${Math.floor(top) + window.scrollY - 1}px; left: ${Math.floor(left) + window.scrollX - 1}px`,
      )
      document.body.append(newTd)
      newTd.addEventListener('pointerleave', () => {
        newTd.remove()
      })
      }
  }
  tbody[0].addEventListener('pointerover', mouseover)
  tbody[1].addEventListener('pointerover', mouseover)
})
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
      </div>
      <!--:showLabels="false"-->
      <VueMultiselect
        v-model="selectedFields"
        :options="[
          { type: 'tg_username', 'label.last_activity': 'Участник', 'label.period': 'Участник' },
          {
            type: '7_days/current_week',
            'label.last_activity': '7 дней',
            'label.period': 'Последняя неделя',
          },
          {
            type: '30_days/current_month',
            'label.last_activity': '30 дней',
            'label.period': 'Последний месяц',
          },
          { type: 'total', 'label.last_activity': 'Всего', 'label.period': 'Всего' },
        ]"
        selectLabel="Показать"
        deselectLabel="Скрыть"
        selectedLabel=""
        :searchable="false"
        :label="dateMode == 'Последняя активность' ? 'label.last_activity' : 'label.period'"
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
              <span v-if="values.length && values.length != 3">
                {{
                  values.length == 4
                    ? 'Все колонки показаны'
                    : `${4 - values.length} колонки скрыты`
                }}
              </span>
              <span v-if="values.length == 3">1 колонка скрыта</span>
              <span v-if="!values.length">Все колонки скрыты</span>
            </span>
          </div>
        </template>
      </VueMultiselect>
      <VueMultiselect
        v-model="dateMode"
        :options="['Последняя активность', 'Период']"
        :searchable="false"
        :showLabels="false"
        :allow-empty="false"
        class="multiselect-custom multiselect-only-one multiselect-mode multiselect-width"
      >
        <template #singleLabel>
          <div style="display: inline-flex; align-items: center; gap: 12px">
            <img src="../assets/icons/time-calendar.png" height="24" />
            <span>Выбрать вид активности</span>
          </div>
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
              class="external-link"
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
            <div data-v-1fa3a520="" data-v-32683533="" class="lds-ring" style="--26774109: #67d2e9">
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
              class="external-link"
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
            <div data-v-1fa3a520="" data-v-32683533="" class="lds-ring" style="--26774109: #67d2e9">
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
  white-space: nowrap;
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
  padding: 7px 10px;
  cursor: text;
  user-select: none;
  width: 300px;
  box-sizing: border-box;
}

.table-search__input {
  width: 100%;
  border: none;
  outline: none;
}

.multiselect-width {
  width: fit-content;
  box-sizing: border-box;
}

@media screen and (max-width: 1257px) {
  .table-settings {
    margin-top: 25px;
  }
  .multiselect-width {
    width: 300px;
  }
}

@media screen and (max-width: 660px) {
  .multiselect-width,
  .table-search {
    width: 100%;
  }
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

:root {
  --max-table-width: 998px;
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
  font-size: 13px;
  padding: 0 10px;
}
</style>
