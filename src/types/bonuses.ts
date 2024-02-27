export type typeOfBonus = 'promocode' | 'link'

export type typeTranslate = {
  readonly [index in `${typeOfBonus}${'' | '_plural'}`]: string
} // ??

export interface bonusGroup {
  available_bonuses: number
  caption: string
  group_name: string
  id: number
  issuer: string
  name: string
  name_variable_content: string
  permanent_content: string
  price: string
}

export interface bonusPrice {
  group_name: string
  price: number
}
