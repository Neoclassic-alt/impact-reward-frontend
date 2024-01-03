<script setup lang="ts">
import { watch, reactive } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertBlock from '@/components/AlertBlock.vue'

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

const { status, fetchStatus, data, refetch } = useQuery({
  queryKey: ['login'],
  queryFn: () => fetchLogin(accountData),
  enabled: false,
})

const onSubmit = handleSubmit(() => {
  refetch()
})

const accountData = reactive({
  account,
  active_key: key,
})

const router = useRouter()
const { setAccountData, fetchLogin } = useAuthStore()

watch(status, (newStatus) => {
  if (newStatus == 'success' && data.value?.data.access_token) {
    setAccountData(data.value.data.access_token)
    router.push('/')
  }
})
</script>

<template>
  <main style="margin: 0 auto; width: fit-content">
    <h2 class="page-header">Вход в систему</h2>
    <AlertBlock v-if="$route.query.message == 'non-auth'">
      <template #title>Ошибка доступа</template>
      <template #text>Необходима авторизация</template>
    </AlertBlock>
    <AlertBlock v-if="status == 'error'">
      <template #title>Произошла ошибка авторизации</template>
      <template #text>Проверьте авторизационные данные</template>
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
      <button class="button main-button" :disabled="fetchStatus == 'fetching'">
        <img
          src="./../assets/icons/button-loading.svg"
          style="margin-right: 5px"
          v-show="fetchStatus === 'fetching'"
        />
        <span>{{ fetchStatus === 'fetching' ? 'Авторизация' : 'Войти' }}</span>
      </button>
    </form>
  </main>
</template>

<style scoped></style>
