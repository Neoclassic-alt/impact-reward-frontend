<script setup lang="ts">
import { useBonusAvailableStore } from '@/stores/bonuses'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import VueMultiselect from 'vue-multiselect'
import type { typeOfBonus } from '@/types/bonuses'

const bonusAvailableStore = useBonusAvailableStore()
const { bonusAvaliableCosts } = storeToRefs(bonusAvailableStore)

const route = useRoute()

const cost = ref(+route.params.cost ?? 'Не выбрано')
const bonusType = ref<{type: typeOfBonus, russianLabel: string}>({type: 'link', russianLabel: 'Ссылка'})
</script>

<template>
  <main class="main">
    <h2 class="page-header">Добавить группу бонусов</h2>
    <a href="#" class="link flex-center" @click.prevent="$router.back()">
      <img src="./../../assets/icons/arrow-left.svg" style="margin-right: 12px;" />
      <span>Назад к магазину бонусов</span>
    </a>
    <form style="margin-top: var(--base-margin); margin-bottom: var(--base-margin); width: 450px">
      <h3 class="form-fieldset-title">Что увидит покупатель до оплаты</h3>
      <div class="flex-center" style="margin-bottom: 1em;">
        <label class="label required" style="margin: 0">Номинал</label>
        <VueMultiselect
          v-model="cost"
          :options="['Не выбрано', ...bonusAvaliableCosts]"
          :searchable="false"
          :allow-empty="false"
          :showLabels="false"
          placeholder="Выберите значение"
          style="width: 150px; margin-right: 25px"
          class="multiselect-custom"
        />
        <label class="label" style="margin: 0">Тип</label>
        <VueMultiselect
          v-model="bonusType"
          :options="[
            {type: 'promocode', russianLabel: 'Промокод'},
            {type: 'link', russianLabel: 'Ссылка'}
          ]"
          :searchable="false"
          :allow-empty="false"
          :showLabels="false"
          label="russianLabel"
          track-by="type"
          placeholder="Выберите значение"
          style="width: 150px"
          class="multiselect-custom"
        />
      </div>
      <p class="complex-label">
        <label class="label required">Название</label>
        <span class="symbols-count">0/40</span>
      </p>
      <input class="input" style="margin-bottom: 16px" />
      <p class="complex-label">
        <label class="label required">Описание</label>
        <span class="symbols-count">0/100</span>
      </p>
      <textarea class="textarea" required rows="3" style="margin-bottom: 25px"></textarea>
      <h3 class="form-fieldset-title">Что увидит покупатель после оплаты</h3>
      <p class="complex-label">
        <label class="label required">Инструкция</label>
        <span class="symbols-count">0/150</span>
      </p>
      <textarea class="textarea" required rows="3" style="margin-bottom: 25px"></textarea>
      <label class="label required">
        {{ bonusType.type == 'link' ? 'Ссылки' : '' }}
        {{ bonusType.type == 'promocode' ? 'Промокоды' : '' }} через пробел
      </label>
      <textarea class="textarea" required rows="3"></textarea>
      <p class="field-description" style="margin-bottom: 16px">До 20 слов</p>
      <a
        href="#"
        class="button main-button"
        @click.prevent
        >Создать группу бонусов</a
      >
    </form>
  </main>
</template>

<style scoped>
.form-fieldset-title {
  margin-block-end: 1.3em;
  font-size: 1.1em;
  font-weight: 500;
}
</style>
