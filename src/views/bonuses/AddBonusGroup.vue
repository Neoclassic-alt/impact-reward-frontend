<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import VueMultiselect from 'vue-multiselect'
import type { typeOfBonus } from '@/types/bonuses'

const bonusType = ref<{ type: typeOfBonus; russianLabel: string }>({
  type: 'link',
  russianLabel: 'Ссылка',
})

const form = reactive({
  title: '',
  description: '',
  instruction: '',
  bonuses: '',
})

const words = computed(() => (form.bonuses.length ? form.bonuses.split(' ').length : 0))
</script>

<template>
  <main class="main">
    <h2 class="page-header">Добавить группу бонусов</h2>
    <a href="#" class="link flex-center" @click.prevent="$router.back()">
      <img src="./../../assets/icons/arrow-left.svg" style="margin-right: 8px" />
      <span>Назад к магазину бонусов</span>
    </a>
    <form
      style="margin-top: var(--base-margin); margin-bottom: var(--base-margin); width: 450px"
      autocomplete="off"
    >
      <h3 class="form-fieldset-title">Что увидит покупатель до оплаты</h3>
      <p class="label" style="margin-bottom: 1em; font-size: 1em">
        Номинал: <b>{{ $route.params.cost }}</b>
      </p>
      <p class="complex-label">
        <label class="label required">Название</label>
        <span class="symbols-count">{{ form.title.length }}/40</span>
      </p>
      <input class="input" style="margin-bottom: 16px" autofocus v-model="form.title" />
      <p class="complex-label">
        <label class="label required">Описание</label>
        <span class="symbols-count">{{ form.description.length }}/100</span>
      </p>
      <textarea
        class="textarea"
        required
        rows="3"
        style="margin-bottom: 25px"
        v-model="form.description"
      ></textarea>
      <h3 class="form-fieldset-title">Что увидит покупатель после оплаты</h3>
      <p class="complex-label">
        <label class="label required">Инструкция</label>
        <span class="symbols-count">{{ form.instruction.length }}/150</span>
      </p>
      <textarea
        class="textarea"
        required
        rows="3"
        style="margin-bottom: 25px"
        v-model="form.instruction"
      ></textarea>
      <div class="flex-center" style="margin-bottom: 1em">
        <label class="label" style="margin-bottom: 2px">Тип</label>
        <VueMultiselect
          v-model="bonusType"
          :options="[
            { type: 'promocode', russianLabel: 'Промокод' },
            { type: 'link', russianLabel: 'Ссылка' },
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
      <label class="label required">
        {{ bonusType.type == 'link' ? 'Ссылки' : '' }}
        {{ bonusType.type == 'promocode' ? 'Промокоды' : '' }} через пробел
      </label>
      <textarea
        class="textarea"
        required
        rows="3"
        spellcheck="false"
        v-model="form.bonuses"
      ></textarea>
      <p class="field-description" style="margin-bottom: 16px">{{ words }}/20 слов</p>
      <a href="#" class="button main-button" @click.prevent>Создать группу бонусов</a>
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
