import './assets/main.css'
import axios from 'axios'
import * as yup from 'yup'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import i18n from '@/constants/validation'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

const BASE_API_URL = 'https://api.impact-reward.com/api'

axios.interceptors.request.use((config) => {
  if (config.url !== '/login') {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('account')}`
  } else {
    config.headers['Api-Key'] = '85506a63-c670-443c-9148-b6ad6f990fdf'
  }

  config.url = BASE_API_URL + config.url

  return config
})

yup.setLocale(i18n)

app.mount('#app')
