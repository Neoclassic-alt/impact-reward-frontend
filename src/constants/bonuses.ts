import type { typeTranslate } from '@/types/bonuses'

export const russianBonusTypes: typeTranslate = {
  link: 'Ссылка',
  promocode: 'Промокод',
  link_plural: 'Ссылки',
  promocode_plural: 'Промокоды',
}

export function getRussianBonusType(bonusType: string, plural: string = '') {
  if (!plural) {
    if (bonusType == 'promocode') {
      return 'Промокод'
    }
    if (bonusType == 'link') {
      return 'Ссылка'
    }
  }
  if (plural) {
    if (bonusType == 'promocode') {
      return 'Промокоды'
    }
    if (bonusType == 'link') {
      return 'Ссылки'
    }
  }
  return bonusType
}
