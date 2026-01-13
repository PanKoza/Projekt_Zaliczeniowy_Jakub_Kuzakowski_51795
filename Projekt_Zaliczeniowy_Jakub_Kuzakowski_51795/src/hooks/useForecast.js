import { useEffect, useState } from 'react'

export function useForecast(selected, API_KEY) {
  const [forecast, setForecast] = useState([])
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastError, setForecastError] = useState('')

  useEffect(() => {
    if (!selected || !API_KEY) return
    const controller = new AbortController()

    async function loadForecast() {
      setForecastLoading(true)
      setForecastError('')
      setForecast([])
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(selected)}&units=metric&lang=pl&appid=${API_KEY}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Brak prognozy dla miasta' : `Błąd prognozy (${res.status})`)
        }
        const data = await res.json()
        const list = Array.isArray(data.list) ? data.list : []
        const today = new Date().toISOString().slice(0,10)

        const map = new Map()
        for (const item of list) {
          const dtTxt = item.dt_txt 
            || (item.dt ? new Date(item.dt * 1000).toISOString().replace('T',' ').slice(0,19) : '')
          const date = dtTxt.slice(0,10)
          if (date === today) continue
          if (!map.has(date)) map.set(date, { date, entries: [] })
          map.get(date).entries.push(item)
        }

        const dayNames = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota']
        const daily = []
        for (const [date, obj] of map.entries()) {
          const temps = obj.entries.map(e => e.main?.temp).filter(t => typeof t === 'number')
          const min = Math.round(Math.min(...temps))
          const max = Math.round(Math.max(...temps))
          let rep = obj.entries.find(e => e.dt_txt?.includes('12:00:00'))
          if (!rep) rep = obj.entries[Math.floor(obj.entries.length/2)]
          const w = rep?.weather?.[0] || {}
          const dObj = new Date(rep?.dt * 1000)
          const dow = dayNames[dObj.getDay()]
          daily.push({
            date,
            dow,
            min,
            max,
            desc: w.description || '',
            main: w.main || '',
            icon: w.icon || ''
          })
        }

        setForecast(daily.slice(0,5))
      } catch (err) {
        if (err.name !== 'AbortError') setForecastError(err.message || 'Błąd pobierania prognozy')
      } finally {
        setForecastLoading(false)
      }
    }

    loadForecast()
    return () => controller.abort()
  }, [selected, API_KEY])

  return { forecast, forecastLoading, forecastError }
}
