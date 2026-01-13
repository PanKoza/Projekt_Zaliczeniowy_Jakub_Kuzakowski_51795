export default function CityItem({ name, favorites, onToggleFavorite, onSelect }) {
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
        onClick={() => onToggleFavorite(name)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.5 1.1 6.4L12 18l-5.8 2.7 1.1-6.4-4.7-4.5 6.5-.9L12 3z" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        className="select-city"
        onClick={() => onSelect(name)}
        title={`Wybierz: ${name}`}
      >
        Wybierz
      </button>
    </li>
  )
}
