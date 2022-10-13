import SunCalc from "suncalc"
import { GetTimesResult } from "suncalc"
import { DateTime } from "luxon"
import Period from "@/interfaces/Period"
import { radians_to_degrees } from "@/helpers/General"

export interface GetTimesResultLuxon {
    dawn: DateTime
    dusk: DateTime
    goldenHour: DateTime
    goldenHourEnd: DateTime
    nadir: DateTime
    nauticalDawn: DateTime
    nauticalDusk: DateTime
    night: DateTime
    nightEnd: DateTime
    solarNoon: DateTime
    sunrise: DateTime
    sunriseEnd: DateTime
    sunset: DateTime
    sunsetStart: DateTime
}


function calcDaysData (from: DateTime, to: DateTime): Map<string, GetTimesResult> {
    // Set start, end to middle of the day
    // to avoid day change due to timezone
    from.set({ hour: 12, minute: 0 })
    to.set({ hour: 12, minute: 0 })

    const o = new Map()

    while (from <= to) {
        o.set(from.toISODate(), SunCalc.getTimes(from.toJSDate(), 0, 0))

        from = from.plus({ days: 1 })
    }

    return o

}


/**
 * @param {Map<string, GetTimesResult>} data
 * @param {DateTime} from 
 * @param {DateTime} to 
 */
function getMissingPeriods (data: Map<string, GetTimesResult>, from: DateTime, to: DateTime) {
    const outdated_periods: Array<Period> = []
    let current_period: Period | null = null
    const days = Math.ceil(to.diff(from, "day").days)

    for (let i = 0; i < days; i++) {
        const key = from.toISODate()
        if (!data.has(key)) {//Non-existent
            if (!current_period) {
                current_period = { start: from, end: from }
                outdated_periods.push(current_period)
            }
        } else {//Newer
            if (current_period) {
                current_period.end = from.plus({ days: -1 })
                current_period = null
            }
        }

        from = from.plus({ days: 1 })
    }

    if (current_period) {
        current_period.end = from.plus({ days: -1 })
    }

    return outdated_periods
}


function transformGetTimesResultDatesToLuxon (getTimesResult: GetTimesResult): GetTimesResultLuxon {
    return {
        dawn: DateTime.fromJSDate(getTimesResult.dawn),
        dusk: DateTime.fromJSDate(getTimesResult.dusk),
        goldenHour: DateTime.fromJSDate(getTimesResult.goldenHour),
        goldenHourEnd: DateTime.fromJSDate(getTimesResult.goldenHourEnd),
        nadir: DateTime.fromJSDate(getTimesResult.nadir),
        nauticalDawn: DateTime.fromJSDate(getTimesResult.nauticalDawn),
        nauticalDusk: DateTime.fromJSDate(getTimesResult.nauticalDusk),
        night: DateTime.fromJSDate(getTimesResult.night),
        nightEnd: DateTime.fromJSDate(getTimesResult.nightEnd),
        solarNoon: DateTime.fromJSDate(getTimesResult.solarNoon),
        sunrise: DateTime.fromJSDate(getTimesResult.sunrise),
        sunriseEnd: DateTime.fromJSDate(getTimesResult.sunriseEnd),
        sunset: DateTime.fromJSDate(getTimesResult.sunset),
        sunsetStart: DateTime.fromJSDate(getTimesResult.sunsetStart),
    }
}

export function getSunPathForDay (day: DateTime, lat: number, lng: number, n = 1440) {
    const start = day.startOf("day").toJSDate(),
        end = day.plus({ days: 1 }).startOf("day").toJSDate()

    const startMs = start.getTime()

    const diff = Math.floor((end.getTime() - start.getTime()) / n)
    const times = Array.from({ length: n }, (_v, k) => {

        const _position = SunCalc.getPosition(new Date(startMs + k * diff), lat, lng)

        return {
            time: new Date(startMs + k * diff),
            altitude: radians_to_degrees(_position.altitude),
            azimuth: radians_to_degrees(_position.azimuth) + 180,
        }
    })

    return times
}

export default {
    calcDaysData,
    getMissingPeriods,
    transformGetTimesResultDatesToLuxon,
    getSunPathForDay
}