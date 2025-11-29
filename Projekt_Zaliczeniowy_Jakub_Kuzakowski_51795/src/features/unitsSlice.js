import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  unit: 'C'
}

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    setUnit: (state, action) => {
      const u = action.payload
      if (u === 'C' || u === 'F' || u === 'K') state.unit = u
    }
  }
})

export const { setUnit } = unitsSlice.actions
export default unitsSlice.reducer