<script setup lang="ts">
import { ref, computed, toValue, watchEffect } from 'vue'
import EasyDataTable, { type Header } from 'vue3-easy-data-table'
import './../assets/tabs.css'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import { Bar } from 'vue-chartjs'
import type { Stat, DayStat, WeekStat, MonthStat } from '@/types/stats'
import { convertDate } from '@/functions'
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
  { text: 'Получатели', value: 'users', sortable: true },
]

interface OrderedData {
  coins: number[]
  rewards: number[]
  users: number[]
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
  return {
    coins: data?.data.statistics.map((item: Stat) => item.coins),
    rewards: data?.data.statistics.map((item: Stat) => item.rewards),
    users: data?.data.statistics.map((item: Stat) => item.users),
  }
})

const labels = computed(() => {
  if (currentTab.value === 'days') {
    return statsPerDays.value?.data.statistics.map((item: DayStat) => convertDate(item.date))
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
        label: 'Бонусы',
        backgroundColor: '#00a453',
        data: statData.value.rewards,
      },
      {
        label: 'Пользователи',
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
    return statsPerDays.value?.data.statistics.toReversed()
  }
  if (currentTab.value === 'weeks') {
    return statsPerWeeks.value?.data.statistics.toReversed()
  }
  if (currentTab.value === 'months') {
    return statsPerMonths.value?.data.statistics.toReversed()
  }
  return null
})
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
        hide-footer
        theme-color="#67d2e9"
        :table-min-height="0"
      />
    </div>
  </main>
</template>

<style scoped>
.view-mode-icon {
  cursor: pointer;
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
</style>
