export type bonusCost = 20 | 50 | 100 | 200 | 500
export type bonusCosts = Set<bonusCost>

export type typeOfBonus = 'promocode' | 'link'

export type typeTranslate = {
  readonly [index in `${typeOfBonus}${'' | '_plural'}`]: string
}
export interface bonus {
  id: string | number
  cost: bonusCost
  title: string
  description: string
  instruction: string
  type: typeOfBonus
}
