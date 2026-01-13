export default function WeatherIcon({ condition, size = 48 }) {
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
