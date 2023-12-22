import axios from 'axios'
import { API_LOGIN } from './../constants/endpoints'

export async function fetchLogin(account: string, active_key: string) {
  const response = await axios.post(API_LOGIN, {
    account, active_key,
    api_key: '85506a63-c670-443c-9148-b6ad6f990fdf',
  })
  return response
}