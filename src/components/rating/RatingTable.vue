<script setup lang="ts">
import { computed, ref } from 'vue'
import EasyDataTable, { type Header, type FilterOption } from 'vue3-easy-data-table'
import type { AxiosResponse } from 'axios'
import { useWindowSize } from '@vueuse/core'
import avatarDefault from '@/assets/icons/avatar-default.svg?url'
import FilterMenuOutlineIcon from '@/assets/icons/filter-16.png?url'
import FilterMenuOutlineAcivatedIcon from '@/assets/icons/filter-16-activated.png?url'
import { vOnClickOutside } from '@vueuse/components'

const { width } = useWindowSize()

defineProps<{
  headers: Header[]
  items: AxiosResponse['data']
  searchValue: string
}>()

enum UserBotStates {
  all,
  botOn,
  botOff,
}
type BotItemCriteria = { state: UserBotStates; label: string }

const botItemsCriteria: BotItemCriteria[] = [
  { state: UserBotStates.botOn, label: 'Да' },
  { state: UserBotStates.botOff, label: 'Нет' },
  { state: UserBotStates.all, label: 'Не важно' },
]
const userBotFilter = ref<BotItemCriteria>(botItemsCriteria[2])
const showBotFilter = ref(false)

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = []
  if (userBotFilter.value.state === UserBotStates.botOff) {
    filterOptionsArray.push({
      field: 'profile.wallet_bot_status',
      comparison: '=',
      criteria: 0,
    })
  }
  if (userBotFilter.value.state === UserBotStates.botOn) {
    filterOptionsArray.push({
      field: 'profile.wallet_bot_status',
      comparison: '=',
      criteria: 1,
    })
  }

  return filterOptionsArray
})
</script>

<template>
  <EasyDataTable
    :headers="headers"
    :items="items?.data.rating || []"
    header-text-direction="center"
    body-text-direction="center"
    border-cell
    fixed-header
    :rows-items="[15, 20, 50, 100, 250]"
    theme-color="#67d2e9"
    :rows-per-page="10"
    rows-of-page-separator-message="из"
    rows-per-page-message="Записей на странице:"
    empty-message="Участники не найдены"
    :loading="!items?.data.rating"
    :buttons-pagination="width >= 570"
    show-index
    show-index-symbol="№"
    :index-column-width="40"
    sort-by="coins.received_coins_per_last_30_days"
    sort-type="desc"
    :table-min-height="100"
    :prevent-context-menu-row="false"
    search-field="profile.tg_search"
    :search-value="searchValue"
    :filter-options="filterOptions"
  >
    <template #[`item-profile.tg_username`]="item">
      <div class="account" :class="{ 'green-over-ball': item.profile.wallet_bot_status }">
        <img :src="item.profile.tg_avatar ?? avatarDefault" class="avatar" />
        <span v-if="item.profile.tg_username">
          <a
            :href="`https://t.me/${item.profile.tg_username}`"
            class="link"
            target="_blank"
            rel="noopener"
            >{{ item.profile.tg_username }}</a
          >
        </span>
        <span v-else>
          {{ item.profile.tg_nickname }}
        </span>
      </div>
    </template>
    <template #[`item-profile.impact-account`]="item">
      {{ item.profile['impact-account'].split('.')[0] }}
    </template>
    <template #[`header-profile.tg_username`]="header">
      <img
        :src="
          userBotFilter.state === UserBotStates.all
            ? FilterMenuOutlineIcon
            : FilterMenuOutlineAcivatedIcon
        "
        @click.stop="
          () => {
            showBotFilter = true
          }
        "
        class="filter-icon"
      />{{ header.text }}
      <ul
        class="filter-menu"
        v-show="showBotFilter"
        v-on-click-outside="() => (showBotFilter = false)"
      >
        <p style="margin-bottom: 0.5em"><b>Включили бота</b></p>
        <ul class="list-to-menu button-group" @click.stop="() => (showBotFilter = false)">
          <li
            class="button-group__item"
            v-for="(criteria, index) in botItemsCriteria"
            :key="criteria.state"
            @click="userBotFilter = botItemsCriteria[index]"
            :class="{ 'button-group__item_active': criteria.state === userBotFilter.state }"
          >
            {{ criteria.label }}
          </li>
        </ul>
      </ul>
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
</template>

<style scoped>
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 25%;
  background-color: aliceblue;
  user-select: none;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.07);
}
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  white-space: nowrap;
  max-width: 145px;
}

.account.green-over-ball {
  padding-top: 7px;
}

.account.green-over-ball::before {
  content: '';
  min-width: 7px;
  height: 7px;
  border-radius: 10px;
  background-color: #00a452;
  border: 2px solid #ffffff;
  position: absolute;
  left: 36px;
  bottom: 30px;
}

.filter-icon {
  margin-right: 7px;
}

.filter-menu {
  position: absolute;
  top: 35px;
  left: -10px;
  padding: 10px 12px;
  background-color: white;
  font-weight: 400;
  border: 1px solid #cacaca;
  border-radius: 4px;
  text-align: left;
  box-shadow: 0 7px 20px 0px rgba(0, 0, 0, 0.1);
}

.button-group {
  border: 1px solid #cacaca;
}

.button-group__item {
  padding: 5px 10px;
}

.button-group__item:not(.button-group__item_active):hover {
  background-color: #eeeeee;
}

.button-group__item_active {
  background-color: var(--brand-main-color);
  color: white;
}
</style>
