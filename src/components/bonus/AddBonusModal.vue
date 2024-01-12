<script setup lang="ts">
import { ref, toValue } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import axios from 'axios'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useMutation } from '@tanstack/vue-query'
import AlertBlock from '@/components/AlertBlock.vue'
import { useUserStore } from '@/stores'
import { getRussianBonusType } from '@/constants/bonuses'

const addBonusTextarea = ref<HTMLTextAreaElement | null>(null)

const schema = yup.object({
  bonuses: yup
    .string()
    .required()
    .test(
      'wordsCount',
      ({ value }) => `Допустимое число бонусов превышено на ${value.split(/\s+/).length - 20}`,
      (value) => value.split(/\s+/).length <= 20,
    ),
})

const props = defineProps<{
  closeModal: () => void
  bonusGroupName?: string
  nameVariableContent?: string
  bonusGroupId?: number
}>()

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    bonuses: '',
  },
})

const [bonuses, bonusesAttrs] = defineField('bonuses')

type request = {
  bonus_group_id: number | undefined
  variable_content: string
}

const onSubmit = handleSubmit(() => {
  mutate({
    bonus_group_id: props.bonusGroupId,
    variable_content: toValue(bonuses),
  })
})

const { fetchUserAndSave } = useUserStore()

const { mutate, isError, isIdle, isPending, isSuccess } = useMutation({
  mutationFn: (bonuses: request) => axios.put('/seller/add_bonuses', bonuses),
  onSuccess: () => {
    fetchUserAndSave()
    resetForm()
  },
})
</script>

<template>
  <div class="modal">
    <div v-on-click-outside="closeModal">
      <h2 class="bonus__title">Добавить бонусы к группе бонусов “{{ bonusGroupName }}”</h2>
      <AlertBlock type="success" style="width: calc(100% - 50px)" v-if="isSuccess"
        >Бонусы успешно добавлены</AlertBlock
      >
      <AlertBlock type="error" style="width: calc(100% - 50px)" v-if="isError"
        >Ошибка при добавлении бонусов. Попробуйте добавить заново</AlertBlock
      >
      <form style="width: 100%" autocomplete="off" @submit="onSubmit">
        <label class="label required"> {{ nameVariableContent && getRussianBonusType(nameVariableContent, 'plural') }} через пробел </label>
        <textarea
          class="textarea"
          :class="{ 'input-error': errors.bonuses }"
          spellcheck="false"
          rows="3"
          ref="addBonusTextarea"
          v-model.trim="bonuses"
          v-bind="bonusesAttrs"
        ></textarea>
        <span class="field-error" :class="{ 'error-show': errors.bonuses }"
          >{{ errors.bonuses }}&nbsp;</span
        ><span class="field-description" style="margin-bottom: 16px" v-show="!errors.bonuses"
          >До 20 слов</span
        >
        <div class="modal-button-group">
          <button
            href="#"
            class="button add-main-button"
            style="border-color: transparent; margin-right: 16px"
            :disabled="isPending"
          >
            <img
              src="./../../assets/icons/button-loading.svg"
              style="margin-right: 5px"
              v-show="isPending"
            />
            <span
              >{{ isIdle || isError ? 'Добавить' : '' }}{{ isPending ? 'Добавляем…' : ''
              }}{{ isSuccess ? 'Добавить ещё' : '' }}</span
            >
          </button>
          <a
            href="#"
            class="button"
            style="border-color: var(--brand-main-color)"
            @click.prevent="closeModal()"
            >{{ isIdle ? 'Отмена' : 'Закрыть' }}</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-main-button {
  background-color: var(--success-color);
  color: #ffffff;
  font-weight: 500;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.add-main-button:disabled {
  background-color: rgb(58, 214, 64, 0.5);
}
</style>
