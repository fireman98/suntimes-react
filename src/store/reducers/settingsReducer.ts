import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import localforage from 'localforage'

const db = localforage.createInstance({
    name: "storage"
})

interface SettingsState {
    useSkyEffect: boolean,
    lng: number,
    lat: number
}

const initialState: SettingsState = {
    useSkyEffect: true,
    lng: 0.0,
    lat: 0.0,
}

export const saveToLocalStorage = createAsyncThunk<void, void, { state: SettingsState }>(
    'settings/saveToLocalStorage',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState()
        await db.setItem('useSkyEffect', state.useSkyEffect)
        await db.setItem('lng', state.lng)
        await db.setItem('lat', state.lat)
    }
)

export const loadFromLocalStorage = createAsyncThunk(
    'settings/loadFromLocalStorage',
    async (_, thunkAPI) => {
        return {
            useSkyEffect: await db.getItem('useSkyEffect') ?? true,
            lng: await db.getItem('lng') ?? 0,
            lat: await db.getItem('lat') ?? 0
        } as SettingsState
    }
)

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        reset (state) { // TODO: saveToLocalStorage
            state = initialState
        },

        setUseSkyEffect (state, action: PayloadAction<boolean>) {
            state.useSkyEffect = action.payload
        },

        setLng (state, action: PayloadAction<number>) {
            state.lng = action.payload
        },

        setLat (state, action: PayloadAction<number>) {
            state.lat = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(loadFromLocalStorage.fulfilled, (state, { payload }) => {
            state.useSkyEffect = payload.useSkyEffect
            state.lng = payload.lng
            state.lat = payload.lat
        })
    }
})

export const { reset, setLat, setLng, setUseSkyEffect } = settingsSlice.actions
export default settingsSlice.reducer