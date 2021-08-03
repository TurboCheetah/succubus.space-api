import type { SuccEnv, SuccEnvAny, SuccEnvBoolean, SuccEnvInteger, SuccEnvString } from '@interfaces/succenv.interface'

export const envParseInteger = (key: SuccEnvInteger): number => {
  const value = process.env[key]
  const integer = Number(value)

  if (Number.isInteger(integer)) return integer
  throw new Error(`[ENV] ${key} - The key must be an integer, but received '${value}'.`)
}

export const envParseBoolean = (key: SuccEnvBoolean): boolean => {
  const value = process.env[key]

  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`[ENV] ${key} - The key must be a boolean, but received '${value}'.`)
}

export function envParseString<K extends SuccEnvString>(key: K): SuccEnv[K] {
  const value = process.env[key]

  return value as SuccEnv[K]
}

export const envParseArray = (key: SuccEnvString): string[] => {
  const value = process.env[key]

  return value.split(' ')
}

export const envIsDefined = (...keys: readonly SuccEnvAny[]): boolean => {
  return keys.every(key => {
    const value = process.env[key]
    return value !== undefined && value.length !== 0
  })
}
