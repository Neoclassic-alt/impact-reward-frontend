export type request = {
  account: string
  active_key: string
}

export type response = {
  access_token: string
}

export type error = {
  success: boolean
  message: string
}
