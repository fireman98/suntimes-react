import { AppDispatch, RootState } from "@/store/configureStore"
import { loadFromLocalStorage, reset, setUseSkyEffect } from "@/store/reducers/settingsReducer"
import { FunctionComponent, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import "./GeneralSettings.scoped.scss"

const GeneralSettings: FunctionComponent<{
    onClose: () => void
}> = ({ onClose }) => {

    const dispatch = useDispatch<AppDispatch>()
    const settings = useSelector((state: RootState) => state.settings)
    const { useSkyEffect } = settings

    const load = useCallback(async () => {
        await dispatch(loadFromLocalStorage())
        onClose()
    }, [onClose])

    const resetDefaults = useCallback(async () => {
        dispatch(reset())
        onClose()
    }, [onClose])

    const save = useCallback(async () => {
        console.warn("Not implemented")
        onClose()
    }, [onClose])

    // TODO load on close

    return (
        <div className="position-wrapper">
            <div className="mui-checkbox">
                <label>
                    <input type="checkbox" checked={useSkyEffect} onChange={(e) => dispatch(setUseSkyEffect(e.target.checked))} />
                    SkyEffect background
                </label>
            </div>
            <button type="button" className="mui-btn mui-btn--secondary" onClick={resetDefaults}>
                Reset defaults
            </button>
            <button type="button" className="mui-btn mui-btn--secondary" onClick={load}>
                Cancel
            </button>
            <button type="button" className="mui-btn mui-btn--primary" onClick={save}>
                Save
            </button>
        </div>
    )
}

export default GeneralSettings