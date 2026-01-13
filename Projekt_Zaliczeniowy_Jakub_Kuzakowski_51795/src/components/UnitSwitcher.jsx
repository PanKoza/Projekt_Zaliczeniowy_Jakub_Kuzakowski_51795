export default function UnitSwitcher({ unit, onChange }) {
  return (
    <div className="unit-switcher" role="group" aria-label="Jednostki temperatury">
      <button
        type="button"
        className={unit === 'C' ? 'active' : ''}
        onClick={() => onChange('C')}
        title="Celsjusz"
      >°C</button>
      <button
        type="button"
        className={unit === 'F' ? 'active' : ''}
        onClick={() => onChange('F')}
        title="Fahrenheit"
      >°F</button>
      <button
        type="button"
        className={unit === 'K' ? 'active' : ''}
        onClick={() => onChange('K')}
        title="Kelvin"
      >K</button>
    </div>
  )
}
