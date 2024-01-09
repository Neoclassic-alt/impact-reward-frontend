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
