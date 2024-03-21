export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function minimalizeFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function plural(number: number, one: string, two: string, five: string): string {
  let n = Math.abs(number)
  n %= 100
  if (n >= 5 && n <= 20) {
    return five
  }
  n %= 10
  if (n === 1) {
    return one
  }
  if (n >= 2 && n <= 4) {
    return two
  }
  return five
}

// Date in format "2024-01-04"
const format = /(\d{4}).(\d{2}).(\d{2})/

export function convertDate(date: string): string {
  return date.replace(format, '$3.$2')
}

export function standartDate(date: Date, showYear: boolean = true): string {
  let day = date.getDate().toString()
  if (day.length == 1) {
    day = '0' + day
  }
  let month = (date.getMonth() + 1).toString()
  if (month.length == 1) {
    month = '0' + month
  }
  if (showYear) {
    return `${day}.${month}.${date.getFullYear()}`
  } else {
    return `${day}.${month}`
  }
}

export const compareDates = (d1: string | Date, d2: string | Date) => {
  const date1 = new Date(d1).setUTCHours(0, 0, 0, 0)
  const date2 = new Date(d2).setUTCHours(0, 0, 0, 0)

  if (date1 < date2) {
    return '<'
  } else if (date1 > date2) {
    return '>'
  } else {
    return '=='
  }
}

export const getEntries: (o: any, prefix?: string) => Array<[string, any]> = (o, prefix = '') =>
  Object.entries(o).flatMap(([k, v]) =>
    Object(v) === v ? getEntries(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  )
