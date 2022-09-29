import { useMemo } from 'react'
import { SuntimesViewType } from "@/interfaces/Suntimes"


const sunViewHeadings = ["date", "dawn", "sunrise", "sunset", "dusk"]
const otherHeadings: Array<string> = ["date", "moonrise"]

export default function useHeadingsByViewType (viewType: SuntimesViewType) {

    const headings = useMemo(() => viewType === SuntimesViewType.SUN ? sunViewHeadings : otherHeadings, [viewType])

    return headings

}