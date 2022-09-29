import { getSunPathForDay } from "@/classes/SuntimesUtility"
import { DateTime } from "luxon"
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { ActiveElement, Chart, ChartConfiguration } from 'chart.js'
import { LinearScale, LineController, CategoryScale, PointElement, LineElement, Filler, Tooltip, Decimation } from "chart.js"
import { debounce, formatTime } from "@/helpers/General"

Chart.register(LinearScale, LineController, CategoryScale, PointElement, LineElement, Filler, Tooltip, Decimation)

const labelsForChart: any = []
const altitudes: any = []
const labelColor: any = "white"
const chartConfig: ChartConfiguration = {
    type: 'line',
    data: {
        labels: labelsForChart,
        datasets: [
            {
                label: 'Sun',
                data: altitudes,
                tension: 0,
                backgroundColor: 'rgba(255, 201, 78, 0.4)',
                borderColor: [
                    '#FFC94E',
                ],
                borderWidth: 5,
                segment: {
                    backgroundColor: (element: any) => {
                        return element.p0.parsed.y < 0 ? 'rgba(2, 1, 85, 0.4)' : 'rgba(255, 201, 78, 0.4)'
                    },
                    //borderDash: ctx => skipped(ctx, [6, 6]),
                },
                pointHoverRadius: 12,
                fill: true,
                spanGaps: true,
            },
        ]
    },
    options: {
        animation: false,
        parsing: false,

        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            /*decimation: {
                enabled: false,
                algorithm: 'min-max',
            },*/
            legend: {
                display: true,
            },
            tooltip: {
                enabled: true,
                mode: "index",
                callbacks: {

                }
            }
        },
        scales: {
            y: {
                min: -90,
                max: 90,

                ticks: {
                    color: labelColor,
                }
            },

            x: {
                ticks: {
                    color: labelColor,
                }
            }


        },
        responsive: true
    },
}

const SunGraph: FunctionComponent<{
    date: DateTime,
    activePoint?: number,
    labelColor?: string,
    animate?: boolean
}> = ({ date, activePoint, labelColor = "#ffffff", animate = true }) => {

    // TODO: store!!
    const [lng, setLng] = useState(0.0)
    const [lat, setLat] = useState(0.0)

    const dayData = useMemo(() => {
        return getSunPathForDay(date, lat, lng)
    }, [date, lat, lng])

    const [labelsForChart, setLabelsForChart] = useState<Array<string>>([])
    const [altitudes, setAltitudes] = useState<Array<{ x: number, y: number }>>([])

    const chart = useRef<Chart | null>(null)
    const config = useMemo<ChartConfiguration>(() => {
        chartConfig.data.labels = labelsForChart
        chartConfig.data.datasets[0].data = altitudes
        chartConfig.options!.animation = animate ? undefined : false;

        (chartConfig as any).data.datasets[0].pointRadius = (element: ActiveElement) => {
            return [activePoint].includes(element.index) ? 8 : 0
        }

        (chartConfig as any).data.datasets[0].segment.borderColor = (element: any) => {
            return element.p0.parsed.x > (activePoint || 0) ? 'rgba(2, 1, 85, 0.4)' : 'rgba(255, 201, 78, 0.4)'
        }

        (chartConfig as any).options.plugins.tooltip.callbacks.label = (input: any) => {
            return `Altitude ${input.parsed.y.toFixed(2)} \n Azimuth ${dayData[input.parsed.x].azimuth.toFixed(2)}`
        }


        return chartConfig as ChartConfiguration
    }, [activePoint, altitudes, animate, dayData, labelColor, labelsForChart])

    const canvas = useRef<HTMLCanvasElement | null>(null)

    const updateChart = useCallback(
        debounce(() => {

            if (!chart.current)
                return

            chart.current.update()
        }, 500),
        [chart.current])

    useEffect(() => {
        for (let i = 0; i < dayData.length; i++) {
            labelsForChart[i] = formatTime(dayData[i].time)
            altitudes[i] = { x: i, y: dayData[i].altitude }
        }

        setLabelsForChart(labelsForChart)
        setAltitudes(altitudes)

        updateChart()

        // watch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dayData])

    useEffect(() => { // Update label colors
        if (!chart.current)
            return

        const xTicks = chart.current.options.scales?.x?.ticks
        const yTicks = chart.current.options.scales?.y?.ticks

        if (xTicks)
            xTicks.color = labelColor
        if (yTicks)
            yTicks.color = labelColor


        updateChart()
        //watch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labelColor])

    useEffect(() => {
        if (chart.current)
            updateChart()

        //Watch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, activePoint])

    useEffect(() => {
        if (!canvas.current)
            return

        const chartReference = new Chart(canvas.current, config)
        chart.current = chartReference

        return () => {
            chartReference.destroy()
            chart.current = null
        }

    }, [canvas])


    return (
        <div className="sun-graph">
            <canvas ref={canvas} width="600" height="300"></canvas>
        </div>
    )
}

export default SunGraph