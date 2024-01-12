<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertBlock from '@/components/AlertBlock.vue'
import type { AxiosError } from 'axios'
import type { error as loginError } from '@/types/api/login'

const schema = yup.object({
  account: yup.string().required(),
  key: yup.string().required(),
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

const errorMessage = ref('')

const { mutate, data, isPending, isError } = useMutation({
  mutationFn: () => fetchLogin(accountData),
  onSuccess: () => {
    if (data.value?.data.access_token) {
      setAccountData(data.value.data.access_token)
      router.push('/')
    }
  },
  onError: (error) => {
    errorMessage.value = ((error as AxiosError).response?.data as loginError).message
  }
})

const onSubmit = handleSubmit(() => {
  mutate()
})

const accountData = reactive({
  account,
  active_key: key,
})

const router = useRouter()
const { setAccountData, fetchLogin } = useAuthStore()
</script>

<template>
  <main style="margin: 0 auto; width: fit-content">
    <h2 class="page-header">Вход в систему</h2>
    <AlertBlock type="error" v-if="$route.query.message == 'non-auth'">
      <template #title>Ошибка доступа</template>
      <template #text>Необходима авторизация</template>
    </AlertBlock>
    <AlertBlock type="error" v-if="isError">
      <template #title>Произошла ошибка авторизации</template>
      <template #text>Причина: {{ errorMessage }}</template>
    </AlertBlock>
    <form style="width: 450px" @submit="onSubmit">
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
      <span class="field-error" :class="{ 'error-show': errors.key }">{{ errors.key }}&nbsp;</span>
      <button class="button main-button" :disabled="isPending">
        <img
          src="./../assets/icons/button-loading.svg"
          style="margin-right: 5px"
          v-show="isPending"
        />
        <span>{{ isPending ? 'Авторизация' : 'Войти' }}</span>
      </button>
    </form>
  </main>
</template>

<style scoped></style>
