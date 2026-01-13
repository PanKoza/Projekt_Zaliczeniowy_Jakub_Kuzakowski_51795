import { useEffect, useState } from 'react'

export function useWeather(selected, API_KEY) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selected || !API_KEY) return
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError('')
      setWeather(null)
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selected)}&units=metric&lang=pl&appid=${API_KEY}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(res.status === 404 ? 'Nie znaleziono miasta' : `Błąd (${res.status})`)
        const data = await res.json()
        const w = data.weather?.[0]
        setWeather({
          name: data.name,
          country: data.sys?.country,
          temp: Math.round(data.main?.temp),
          feels: Math.round(data.main?.feels_like),
          humidity: data.main?.humidity,
          wind: Math.round((data.wind?.speed ?? 0) * 3.6),
          desc: w?.description || '',
          main: w?.main || '',
          icon: w?.icon || ''
        })
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Błąd pobierania')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [selected, API_KEY])

  return { weather, loading, error }
}
