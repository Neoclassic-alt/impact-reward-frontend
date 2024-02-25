<script setup lang="ts">
import { ref, computed, toValue, watchEffect } from 'vue'
import EasyDataTable, { type Header } from 'vue3-easy-data-table'
import './../assets/tabs.css'
import VueMultiselect from 'vue-multiselect'
import axios from 'axios'
import { useQuery } from '@tanstack/vue-query'
import { Bar } from 'vue-chartjs'
import type { DayStat, WeekStat } from '@/types/api/stats'
import { convertDate } from '@/functions'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData
} from 'chart.js'
import ChartBoxOutlineIcon from 'vue-material-design-icons/ChartBoxOutline.vue'
import TableIcon from 'vue-material-design-icons/Table.vue'
import ViewGridOutlineIcon from 'vue-material-design-icons/ViewGridOutline.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { data: statsPerDays, isSuccess: statsPerDaysIsSuccess } = useQuery({
  queryKey: ['stats', 'stats_per_days'],
  queryFn: () => axios.get('/seller/statistics_per_days'),
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

const { data: statsPerWeeks, isSuccess: statsPerWeeksIsSuccess } = useQuery({
  queryKey: ['stats', 'stats_per_weeks'],
  queryFn: () => axios.get('/seller/statistics_per_weeks'),
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

type StatsTabs = 'days' | 'weeks' | 'months'

const currentTab = ref<StatsTabs>('days')

const tabs: { tab: StatsTabs, label: string }[] = [
  { tab: "days", label: "Дни" },
  { tab: "weeks", label: "Недели" },
  { tab: "months", label: "Месяцы" },
]

const commonHeaders: Header[] = [
  { text: '', value: '' },
  { text: 'Монеты', value: 'TO DO 1' },
  { text: 'Награды', value: 'TO DO 2' },
  { text: 'Получатели', value: 'TO DO 3' },
]

const dataPerDaysLabels = computed(() => {
  return statsPerDays.value?.data.statistics.map((item: DayStat) => convertDate(item.date))
})

const dataPerDaysCoins = computed<number[]>(() => {
  return statsPerDays.value?.data.statistics.map((item: DayStat) => item.coins)
})

const dataPerDaysRewards = computed<number[]>(() => {
  return statsPerDays.value?.data.statistics.map((item: DayStat) => item.rewards)
})

const dataPerDaysUsers = computed<number[]>(() => {
  return statsPerDays.value?.data.statistics.map((item: DayStat) => item.users)
})

const dataPerWeeksLabels = computed(() => {
  return statsPerWeeks.value?.data.statistics.map((item: WeekStat) => `${convertDate(item.date.first_week_day)}-${convertDate(item.date.last_week_day)}`)
})

const dayData = ref<ChartData<'bar'>>()

watchEffect(() => {
  dayData.value = {
    labels: toValue(dataPerDaysLabels),
    datasets: [
      {
        label: 'Монеты',
        backgroundColor: '#4285f4',
        data: toValue(dataPerDaysCoins)
      },
      {
        label: 'Бонусы',
        backgroundColor: '#00a453',
        data: toValue(dataPerDaysRewards)
      },
      {
        label: 'Пользователи',
        backgroundColor: '#da5707',
        data: toValue(dataPerDaysUsers)
      }
    ]
  }
})


const options = {
  
}

type viewMode = 'chart' | 'table' | 'all'
</script>

<template>
  <main class="main">
    <div>
    <h2>Статистика сообщества</h2>
    </div>
    <menu class="bonus-shop__tabs list-to-menu" style="margin-top: 25px; justify-content: space-between">
      <div style="display: flex;">
        <li 
          v-for="tab in tabs" :key="tab.tab"
          class="bonus-shop__tab"
          :class="{ active: currentTab === tab.tab }"
          @click="currentTab = tab.tab"
        >
          {{ tab.label }}
        </li>
      </div>
      <div style="display: flex; gap: 10px">
        <ChartBoxOutlineIcon fill-color="#67d2e9" />
        <TableIcon />
        <ViewGridOutlineIcon />
      </div>
    </menu>
    <Bar v-if="statsPerDaysIsSuccess" :data="dayData" :options="options">К сожалению, ваш браузер не поддерживает отрисову графиков.</Bar>
  </main>
</template>

<style scoped>

</style>