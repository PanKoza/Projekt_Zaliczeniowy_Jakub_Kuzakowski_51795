import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState('') // start bez domyślnego tekstu
  const [query, setQuery] = useState('')       // stan inputa wyszukiwarki
  const cities = ['Wrocław', 'Warszawa', 'Kraków']

  // Zamknij menu klawiszem Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header>
        {/* Tytuł zależny od wybranego elementu */}
        {selected && <h1>{selected}</h1>}

        {/* Przycisk hamburgera */}
        <button
          type="button"
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu nawigacyjne */}
        <nav
          id="primary-navigation"
          className={`nav-menu ${menuOpen ? 'open' : ''}`}
          onClick={(e) => {
            const target = e.target
            if (target instanceof Element && target.closest('a')) {
              const link = target.closest('a')
              if (link) setSelected(link.textContent || '')
              setMenuOpen(false)
            }
          }}
        >
          <ul>
            <li><a href="#Wroclaw">Wrocław</a></li>
            <li><a href="#Warszawa">Warszawa</a></li>
            <li><a href="#Kraków">Kraków</a></li>
          </ul>
        </nav>

        {/* Wyszukiwarka */}
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


        
      </header>

      {/* Tło pod wysuniętym menu */}
      <div 
        className={`backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <main>
        {/* Główna zawartość strony pogodowej*/}
        {selected ? (
          <section className="weather-info">
            <h2>Pogoda w {selected}</h2>
            <p>Tu pojawi się prognoza pogody dla {selected}.</p>
            <section className="current-weather">
              <h3>Aktualna pogoda</h3>
              <p>Temperatura: 21°C</p>
              <p>Warunki: Słonecznie</p>
              <p>Wilgotność: 45%</p>
              <p>Wiatr: 10 km/h</p>
            </section>
            <section className="forecast">
              <div className="day">
                <h3>Poniedziałek</h3>
                <p>Temperatura: 20°C</p>
                <p>Warunki: Słonecznie</p>
              </div>
              <div className="day">
                <h3>Wtorek</h3>
                <p>Temperatura: 18°C</p>
                <p>Warunki: Częściowo pochmurno</p>
              </div>
              <div className="day">
                <h3>Środa</h3>
                <p>Temperatura: 22°C</p>
                <p>Warunki: Deszczowo</p>
              </div>
              <div className="day">
                <h3>Czwartek</h3>
                <p>Temperatura: 19°C</p>
                <p>Warunki: Pochmurno</p>
              </div>
              <div className="day">
                <h3>Piątek</h3>
                <p>Temperatura: 21°C</p>
                <p>Warunki: Słonecznie</p>
              </div>
              <div className='day'>
                <h3>Sobota</h3>
                <p>Temperatura: 23°C</p>
                <p>Warunki: Słonecznie</p>
              </div>
              <div className='day'>
                <h3>Niedziela</h3>
                <p>Temperatura: 20°C</p>
                <p>Warunki: Częściowo pochmurno</p>
              </div>
            </section>
            <section className="additional-info">
              <h3>Dodatkowe informacje</h3>
              <p>Wschód słońca: 06:00</p>
              <p>Zachód słońca: 20:00</p>
              <p>Ciśnienie: 1015 hPa</p>
            </section>
            <section className='Rainprobability'>
              <h3>Prawdopodobieństwo opadów</h3>
              <p>Poniedziałek: 10%</p>
              <p>Wtorek: 20%</p>
              <p>Środa: 80%</p>
              <p>Czwartek: 50%</p>
              <p>Piątek: 10%</p>
              <p>Sobota: 5%</p>
              <p>Niedziela: 15%</p>
            </section>
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
