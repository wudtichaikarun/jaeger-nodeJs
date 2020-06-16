// @flow
export function ensureConfigKey<T>(c: Object, key: string) {
  if (!c[key]) {
    throw new Error(`config ${key} is required`)
  }
}

export function ensureConfigKeys<T>(c: Object, ...keys: string[]) {
  for (const key of keys) {
    ensureConfigKey(c, key)
  }
}
