<script setup lang="ts">
import { ref, toValue } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import axios from 'axios';
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useMutation } from '@tanstack/vue-query'

const addBonusTextarea = ref<HTMLTextAreaElement | null>(null)

const schema = yup.object({
  bonuses: yup
    .string()
    .required()
    .test(
      'wordsCount',
      ({ value }) => `Допустимое число бонусов превышено на ${value.split(' ').length - 20}`,
      (value) => value.split(' ').length <= 20,
    ),
})

const props = defineProps<{
  closeModal: () => void,
  bonusGroupName?: string,
  nameVariableContent?: string,
  bonusGroupId?: number
}>()

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    bonuses: ''
  },
})

const [bonuses, bonusesAttrs] = defineField('bonuses')

type request = {
  bonus_group_id: number | undefined,
  variable_content: string
}

const onSubmit = handleSubmit(() => {
  mutate({
    bonus_group_id: props.bonusGroupId,
    variable_content: toValue(bonuses)
  })
})

const { status, error, mutate } = useMutation({
  mutationFn: (bonuses: request) => axios.put('/seller/add_bonuses', bonuses),
})
</script>

<template>
  <div class="modal">
    <div v-on-click-outside="closeModal">
      <p class="bonus__title">Добавить бонусы к группе бонусов “{{ bonusGroupName }}”</p>
      <form style="width: 100%" autocomplete="off" @submit="onSubmit">
        <label class="label required">
          {{ nameVariableContent }} через пробел
        </label>
        <textarea
          class="textarea"
          :class="{ 'input-error': errors.bonuses }"
          required
          spellcheck="false"
          rows="3"
          ref="addBonusTextarea"
          v-model.trim="bonuses"
          v-bind="bonusesAttrs"
        ></textarea>
        <span class="field-error" :class="{ 'error-show': errors.bonuses }"
          >{{ errors.bonuses }}&nbsp;</span
        ><span class="field-description" style="margin-bottom: 16px" v-show="!errors.bonuses">До 20 слов</span>
        <div class="modal-button-group">
          <button
            href="#"
            class="button add-main-button"
            style="border-color: transparent; margin-right: 16px"
            :disabled="status === 'pending'"
            >
            <img
              src="./../../assets/icons/button-loading.svg"
              style="margin-right: 5px"
              v-show="status === 'pending'"
            />
            <span>Добавить</span>
          </button>
          <a
            href="#"
            class="button"
            style="border-color: var(--brand-main-color)"
            @click.prevent="closeModal()"
            >Отмена</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>