export type request = {
  account: string
  active_key: string
  api_key: string
}

export type response = {
  success: boolean
  issuer: {
    profile: {
      account: string // Импакт-аккаунт
      capital: number // если его разделить на 10000 и округлить вниз, получится количество прессов
    }
    coin: {
      name: string // имя монеты
      ticker: string // тикер монеты
    }
    community: {
      name: string // имя сообщества
      description: string // описание сообщества
      username: string // ссылка на группу сообщества (для сайта надо преобразовать в https://t.me/impact_test)
    }
    rewards: {
      reward_amount: number // размер награды
      current_possible_rewards: number // оставшееся количество наград
      max_possible_rewards: number // максимальное количество наград
      regeneration_value: number // темп пополнения
    }
  }
}
