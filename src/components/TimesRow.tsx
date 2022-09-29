import useColumnsForHeadings from "@/hooks/useColumnsForHeadings"
import { SuntimesViewType } from "@/interfaces/Suntimes"
import { DateTime } from "luxon"
import { Fragment, FunctionComponent, useCallback, useState } from "react"
import SunGraph from "./SunGraph"
// TODO fix css with fragments
//import "./TimesRow.scoped.scss"


const TimesRow: FunctionComponent<{
    date: DateTime,
    viewType: SuntimesViewType,
    headings: Array<string>
}> = ({ date, viewType, headings }) => {

    const { columns, ISODate, timesResult } = useColumnsForHeadings(headings, date)

    const [isOpened, setIsOpened] = useState(false)
    const toggleIsOpened = useCallback(() => {
        setIsOpened(!isOpened)
    }, [isOpened])

    return (
        <Fragment>
            <tr className="times-row">
                {columns.map((column, index) => <td key={index}>
                    {column}
                </td>)}
                <td className="buttons-col">
                    <button className="mui-btn mui-btn--small mui-btn--primary" onClick={toggleIsOpened}>
                        <i className="fas fa-caret-down"></i>
                    </button>
                </td>
            </tr>
            <tr className={isOpened ? '' : 'v-hidden'}>
                <td colSpan={6}>
                    {// TODO: check keepalive 
                    }
                    <SunGraph date={date} animate={false} />
                </td>
            </tr>
        </Fragment>
    )
}

export default TimesRow