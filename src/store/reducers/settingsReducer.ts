import { AppDispatch } from './../configureStore'
import { RootState } from '@/store/configureStore'
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

export const saveToLocalStorage = createAsyncThunk<undefined, void, { state: RootState }>(
    'settings/saveToLocalStorage',
    async (_, thunkAPI) => {
        const { settings: state } = thunkAPI.getState()
        await db.setItem('useSkyEffect', state.useSkyEffect)
        await db.setItem('lng', state.lng)
        await db.setItem('lat', state.lat)
        return undefined
    }
)

export const loadFromLocalStorage = createAsyncThunk(
    'settings/loadFromLocalStorage',
    async (_, thunkAPI) => {
        const res = {
            useSkyEffect: await db.getItem('useSkyEffect') ?? true,
            lng: await db.getItem('lng') ?? 0,
            lat: await db.getItem('lat') ?? 0
        }

        return res as SettingsState
    }
)

export const reset = createAsyncThunk('settings/reset', async (_, thunkAPI) => {
    return new Error("Not implemented")
})

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
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

export const { setLat, setLng, setUseSkyEffect } = settingsSlice.actions
export default settingsSlice.reducer