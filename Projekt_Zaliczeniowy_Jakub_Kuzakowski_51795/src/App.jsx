import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUnit } from './features/unitsSlice'
import { toggleFavorite } from './features/favoritesSlice'
import './App.css'
import WeatherIcon from './components/WeatherIcon'
import UnitSwitcher from './components/UnitSwitcher'
import CityItem from './components/CityItem'
import { useWeather } from './hooks/useWeather'
import { useForecast } from './hooks/useForecast'
import { convertTemp, iconCondition } from './utils/weather'
import cities from './constants/cities'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
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

  const { weather, loading, error } = useWeather(selected, API_KEY)
  const { forecast, forecastLoading, forecastError } = useForecast(selected, API_KEY)

  function handleSelectCity(name) {
    setSelected(name)
    setMenuOpen(false)
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
            {cities.map((c) => (
              <CityItem
                key={c}
                name={c}
                favorites={favorites}
                onToggleFavorite={(name) => dispatch(toggleFavorite(name))}
                onSelect={handleSelectCity}
              />
            ))}
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

        <UnitSwitcher unit={unit} onChange={(u) => dispatch(setUnit(u))} />
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
