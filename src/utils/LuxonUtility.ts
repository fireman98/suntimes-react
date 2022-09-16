import { DateTime } from "luxon"

/**
 * Format Luxon DateTime to "HH:mm", without the overhead of toFormat()
 * @param d
 * @returns 
 */
export function formatTime (d: DateTime): string {
    const hourPrefix = d.hour < 10 ? '0' : '',
        minutePrefix = d.minute < 10 ? '0' : ''
    return `${hourPrefix}${d.hour}:${minutePrefix}${d.minute}`
}

export function formatYearMonthDayToISO (year: number, month: number, day: number): string {
    month = month + 1

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

export default {
    formatTime,
    formatYearMonthDayToISO
}