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


export default {
    formatTime
}