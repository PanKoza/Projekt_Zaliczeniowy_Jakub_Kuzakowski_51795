import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUnit } from './features/unitsSlice'
import { toggleFavorite } from './features/favoritesSlice'
import './App.css'

function WeatherIcon({ condition, size = 48 }) {
  const c = (condition || '').toLowerCase()
  const isSunny = c.includes('słone') || c.includes('clear') || c.includes('sun')
  const isPartly = c.includes('częściowo') || c.includes('part') || c.includes('few') || c.includes('scattered')
  const isRain = c.includes('deszcz') || c.includes('rain') || c.includes('drizzle')
  const isCloud = c.includes('pochm') || c.includes('cloud') || c.includes('overcast')

  if (isSunny && !isPartly) {
    return (
      <svg className="wx-icon wx-sun" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <radialGradient id="gSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7b1"/><stop offset="60%" stopColor="#ffd86b"/><stop offset="100%" stopColor="#ff9f3e"/>
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="14" fill="url(#gSun)"/>
        <g className="rays" stroke="#ffc86a" strokeWidth="3" strokeLinecap="round">
          <path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l6 6M44 44l6 6M50 14l-6 6M14 50l6-6"/>
        </g>
      </svg>
    )
  }

  if (isPartly) {
    return (
      <svg className="wx-icon wx-partly" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloud" x1="0" x2="1">
            <stop offset="0%" stopColor="#d8e2ff"/><stop offset="100%" stopColor="#b7c7ff"/>
          </linearGradient>
          <radialGradient id="gSunSm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7b1"/><stop offset="100%" stopColor="#ffb25a"/>
          </radialGradient>
        </defs>
        <g transform="translate(4 6)">
          <circle cx="22" cy="18" r="8" fill="url(#gSunSm)"/>
          <g className="rays" stroke="#ffc86a" strokeWidth="2" strokeLinecap="round">
            <path d="M22 6v4M22 26v4M10 18h4M30 18h4M14 10l3 3M30 26l3 3M33 10l-3 3M14 26l3-3"/>
          </g>
          <path d="M18 40h22a8 8 0 0 0 0-16 12 12 0 0 0-23-3 8 8 0 0 0 1 19z" fill="url(#gCloud)"/>
        </g>
      </svg>
    )
  }

  if (isRain) {
    return (
      <svg className="wx-icon wx-rain" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloud2" x1="0" x2="1">
            <stop offset="0%" stopColor="#d4defa"/><stop offset="100%" stopColor="#aebdf5"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 8)">
          <path d="M18 34h24a8 8 0 0 0 0-16 12 12 0 0 0-23-3 8 8 0 0 0-1 19z" fill="url(#gCloud2)"/>
          <g className="drops" fill="#7fb6ff">
            <path d="M18 40l-3 8" stroke="#7fb6ff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M30 40l-3 8" stroke="#7fb6ff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M42 40l-3 8" stroke="#7fb6ff" strokeWidth="2" strokeLinecap="round"/>
          </g>
        </g>
      </svg>
    )
  }


  return (
    <svg className="wx-icon wx-cloud" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="gCloud3" x1="0" x2="1">
          <stop offset="0%" stopColor="#d8e2ff"/><stop offset="100%" stopColor="#b7c7ff"/>
        </linearGradient>
      </defs>
      <g transform="translate(4 10)">
        <path d="M16 36h28a10 10 0 0 0 0-20 14 14 0 0 0-27-3 10 10 0 0 0-1 23z" fill="url(#gCloud3)"/>
      </g>
    </svg>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forecast, setForecast] = useState([])
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastError, setForecastError] = useState('')
  const cities = ['Wrocław', 'Warszawa', 'Kraków']

  const unit = useSelector(state => state.units.unit)
  const favorites = useSelector(state => state.favorites.items)
  const dispatch = useDispatch()

  const API_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OWM_API_KEY) ||
    process.env.REACT_APP_OWM_API_KEY

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])


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

  function iconCondition(w) {
    if (!w) return ''
    const m = (w.main || '').toLowerCase()
    if (m.includes('clear')) return 'Słonecznie'
    if (m.includes('cloud')) {
      const d = (w.desc || '').toLowerCase()
      if (d.includes('few') || d.includes('scattered') || d.includes('częściowo')) return 'Częściowo pochmurno'
      return 'Pochmurno'
    }
    if (m.includes('rain') || m.includes('drizzle') || m.includes('thunderstorm')) return 'Deszczowo'
    return w.desc || m
  }
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
          if (!map.has(date)) {
            map.set(date, {
              date,
              entries: [],
            })
          }
          map.get(date).entries.push(item)
        }


        const dayNames = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota']
        const daily = []
        for (const [date, obj] of map.entries()) {
            const temps = obj.entries.map(e => e.main?.temp).filter(t => typeof t === 'number')
            const min = Math.round(Math.min(...temps))
            const max = Math.round(Math.max(...temps))
            let rep = obj.entries.find(e => e.dt_txt.includes('12:00:00'))
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

  function convertTemp(celsius, unit) {
    if (celsius == null || isNaN(celsius)) return ''
    if (unit === 'C') return `${Math.round(celsius)}°C`
    if (unit === 'F') return `${Math.round(celsius * 9/5 + 32)}°F`
    if (unit === 'K') return `${Math.round(celsius + 273.15)}K`
    return `${Math.round(celsius)}°C`
  }

  function UnitSwitcher() {
    return (
      <div className="unit-switcher" role="group" aria-label="Jednostki temperatury">
        <button
          type="button"
          className={unit === 'C' ? 'active' : ''}
          onClick={() => dispatch(setUnit('C'))}
          title="Celsjusz"
        >°C</button>
        <button
          type="button"
          className={unit === 'F' ? 'active' : ''}
          onClick={() => dispatch(setUnit('F'))}
          title="Fahrenheit"
        >°F</button>
        <button
          type="button"
          className={unit === 'K' ? 'active' : ''}
          onClick={() => dispatch(setUnit('K'))}
          title="Kelvin"
        >K</button>
      </div>
    )
  }

  function CityItem({ name }) {
    const fav = favorites.includes(name)
    return (
      <li className={`city-item ${fav ? 'fav' : ''}`}>
        <a href={`#${encodeURIComponent(name)}`} onClick={(e) => e.preventDefault()}>
          {name}
        </a>
        <button
          type="button"
          className={`star ${fav ? 'on' : ''}`}
          title={fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          aria-pressed={fav}
          onClick={() => dispatch(toggleFavorite(name))}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3l2.9 5.9 6.5.9-4.7 4.5 1.1 6.4L12 18l-5.8 2.7 1.1-6.4-4.7-4.5 6.5-.9L12 3z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          className="select-city"
          onClick={() => setSelected(name)}
          title={`Wybierz: ${name}`}
        >
          Wybierz
        </button>
      </li>
    )
  }

  return (
    <>
      <header>
        {selected && <h1>{selected}</h1>}

        <button
          type="button"
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>

        <nav
          id="primary-navigation"
          className={`nav-menu ${menuOpen ? 'open' : ''}`}
          onClick={(e) => {
            const target = e.target
            if (target instanceof Element && target.closest('a.select-city')) {
              setMenuOpen(false)
            }
          }}
        >
          <ul>
            {cities.map((c) => <CityItem key={c} name={c} />)}
          </ul>
        </nav>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Wyszukaj miasto..."
            aria-label="Wyszukaj miasto"
            list="cities"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              const val = e.target.value
              setQuery(val)
              if (cities.includes(val)) setSelected(val)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = query.trim()
                if (val) setSelected(val)
              }
            }}
          />
          <datalist id="cities">
            {cities.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>

        <UnitSwitcher />
      </header>

      <div
        className={`backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <main>
        {selected ? (
          <section className="weather-info">
            <h2>Pogoda w {weather?.name || selected}{weather?.country ? `, ${weather.country}` : ''}</h2>

            {loading && <p>Ładowanie pogody…</p>}
            {error && <p style={{ color: '#ffb4b4' }}>{error}</p>}

            {!loading && !error && weather && (
              <>
                <div className="weather-hero">
                  <WeatherIcon condition={iconCondition({ main: weather.main, desc: weather.desc })} size={96} />
                  <div className="weather-hero-main">
                    <div className="temp neon">{convertTemp(weather.temp, unit)}</div>
                    <div className="desc">{weather.desc}</div>
                  </div>
                </div>

                <section className="current-weather">
                  <h3>Aktualna pogoda</h3>
                  <ul className="weather-details">
                    <li>Odczuwalna: {convertTemp(weather.feels, unit)}</li>
                    <li>Wilgotność: {weather.humidity}%</li>
                    <li>Wiatr: {weather.wind} km/h</li>
                  </ul>
                </section>

                {forecastLoading && <p>Ładowanie prognozy…</p>}
                {forecastError && <p style={{ color: '#ffb4b4' }}>{forecastError}</p>}
                {!forecastLoading && !forecastError && forecast.length > 0 && (
                  <section className="forecast">
                    {forecast.map(day => (
                      <div key={day.date} className="day">
                        <div className="day-head">
                          <WeatherIcon condition={iconCondition({ main: day.main, desc: day.desc })} size={36} />
                          <h3>{day.dow}</h3>
                        </div>
                        <p>{day.desc}</p>
                        <p>Min / Max: {convertTemp(day.min, unit)} / {convertTemp(day.max, unit)}</p>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </section>
        ) : (
          <section className="welcome-message">
            <h2>Witamy w aplikacji pogodowej</h2>
            <p>Wybierz miasto z menu lub wyszukaj je, aby zobaczyć prognozę pogody.</p>
          </section>
        )}
      </main>
      
      <footer>
      </footer>
    </>
  )
}

export default App
