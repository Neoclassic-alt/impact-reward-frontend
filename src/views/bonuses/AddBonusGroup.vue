<script setup lang="ts">
import { ref, computed } from 'vue'
import VueMultiselect from 'vue-multiselect'
import type { typeOfBonus } from '@/types/bonuses'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import l18n from '@/constants/validation'

const bonusType = ref<{ type: typeOfBonus; russianLabel: string }>({
  type: 'link',
  russianLabel: 'Ссылка',
})

const words = computed(() => (bonuses.value.length ? bonuses.value.split(' ').length : 0))

/* Validation */

yup.setLocale(l18n)

const schema = yup.object({
  title: yup.string().required().max(40),
  description: yup.string().required().max(100),
  instruction: yup.string().required().max(150),
  bonuses: yup
    .string()
    .required()
    .test(
      'wordsCount',
      ({ value }) => `Число бонусов превышено на ${value.split(' ').length - 20}`,
      (value) => value.split(' ').length <= 20,
    ),
})

const initialValues = {
  title: '',
  description: '',
  instruction: '',
  bonuses: '',
}

const { errors, defineField, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues,
})

const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [instruction, instructionAttrs] = defineField('instruction')
const [bonuses, bonusesAttrs] = defineField('bonuses')

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <main class="main">
    <h2 class="page-header">Добавить группу бонусов</h2>
    <a href="#" class="link flex-center" @click.prevent="$router.back()">
      <img src="./../../assets/icons/arrow-left.svg" style="margin-right: 8px" />
      <span>Назад к магазину бонусов</span>
    </a>
    <pre>{{ valid }}</pre>
    <form
      @submit="onSubmit"
      style="margin-top: var(--base-margin); margin-bottom: var(--base-margin); width: 450px"
      autocomplete="off"
    >
      <h3 class="form-fieldset-title">Что увидит покупатель до оплаты</h3>
      <p class="label" style="margin-bottom: 1em; font-size: 1em">
        Номинал: <b>{{ $route.params.cost }}</b>
      </p>
      <p class="complex-label">
        <label class="label required">Название</label>
        <span class="symbols-count">{{ title.length }}/40</span>
      </p>
      <input
        type="text"
        class="input"
        :class="{ 'input-error': errors.title }"
        autofocus
        v-model.trim="title"
        v-bind="titleAttrs"
      />
      <!-- Неразрывный пробел добавляется лишь, чтобы браузер не думал, что field-error - пустой элемент -->
      <span class="field-error" :class="{ 'error-show': errors.title }"
        >{{ errors.title }}&nbsp;</span
      >
      <p class="complex-label">
        <label class="label required">Описание</label>
        <span class="symbols-count">{{ description.length }}/100</span>
      </p>
      <textarea
        class="textarea"
        required
        rows="3"
        :class="{ 'input-error': errors.description }"
        v-model="description"
        v-bind="descriptionAttrs"
      ></textarea>
      <span class="field-error" :class="{ 'error-show': errors.description }"
        >{{ errors.description }}&nbsp;</span
      >
      <h3 class="form-fieldset-title">Что увидит покупатель после оплаты</h3>
      <p class="complex-label">
        <label class="label required">Инструкция</label>
        <span class="symbols-count">{{ instruction.length }}/150</span>
      </p>
      <textarea
        class="textarea"
        required
        rows="3"
        v-model.trim="instruction"
        v-bind="instructionAttrs"
        :class="{ 'input-error': errors.instruction }"
      ></textarea>
      <span class="field-error" :class="{ 'error-show': errors.instruction }"
        >{{ errors.instruction }}&nbsp;</span
      >
      <div class="flex-center" style="margin-bottom: 1em">
        <label class="label" style="margin-bottom: 2px">Тип</label>
        <VueMultiselect
          v-model.trim="bonusType"
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
        rows="5"
        spellcheck="false"
        v-model.trim="bonuses"
        v-bind="bonusesAttrs"
        :class="{ 'input-error': errors.bonuses }"
      ></textarea>
      <p class="field-description" style="margin-bottom: 16px" v-show="!errors?.bonuses">
        {{ words }}/20 слов
      </p>
      <span class="field-error" :class="{ 'error-show': errors.bonuses }">{{ errors.bonuses }}</span
      ><!-- Неразрывный пробел убран -->
      <button class="button main-button" :disabled="!meta.valid" @click.prevent>
        Создать группу бонусов
      </button>
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
