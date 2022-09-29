import SunCalc from 'suncalc'
import { useMemo } from 'react'
import { DateTime } from 'luxon'
import SuntimesUtility from '@/classes/SuntimesUtility'
import { formatTime } from '@/utils/LuxonUtility'


export default function useColumnsForHeadings (headings: string[], date: DateTime) {
    // TODO: add store
    // const settingsStore
    const { lng, lat } = { lng: 0, lat: 0 }

    const ISODate = useMemo(() => {
        return date.toISODate()
    }, [date])

    const timesResult = useMemo(() => {
        return SuntimesUtility.transformGetTimesResultDatesToLuxon(
            SunCalc.getTimes(date.toJSDate(), lat, lng)
        )
    }, [date, lat, lng])

    const columns = useMemo(() => headings.map(x => {
        switch (x) {
            case "date":
                return ISODate
            case "sunrise":
                return formatTime(timesResult.sunrise)

            case "sunset":
                return formatTime(timesResult.sunset)

            case "dusk":
                return formatTime(timesResult.dusk)

            case "dawn":
                return formatTime(timesResult.dawn)


            default:
                return ""
        }
    }), [ISODate, headings, timesResult])


    return {
        columns,
        ISODate,
        timesResult
    }
}