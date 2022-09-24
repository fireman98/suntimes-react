import useComputed from "@/hooks/useComputed"
import { FunctionComponent, useCallback, useMemo, useState } from "react"
import "./TimeSelector.scoped.scss"

class Period {
    name
    rangeMax
    rangeMin
    step
    getValue //Function; If parameter is number => return a date, else if parameter is undefined return number
    label

    constructor(
        name: string,
        rangeMax: number | (() => number),
        rangeMin: number | (() => number),
        step: number,
        getValue: (val?: any) => any,
        label: string
    ) {
        this.name = name
        this.rangeMax = rangeMax
        this.rangeMin = rangeMin
        this.step = step
        this.getValue = getValue
        this.label = label
    }
}

function days_of_a_year (year: number) {
    return isLeapYear(year) ? 366 : 365
}

function isLeapYear (year: number) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}

function dayOfYear (date: Date) {
    const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    const mn = date.getMonth()
    const dn = date.getDate()
    let dayOfYear = dayCount[mn] + dn
    if (mn > 1 && isLeapYear(date.getFullYear())) dayOfYear++
    return dayOfYear
}


const TimeSelector: FunctionComponent<{
    time: Date,
    updateTime: (date: Date) => void
    onStopTick: () => void
    onGoNow: () => void
}> = ({ time, updateTime, onStopTick, onGoNow }) => {

    const stopTick = useCallback(() => {
        onStopTick()
    }, [onStopTick])


    const _time = useComputed<Date>({
        get () {
            return time
        },
        set (val) {
            stopTick()
            updateTime(val)
        }
    }, [time])

    const periods: Period[] = [
        new Period(
            "year",
            () => {
                return days_of_a_year(_time.value.getFullYear())
            },
            1,
            86400000,
            (val) => {
                val = Number(val)
                if (!isNaN(val)) {
                    const tmpDate = new Date(_time.value)
                    tmpDate.setUTCMonth(0)
                    tmpDate.setUTCDate(0)
                    return new Date(tmpDate.getTime() + activePeriod.value.step * val)
                } else {
                    return dayOfYear(_time.value)
                }
            },
            "Év"
        ),

        new Period(
            "day",
            1439,
            0,
            3600000,
            (val) => {
                val = Number(val)
                if (!isNaN(val)) {
                    const hours = Math.floor(val / 60)
                    const minutes = val % 60
                    const tmpDate = new Date(_time.value)
                    tmpDate.setHours(hours)
                    tmpDate.setMinutes(minutes)
                    return new Date(tmpDate)
                } else {
                    return _time.value.getHours() * 60 + _time.value.getMinutes()
                }
            },
            "Nap"
        ),

        new Period(
            "hour",
            59,
            0,
            60000,
            (val) => {
                val = Number(val)
                if (!isNaN(val)) {
                    const tmpDate = new Date(_time.value)
                    tmpDate.setMinutes(val)
                    return new Date(tmpDate)
                } else {
                    return _time.value.getMinutes()
                }
            },
            "Óra"
        ),
    ]
    const [activePeriodIndex, setActivePeriodIndex] = useState(1)
    const activePeriod = useComputed({
        get () {
            return periods[activePeriodIndex]
        },
        set (val) {
            const index = periods.findIndex((p) => p === val)
            if (index === undefined)
                return
            setActivePeriodIndex(index)
        }
    }, [activePeriodIndex, periods])




    const rangeValue = useComputed({
        get () {
            return activePeriod.value.getValue()
        },

        set (val) {
            _time.value = activePeriod.value.getValue(val)
        }
    }, [activePeriod])

    const goNow = useCallback(() => {
        onGoNow()
    }, [onGoNow])

    const goLeft = useCallback(() => {
        _time.value = new Date(_time.value.getTime() - activePeriod.value.step)
    }, [_time, activePeriod.value.step])

    const goRight = useCallback(() => {
        _time.value = new Date(_time.value.getTime() + activePeriod.value.step)
    }, [_time, activePeriod.value.step])

    return (
        <div className="time-selector">
            <div className="mui-select time-selector__period-select">
                <select onChange={(e) => {
                    const p = periods.find(p => p.name === e.target.value)
                    if (!p)
                        return

                    activePeriod.value = p
                }}
                    value={activePeriod.value.name}
                >
                    {
                        periods.map((period) => {
                            return (
                                <option key={period.name} value={period.name}>{period.label}</option>
                            )
                        })
                    }
                </select>
            </div>
            <button className="image-icon-wrapper time-selector__button" onClick={() => goLeft()}>
                <i className="fas fa-chevron-left"></i>
            </button>
            <button className="image-icon-wrapper time-selector__button" onClick={() => goRight()}>
                <i className="fas fa-chevron-right"></i>
            </button>
            <input className="time-selector__range" type="range" value={rangeValue.value} onChange={e => rangeValue.value = e.target.value}
                min={typeof activePeriod.value.rangeMin === 'function' ? activePeriod.value.rangeMin() : activePeriod.value.rangeMin}
                max={typeof activePeriod.value.rangeMax === 'function'
                    ? activePeriod.value.rangeMax()
                    : activePeriod.value.rangeMax} />
            <button className="image-icon-wrapper time-selector__button" title="Go to current time" onClick={() => goNow()}>
                <i className="fas fa-history"></i>
            </button>

        </div >
    )
}

export default TimeSelector