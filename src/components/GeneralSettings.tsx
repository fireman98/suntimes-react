import { AppDispatch, RootState } from "@/store/configureStore"
import { loadFromLocalStorage, reset, saveToLocalStorage, setUseSkyEffect } from "@/store/reducers/settingsReducer"
import { FunctionComponent, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import "./GeneralSettings.scoped.scss"

const GeneralSettings: FunctionComponent<{
    onClose: () => void
}> = ({ onClose }) => {

    const dispatch = useDispatch<AppDispatch>()
    const settings = useSelector((state: RootState) => state.settings)
    const { useSkyEffect } = settings

    const load = useCallback(async (close: boolean = true) => {
        await dispatch(loadFromLocalStorage())
        if (close)
            onClose()
    }, [onClose, dispatch])

    const resetDefaults = useCallback(async () => {
        // React exclusive: Async thunk cant modify state, so this logic must be placed outside store
        dispatch(reset())
        dispatch(saveToLocalStorage())
        onClose()
    }, [onClose, dispatch])

    const save = useCallback(async () => {
        await dispatch(saveToLocalStorage())
        onClose()
    }, [onClose, dispatch])

    useEffect(() => {
        return () => {
            load(false)
        }
    }, [load])

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
            <button type="button" className="mui-btn mui-btn--secondary" onClick={() => load(false)}>
                Cancel
            </button>
            <button type="button" className="mui-btn mui-btn--primary" onClick={save}>
                Save
            </button>
        </div>
    )
}

export default GeneralSettings