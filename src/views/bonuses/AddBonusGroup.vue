<script setup lang="ts">
import { computed, ref } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useMutation } from '@tanstack/vue-query'
import AlertBlock from '@/components/common/AlertBlock.vue'
import type { typeOfBonus } from '@/types/bonuses'
import type { request as bonusesRequest } from '@/types/api/bonuses'

const { bonusAllCosts, fetchUserAndSave } = useUserStore()
const route = useRoute()
const router = useRouter()

const bonusType = ref<{ type: typeOfBonus; russianLabel: string }>({
  type: 'link',
  russianLabel: 'Ссылка',
})

const words = computed(() => (bonuses.value.length ? bonuses.value.split(/\s+/).length : 0))
const price = computed(
  () => bonusAllCosts.find((item) => item.group_name == route.params.group_name)?.price,
)

/* Validation */

const schema = yup.object({
  title: yup.string().required().max(40),
  description: yup.string().required().max(100),
  instruction: yup.string().required().max(150),
  bonuses: yup
    .string()
    .required()
    .test(
      'wordsCount',
      ({ value }) => `Допустимое число бонусов превышено на ${value.split(/\s+/).length - 20}`,
      (value) => value.split(' ').length <= 20,
    ),
})

const initialValues = {
  title: '',
  description: '',
  instruction: '',
  bonuses: '',
}

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues,
})

const [title, titleAttrs] = defineField('title')
const [description, descriptionAttrs] = defineField('description')
const [instruction, instructionAttrs] = defineField('instruction')
const [bonuses, bonusesAttrs] = defineField('bonuses')

function getRequest(v: typeof initialValues): bonusesRequest {
  return {
    type: route.params.group_name[0],
    level: +route.params.group_name[1],
    name: v.title,
    caption: v.description,
    permanent_content: v.instruction,
    name_variable_content: bonusType.value.type,
    variable_content: v.bonuses,
  }
}

const { mutate, isError, isPending, isSuccess } = useMutation({
  mutationFn: (v: typeof initialValues) => axios.post('/seller/create_bonus_group', getRequest(v)),
  onSuccess: () => {
    router.push({
      name: 'BonusShop',
      query: {
        message: 'bonus-group-added',
      },
    })
    fetchUserAndSave()
  },
})

const onSubmit = handleSubmit((values) => {
  mutate(values)
})
</script>

<template>
  <main class="main">
    <div class="add-bonus-form">
      <h2 class="page-header">Добавить группу бонусов</h2>
      <a
        href="#"
        class="link flex-center"
        @click.prevent="$router.back()"
        style="margin-bottom: var(--base-margin)"
      >
        <img src="./../../assets/icons/arrow-left.svg" style="margin-right: 8px" />
        <span>Назад к магазину бонусов</span>
      </a>
      <form @submit="onSubmit" autocomplete="off">
        <h3 class="form-fieldset-title">Что увидит покупатель до оплаты</h3>
        <p class="label" style="margin-bottom: 1em; font-size: 1em">
          Номинал: <b>{{ price }}</b>
        </p>
        <p class="complex-label">
          <label class="label">Название</label>
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
          <label class="label">Описание</label>
          <span class="symbols-count">{{ description.length }}/100</span>
        </p>
        <textarea
          class="textarea"
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
          <label class="label">Инструкция</label>
          <span class="symbols-count">{{ instruction.length }}/150</span>
        </p>
        <textarea
          class="textarea"
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
              { type: 'link', russianLabel: 'Ссылка' },
              { type: 'promocode', russianLabel: 'Промокод' },
            ]"
            :searchable="false"
            :allow-empty="false"
            :showLabels="false"
            label="russianLabel"
            track-by="type"
            placeholder="Выберите значение"
            style="width: 150px"
            class="multiselect-custom multiselect-only-one"
          />
        </div>
        <label class="label">
          {{ bonusType.type == 'link' ? 'Ссылки' : '' }}
          {{ bonusType.type == 'promocode' ? 'Промокоды' : '' }} через пробел
        </label>
        <textarea
          class="textarea"
          rows="5"
          spellcheck="false"
          v-model.trim="bonuses"
          v-bind="bonusesAttrs"
          :class="{ 'input-error': errors.bonuses }"
        ></textarea>
        <p class="field-description" v-show="!errors?.bonuses">{{ words }}/20 слов</p>
        <span class="field-error" :class="{ 'error-show': errors.bonuses }">{{
          errors.bonuses
        }}</span
        ><!-- Неразрывный пробел убран -->
        <AlertBlock type="error" style="width: 450px; box-sizing: border-box" v-if="isError"
          >Ошибка при добавлении группы бонусов. Попробуйте добавить заново</AlertBlock
        >
        <button class="button main-button" :disabled="isPending || isSuccess">
          <img
            src="./../../assets/icons/button-loading.svg"
            style="margin-right: 5px"
            v-show="isPending"
          />
          <span>{{ isPending ? 'Добавляем…' : 'Добавить группу бонусов' }}</span>
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.add-bonus-form {
  max-width: 450px;
  z-index: 3;
}
.form-fieldset-title {
  margin-block-end: 1.3em;
  font-size: 1.1em;
  font-weight: 500;
}
</style>
