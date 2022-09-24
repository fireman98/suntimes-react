import { FunctionComponent, useCallback, useMemo, useState } from "react"

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

// TODO: refactor and add types
function useComputed<Type> (getter: any, setter: any, deps: any) {
    const val = useMemo(() => {
        const obj = {
            get value (): Type {
                return getter()
            },

            set value (val: Type) {
                setter(val)
            }
        }
        return obj
    }, [deps])

    return val
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


    const _time = useComputed<Date>(() => {
        return time
    }, (val: any) => {
        stopTick()
        updateTime(val)
    }, [])

    const goNow = useCallback(() => {
        onGoNow()
    }, [onGoNow])

    return (
        <>
            {_time.value.toISOString()}
            <button onClick={() => {
                _time.value = new Date(_time.value.getTime() + 1000 * 60 * 60)
            }}>Add 1 hour</button>
            <button onClick={() => goNow()}>goNow</button>

        </>
    )
}

export default TimeSelector