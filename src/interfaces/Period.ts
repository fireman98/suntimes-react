import { DateTime } from "luxon"

export default interface Period {
    start: DateTime
    end: DateTime
}