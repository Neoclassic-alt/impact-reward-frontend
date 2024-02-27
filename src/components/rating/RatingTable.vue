<script setup lang="ts">
import EasyDataTable, { type Header } from 'vue3-easy-data-table'
import type { AxiosResponse } from 'axios'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

defineProps<{
  headers: Header[],
  items: AxiosResponse['data'],
  searchValue: string
}>()
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
  >
    <template #[`item-profile.tg_username`]="item">
      <div class="account">
        <img v-if="item.profile.tg_avatar" :src="item.profile.tg_avatar" class="avatar" />
        <img v-else src="../../assets/icons/avatar-default.svg" class="avatar" />
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
}
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  white-space: nowrap;
  max-width: 145px;
}
</style>
