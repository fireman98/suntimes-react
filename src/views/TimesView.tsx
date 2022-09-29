import { SuntimesViewType } from "@/interfaces/Suntimes"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import TimesTable from "@/components/TimesTable"
import TimesParameters from "@/components/TimesParameters"

function TimesView () {
    const [from, setFrom] = useState(DateTime.now().startOf("month"))
    const [viewType, setViewType] = useState(SuntimesViewType.SUN)

    const to = useMemo(() => {
        return from.endOf("month")
    }, [from])

    const monthName = useMemo(() => {
        return from.toFormat("LLLL")
    }, [from])

    return (
        <div className="view__times">
            <h1>Times - {monthName}</h1>
            <div className="view__times__times-table">
                <TimesParameters from={from} updateFrom={(val) => setFrom(val)} viewType={viewType} updateViewType={(val) => setViewType(val)} />
                <TimesTable from={from} to={to} viewType={viewType} />
            </div>
        </div>
    )
}

export default TimesView