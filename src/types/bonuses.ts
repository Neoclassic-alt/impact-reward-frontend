//export type bonusCost = 20 | 50 | 100 | 200 | 500
//export type bonusCosts = Set<bonusCost>

export type typeOfBonus = 'promocode' | 'link'

export type typeTranslate = {
  readonly [index in `${typeOfBonus}${'' | '_plural'}`]: string
} // ??

/*export interface bonus {
  id: number
  cost: number
  title: string
  description: string
  instruction: string
  type: typeOfBonus
}*/

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
