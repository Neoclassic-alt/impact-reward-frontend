import type { bonusGroup } from '@/types/bonuses'

export type response = {
  success?: boolean
  seller?: {
    bonus_groups: bonusGroup[]
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
  buyer?: {
    balance: {}
    profile: {
      account: string
      tg_about: string | null
      tg_avatar: string | null
      tg_nickname: string
      tg_username: string | null
    }
  }
}
