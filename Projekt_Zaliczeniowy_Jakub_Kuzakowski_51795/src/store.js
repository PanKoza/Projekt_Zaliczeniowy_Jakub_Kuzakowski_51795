import { configureStore } from '@reduxjs/toolkit'
import unitsReducer from './features/unitsSlice'
import favoritesReducer from './features/favoritesSlice'

const LS_KEY = 'weatherAppState'

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    return {
      units: { unit: ['C','F','K'].includes(parsed?.units?.unit) ? parsed.units.unit : 'C' },
      favorites: { items: Array.isArray(parsed?.favorites?.items) ? parsed.favorites.items : [] }
    }
  } catch {
    return undefined
  }
}

let saveTimer
function saveState(state) {
  try {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      const toSave = {
        units: state.units,
        favorites: state.favorites
      }
      localStorage.setItem(LS_KEY, JSON.stringify(toSave))
    }, 150)
  } catch {}
}

export const store = configureStore({
  reducer: {
    units: unitsReducer,
    favorites: favoritesReducer
  },
  preloadedState: loadState()
})

store.subscribe(() => {
  saveState(store.getState())
})