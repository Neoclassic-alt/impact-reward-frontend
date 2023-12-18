<script setup lang="ts">
// import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import l18n from '@/constants/validation'

yup.setLocale(l18n)

const schema = yup.object({
  account: yup.string().required(),
  key: yup.string().required()
})

const initialValues = {
  account: '',
  key: '',
}

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues,
})

const [account, accountAttrs] = defineField('account')
const [key, keyAttrs] = defineField('key')

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values, null, 2))
})
</script>

<template>
  <main style="margin: 0 auto; width: fit-content">
    <h2 class="page-header">Вход в систему</h2>
    <form 
      style="width: 450px"
      @submit="onSubmit"
    >
      <label class="label">Импакт-аккаунт</label>
      <input
        type="text"
        class="input"
        :class="{ 'input-error': errors.account }"
        autofocus
        v-model.trim="account"
        v-bind="accountAttrs"
      />
      <span class="field-error" :class="{ 'error-show': errors.account }"
        >{{ errors.account }}&nbsp;</span
      >
      <label class="label">Ключ активов</label>
      <input
        type="password"
        class="input"
        :class="{ 'input-error': errors.key }"
        autofocus
        v-model="key"
        v-bind="keyAttrs"
      />
      <span class="field-error" :class="{ 'error-show': errors.key }"
        >{{ errors.key }}&nbsp;</span
      >
      <button class="button main-button">
        Войти
      </button>
    </form>
  </main>
</template>

<style scoped>

</style>