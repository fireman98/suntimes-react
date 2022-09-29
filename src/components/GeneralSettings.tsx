import { FunctionComponent, useCallback, useEffect, useState } from "react"
import "./GeneralSettings.scoped.scss"

const GeneralSettings: FunctionComponent<{
    onClose: () => void
}> = ({ onClose }) => {

    // TODO: settingsStore
    const [useSkyEffect, setUseSkyEffect] = useState(true)

    const load = useCallback(async () => {
        console.warn("Not implemented load")
        onClose()
    }, [onClose])

    const resetDefaults = useCallback(async () => {
        console.warn("Not implemented")
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
                    <input type="checkbox" checked={useSkyEffect} onChange={(e) => setUseSkyEffect(e.target.checked)} />
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