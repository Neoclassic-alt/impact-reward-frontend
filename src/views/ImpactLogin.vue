<script setup lang="ts">
import { watch, reactive } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import l18n from '@/constants/validation'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/stores/auth-common'

yup.setLocale(l18n)

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
  api_key: '85506a63-c670-443c-9148-b6ad6f990fdf',
})

const router = useRouter()
const { setCommonInfo, setAccountData, fetchLogin } = useCommonStore()

watch(status, (newStatus) => {
  if (newStatus == 'success' && data.value?.data.success) {
    setCommonInfo(data.value?.data)
    setAccountData(accountData)
    router.push('/')
  }
})
</script>

<template>
  <main style="margin: 0 auto; width: fit-content">
    <h2 class="page-header">Вход в систему</h2>
    <div class="alert-error" v-if="$route.query.message == 'non-auth'">
      <h3 style="margin-bottom: 5px">Ошибка доступа</h3>
      <p>Необходима авторизация</p>
    </div>
    <div class="alert-error" v-if="status == 'error'">
      <h3 style="margin-bottom: 5px">Произошла ошибка авторизации</h3>
      <p>Проверьте авторизационные данные</p>
    </div>
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
