import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const city = action.payload
      const i = state.items.indexOf(city)
      if (i >= 0) state.items.splice(i, 1)
      else state.items.push(city)
    }
  }
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer