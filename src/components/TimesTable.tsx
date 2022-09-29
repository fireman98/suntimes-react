import useHeadingsByViewType from "@/hooks/useHeadingsByViewType"
import { SuntimesViewType } from "@/interfaces/Suntimes"
import { DateTime } from "luxon"
import { FunctionComponent, useMemo } from "react"
import TimesRow from "./TimesRow"
import "./TimesTable.scoped.scss"

const TimesTable: FunctionComponent<{
    from: DateTime,
    to: DateTime,
    viewType: SuntimesViewType
}> = ({
    from, to, viewType = SuntimesViewType.SUN
}) => {

        const days = useMemo(() => {
            const days = to.plus({ days: 1 }).diff(from, "day").days

            return Array.from({ length: days }, (v, i) =>
                from.plus({ days: i })
            )
        }, [from, to])

        const headings = useHeadingsByViewType(viewType)

        return (
            <table className="times-table mui-table mui-table--bordered">
                <thead>
                    <tr>
                        {headings.map((heading, index) => <th key={index}>
                            {heading}
                        </th>)}
                        <th className="buttons-col"></th>
                    </tr>
                </thead>
                <tbody>
                    {days.map((day, index) => <TimesRow key={index} date={day} viewType={viewType} headings={headings}></TimesRow>)}
                </tbody>
            </table>
        )
    }

export default TimesTable