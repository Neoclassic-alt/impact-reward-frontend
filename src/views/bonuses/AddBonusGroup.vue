<script setup lang="ts">
import { useBonusAvailableStore } from '@/stores/bonuses'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import VueMultiselect from 'vue-multiselect'

const bonusAvailableStore = useBonusAvailableStore()
const { bonusAvaliableCosts } = storeToRefs(bonusAvailableStore)

const route = useRoute()

const cost = ref(route.params.cost ?? 'Не выбрано')
</script>

<template>
  <main class="main">
    <h2 class="page-header">Добавить группу бонусов</h2>
    <a href="#" class="link flex-center" @click.prevent="$router.back()">
      <img src="./../../assets/icons/arrow-left.svg" style="margin-right: 12px" />
      <span>Назад к магазину бонусов</span>
    </a>
    <form style="margin-top: var(--base-margin); width: 450px">
      <p class="form-fieldset-title">Что увидит покупатель до оплаты</p>
      <div class="flex-center">
        <label class="label"
          >Номинал бонуса
          <span style="color: var(--danger-color); margin-right: 16px">*</span></label
        >
        <VueMultiselect
          v-model="cost"
          :options="['Не выбрано', ...bonusAvaliableCosts]"
          :searchable="false"
          :allow-empty="false"
          :showLabels="false"
          placeholder="Выберите значение"
          style="width: 200px"
        />
      </div>
      <label class="label">Название <span style="color: var(--danger-color)">*</span></label>
      <input class="input" style="margin-bottom: 16px" />
      <label class="label">Описание <span style="color: var(--danger-color)">*</span></label>
      <textarea class="textarea" required rows="3"></textarea>
    </form>
  </main>
</template>

<style scoped>
.form-fieldset-title {
  margin-block-end: 1em;
}
</style>
