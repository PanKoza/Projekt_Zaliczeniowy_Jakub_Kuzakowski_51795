export function convertTemp(celsius, unit) {
  if (celsius == null || isNaN(celsius)) return ''
  if (unit === 'C') return `${Math.round(celsius)}°C`
  if (unit === 'F') return `${Math.round(celsius * 9/5 + 32)}°F`
  if (unit === 'K') return `${Math.round(celsius + 273.15)}K`
  return `${Math.round(celsius)}°C`
}

export function iconCondition(w) {
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
