<script setup lang="ts">
import { ref, computed, toValue, watchEffect } from 'vue'
import EasyDataTable, { type Header } from 'vue3-easy-data-table'
import './../assets/tabs.css'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import { Bar } from 'vue-chartjs'
import VueMultiselect from 'vue-multiselect'
import type { Stat, DayStat, WeekStat, MonthStat } from '@/types/stats'
import { convertDate, standartDate, compareDates } from '@/functions'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
} from 'chart.js'
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { vOnClickOutside } from '@vueuse/components'

import ChartBoxOutlineIcon from 'vue-material-design-icons/ChartBoxOutline.vue'
import BorderAllIcon from 'vue-material-design-icons/BorderAll.vue'
import ViewAgendaOutlineIcon from 'vue-material-design-icons/ViewAgendaOutline.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { data: statsPerDays } = useQuery({
  queryKey: ['stats', 'stats_per_days'],
  queryFn: () => axios.get('/seller/statistics_per_days'),
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

const { data: statsPerWeeks } = useQuery({
  queryKey: ['stats', 'stats_per_weeks'],
  queryFn: async () => {
    const res = await axios.get('/seller/statistics_per_weeks')

    res.data.statistics.forEach((item: WeekStat) => {
      if (typeof item.date !== 'string') {
        item.date = `${convertDate(item.date.first_week_day)}-${convertDate(item.date.last_week_day)}`
      }
    })

    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

const { data: statsPerMonths } = useQuery({
  queryKey: ['stats', 'stats_per_months'],
  queryFn: async () => {
    const res = await axios.get('/seller/statistics_per_months')

    res.data.statistics.forEach((item: MonthStat) => {
      item.date = item.month
    })

    return res
  },
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

type StatsTabs = 'days' | 'weeks' | 'months'

const currentTab = ref<StatsTabs>('days')

const tabs: { tab: StatsTabs; label: string }[] = [
  { tab: 'days', label: 'Дни' },
  { tab: 'weeks', label: 'Недели' },
  { tab: 'months', label: 'Месяцы' },
]

const headers: Header[] = [
  { text: '', value: 'date' },
  { text: 'Монеты', value: 'coins', sortable: true },
  { text: 'Награды', value: 'rewards', sortable: true },
  { text: 'Участники', value: 'users', sortable: true },
]

interface OrderedData {
  coins: number[]
  rewards: number[]
  users: number[]
}

type Interval = '7 days' | '30 days' | '3 months' | 'last year' | 'custom'
type OptionInterval = { interval: Interval, label: string, days?: number }

const intervalOptions: ReadonlyArray<OptionInterval> = [
  { interval: '7 days', label: '7 дней', days: 7 },
  { interval: '30 days', label: '30 дней', days: 30 },
  { interval: '3 months', label: '3 месяца', days: 90 },
  { interval: 'last year', label: 'Год', days: 365 },
] as const

const interval = ref<OptionInterval>(intervalOptions[0])

const customInterval = ref({
  start: new Date(),
  end: new Date((new Date()).setDate((new Date()).getDate() - 7))
})

const isModalOpened = ref(false)

function applyInterval() {
  interval.value = {interval: 'custom', label: 'Выбрать интервал'}
  isModalOpened.value = false
  /* Костыль, чтобы не отображался заголовок */
  const multiselectLabel = document.querySelector(".multiselect__single")
  multiselectLabel?.setAttribute('style', "display: none")
}

const last_days = computed(() => {
  let last_days: number | 'custom' = 'custom'
  if (currentTab.value === 'days' && interval.value.interval !== 'custom' && interval.value.days) {
    last_days = interval.value.days
  }
  else if (currentTab.value !== 'days') {
    last_days = Infinity
  }
  return last_days
})

function filterInterval(stat: DayStat) {
  const compareStart = compareDates(stat.date, customInterval.value.start)
  const compareEnd = compareDates(stat.date, customInterval.value.end)
  return (compareStart == '>' || compareStart == '==') && (compareEnd == '<' || compareEnd == '==')
}

const statData = computed<OrderedData>(() => {
  let data = null
  if (currentTab.value === 'days') {
    data = statsPerDays.value
  }
  if (currentTab.value === 'weeks') {
    data = statsPerWeeks.value
  }
  if (currentTab.value === 'months') {
    data = statsPerMonths.value
  }
  let stats
  if (last_days.value !== 'custom') {
    stats = data?.data.statistics.slice(-last_days.value)
  } else {
    stats = data?.data.statistics.filter(filterInterval)
  }
  return {
    coins: stats?.map((item: Stat) => item.coins),
    rewards: stats?.map((item: Stat) => item.rewards),
    users: stats?.map((item: Stat) => item.users),
  }
})

const labels = computed(() => {
  if (currentTab.value === 'days') {
    if (last_days.value !== 'custom') {
      return statsPerDays.value?.data.statistics.slice(-last_days.value).map((item: DayStat) => convertDate(item.date))
    } else {
      return statsPerDays.value?.data.statistics.filter(filterInterval).map((item: DayStat) => convertDate(item.date))
    }
  }
  if (currentTab.value === 'weeks') {
    return statsPerWeeks.value?.data.statistics.map((item: WeekStat) => item.date)
  }
  if (currentTab.value === 'months') {
    return statsPerMonths.value?.data.statistics.map((item: MonthStat) => item.month)
  }
  return null
})

const chartData = ref<ChartData<'bar'>>()

watchEffect(() => {
  chartData.value = {
    labels: toValue(labels),
    datasets: [
      {
        label: 'Монеты',
        backgroundColor: '#4285f4',
        data: statData.value.coins,
      },
      {
        label: 'Награды',
        backgroundColor: '#00a453',
        data: statData.value.rewards,
      },
      {
        label: 'Участники',
        backgroundColor: '#da5707',
        data: statData.value.users,
      },
    ],
  }
})

type ViewMode = 'chart' | 'table' | 'all'

const viewMode = ref<ViewMode>('chart')

const tableData = computed(() => {
  if (currentTab.value === 'days') {
    if (last_days.value !== 'custom') {
      return statsPerDays.value?.data.statistics.toReversed().slice(-last_days.value)
    }
    else {
      return statsPerDays.value?.data.statistics.filter(filterInterval).toReversed()
    }
  }
  if (currentTab.value === 'weeks') {
    return statsPerWeeks.value?.data.statistics.toReversed()
  }
  if (currentTab.value === 'months') {
    return statsPerMonths.value?.data.statistics.toReversed()
  }
  return null
})

function showLabel() {
  const multiselectLabel = document.querySelector(".multiselect__single")
  multiselectLabel?.removeAttribute("style")
}
</script>

<template>
  <main class="main">
    <h2>Статистика сообщества</h2>
    <menu
      class="bonus-shop__tabs list-to-menu"
      style="margin-top: 25px; justify-content: space-between"
    >
      <div style="display: flex">
        <li
          v-for="tab in tabs"
          :key="tab.tab"
          class="bonus-shop__tab"
          :class="{ active: currentTab === tab.tab }"
          @click="currentTab = tab.tab"
        >
          {{ tab.label }}
        </li>
      </div>
      <div style="display: flex; gap: 10px">
        <ChartBoxOutlineIcon
          class="view-mode-icon"
          :class="{ 'view-active': viewMode == 'chart' }"
          @click="viewMode = 'chart'"
          title="График"
        />
        <BorderAllIcon
          class="view-mode-icon"
          :class="{ 'view-active': viewMode == 'table' }"
          @click="viewMode = 'table'"
          title="Таблица"
        />
        <ViewAgendaOutlineIcon
          class="view-mode-icon"
          :class="{ 'view-active': viewMode == 'all' }"
          @click="viewMode = 'all'"
          title="График + таблица"
        />
      </div>
    </menu>
    <div>
      <div class="dropdown" v-show="currentTab == 'days'">
        <p>Отображать статистику </p>
        <VueMultiselect
          v-model="interval"
          deselect-label="Нельзя удалить"
          select-label="Выбрать"
          selected-label=""
          track-by="interval"
          label="label"
          :options="intervalOptions"
          :searchable="false"
          :allow-empty="false"
          style="width: 250px"
          @select="showLabel"
        >
          <template #afterList>
            <li class="multiselect__element custom-multiselect__element" @click="isModalOpened = true">
              <span class="multiselect__option">Выбрать интервал</span>
            </li>
          </template>
          <template #selection="{ values }">
            {{ interval.interval !== 'custom' ? values.label : `${ standartDate(customInterval.start) }-${ standartDate(customInterval.end) }` }}
          </template>
          <template #singleLabel></template>
        </VueMultiselect>
      </div>
      <Bar
        v-if="chartData"
        v-show="viewMode == 'chart' || viewMode == 'all'"
        :data="chartData"
        style="margin-bottom: 1em"
        >К сожалению, ваш браузер не поддерживает отрисовку графиков.</Bar
      >
      <EasyDataTable
        v-show="viewMode == 'table' || viewMode == 'all'"
        :headers="headers"
        :items="tableData || []"
        :prevent-context-menu-row="false"
        theme-color="#67d2e9"
        :table-min-height="0"
        rows-of-page-separator-message="из"
        rows-per-page-message="Записей на странице:"
        :rows-per-page="10"
        :rows-items="[15, 20, 50, 100, 250]"
      />
    </div>
  </main>
  <div class="modal" v-show="isModalOpened">
    <div v-on-click-outside="() => { isModalOpened = false }">
      <h2 class="modal__title">Выбрать интервал</h2>
      <DatePicker 
        v-model.range="customInterval" 
        :min-date="statsPerDays?.data.statistics[0].date"
        :max-date="new Date()"
        color="cyan"
        style="margin-bottom: 1em"
      />
      <div class="modal-button-group">
        <button
          class="button main-button"
          style="border-color: transparent; margin-right: 16px"
          @click="applyInterval"
        >Применить</button>
        <a
          href="#"
          class="button"
          style="border-color: var(--brand-main-color)"
          @click.prevent="isModalOpened = false"
        >Закрыть</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-mode-icon {
  cursor: pointer;
}
.dropdown {
  display: flex; 
  align-items: center; 
  gap: 10px; 
  margin-bottom: 1em
}
.modal__title {
  font-size: 1.25em;
  font-weight: 500;
  margin-bottom: var(--base-margin);
}
</style>

<style>
.td {
  white-space: nowrap;
}

.view-active > svg {
  fill: #67d2e9;
}

.view-mode-icon:not(.view-active) > svg:hover {
  fill: hsl(0, 0%, 55%);
}

.vc-cyan {
  --vc-accent-50: #D6F9FF;
  --vc-accent-100: #b8ebf3;
  --vc-accent-200: #a3eaf8;
  --vc-accent-300: #67d2e9;
  --vc-accent-400: #5FC0D3;
  --vc-accent-500: #4ea3b5;
  --vc-accent-600: #2e8896;
  --vc-accent-700: #1D7682;
  --vc-accent-800: #066370;
  --vc-accent-900: #004851;
}
</style>
