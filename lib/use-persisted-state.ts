'use client'

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react'

/**
 * useState yang otomatis sync ke localStorage.
 * SSR-safe: pakai seed dulu, lalu hydrate dari localStorage di useEffect.
 */
export function usePersistedState<T>(
  key: string,
  seed: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(seed)
  const [hydrated, setHydrated] = useState(false)

  // hydrate dari localStorage sekali saat mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) setValue(JSON.parse(raw))
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [key])

  // persist setiap kali value berubah (setelah hydrate)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota errors
    }
  }, [key, value, hydrated])

  return [value, setValue]
}
