import useComputed from "@/hooks/useComputed"
import { SuntimesViewType } from "@/interfaces/Suntimes"
import { DateTime } from "luxon"
import { FunctionComponent, useMemo } from "react"
import "./TimesParameters.scoped.scss"


const TimesParameters: FunctionComponent<{
    from: DateTime,
    viewType: SuntimesViewType,
    updateFrom: (payload: DateTime) => void,
    updateViewType: (payload: SuntimesViewType) => void
}> = ({ from, viewType, updateFrom, updateViewType }) => {

    const SuntimesViewTypeValues = useMemo(() => Object.values(SuntimesViewType), [])


    const fromAsISODate = useComputed({
        get () {
            return from.toISODate()
        },

        set (val) {
            updateFrom(DateTime.fromISO(val).startOf('month'))
        }
    }, [from])

    const goLeft = () => {
        fromAsISODate.value = from.plus({ month: -1 }).toISODate()
    }

    const goRight = () => {
        fromAsISODate.value = from.plus({ month: 1 }).toISODate()
    }

    return (
        <div className="times-parameters">
            <div className="mui-textfield date-input">
                <input type="date" value={fromAsISODate.value} onChange={e => fromAsISODate.value = e.target.value} aria-label="date" />
                <button className="image-icon-wrapper time-selector__button" onClick={goLeft} title="previous">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button className="image-icon-wrapper time-selector__button" onClick={goRight} title="next">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
            <div className="mui-select">
                <select value={viewType} onChange={e => updateViewType(e.target.value as SuntimesViewType)}>
                    {SuntimesViewTypeValues.map(suntimesViewTypeValues => <option key={suntimesViewTypeValues} value={suntimesViewTypeValues}>
                        {suntimesViewTypeValues}
                    </option>)}
                </select>
            </div>
        </div>
    )
}

export default TimesParameters