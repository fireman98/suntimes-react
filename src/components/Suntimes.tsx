import SkyEffect from "@/classes/SkyEffect"
import { formatYearMonthDayToISO } from "@/utils/LuxonUtility"
import { DateTime } from "luxon"
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import SunCalc from "suncalc"
import strftime from "strftime"
import TimeSelector from "./TimeSelector"

import "./Suntimes.scoped.scss"

function radians_to_degrees (radians: number) {
    const pi = Math.PI
    return radians * (180 / pi)
}

/**
 * Timespan in ms
 */
function format_timespan (timespan: number) {
    timespan = Math.floor(timespan / 1000)

    const hours = Math.floor(timespan / 3600)
    timespan = timespan % 3600
    const minutes = Math.floor(timespan / 60)
    timespan = timespan % 60
    const seconds = timespan

    let hours_s = String(hours),
        minutes_s = String(minutes),
        seconds_s = String(seconds)

    if (hours < 10) hours_s = "0" + hours
    if (minutes < 10) minutes_s = "0" + minutes
    if (seconds < 10) seconds_s = "0" + seconds

    return `${hours_s}:${minutes_s}:${seconds_s}`
}

enum Modal {
    GeneralSettings = 'GeneralSettings',
    LocationSettings = 'LocationSettings'
}

const Suntimes: FunctionComponent<{
    onSetRouteClass: (className: string) => void
}> = ({ onSetRouteClass }) => {

    //TODO: redux settingsstore
    //const settingsStore = useSettingsStore()
    //MOCK
    const useSkyEffect = true
    const [lng, setLng] = useState(0.0)
    const [lat, setLat] = useState(0.0)

    const [now, setNow] = useState<Date>(new Date())
    const [tickTask, setTickTask] = useState<NodeJS.Timer | undefined>(undefined)
    const [tickInterval, setTickInterval] = useState(250)

    const [lastaltitude, setLastaltitude] = useState(0)
    const [altituderate, setAltituderate] = useState(0)

    const [year, setYear] = useState(0)
    const [month, setMonth] = useState(0)
    const [day, setDay] = useState(0)
    const currentDayLuxon = useMemo(() => DateTime.fromISO(formatYearMonthDayToISO(year, month, day)), [year, month, day])

    const minuteOfDay = useMemo(() => now.getHours() * 60 + now.getMinutes(), [now])

    const [skyEffect, setSkyEffect] = useState(new SkyEffect({}))

    const [generalSettingsActive, setGeneralSettingsActive] = useState(false)
    const [locationSettingsActive, setLocationSettingsActive] = useState(false)

    const openModal = useCallback((modal?: Modal) => {
        setGeneralSettingsActive(false)
        setLocationSettingsActive(false)

        switch (modal) {
            case Modal.GeneralSettings:
                setGeneralSettingsActive(true)
                break
            case Modal.LocationSettings:
                setLocationSettingsActive(true)
                break
        }
    }, [])

    const [styles, setStyles] = useState({
        backgroundSunCurrent: "#ffffff",
        backgroundSunNext: "#ffffff",
        foregroundSun: "#000000",
        backgroundSunPrimary: "#ffffff",
        opacitySunNext: 0,
    })


    const sunTimes = useMemo(() => {
        const _now = new Date(now as Date)
        const _times = SunCalc.getTimes(_now, lat, lng)


        return {
            ..._times,
            day_length: _times.sunset.getTime() - _times.sunrise.getTime()
        }
    }, [lat, lng, now])

    const percentage = useMemo(() => {
        if (!sunTimes.sunrise || !sunTimes.sunset || !now) return 0

        let _sunset = sunTimes.sunset.getTime(),
            _now = now.getTime()

        const _sunrise = sunTimes.sunrise.getTime()

        _now -= _sunrise
        _sunset -= _sunrise

        return (_now / _sunset) * 100


    }, [now, sunTimes])

    const sunPositionRaw = useMemo(() => SunCalc.getPosition(now as Date, lat, lng), [now, lat, lng])
    useEffect(() => {
        setAltituderate(radians_to_degrees(
            ((sunPositionRaw.altitude - lastaltitude) / tickInterval) * 60000 * 5
        )) //one min

        setLastaltitude(sunPositionRaw.altitude)
    }, [sunPositionRaw]) // TODO: test deps

    const sunPosition = useMemo(() => {
        const _position = sunPositionRaw

        return {
            ..._position,
            altitude: radians_to_degrees(_position.altitude),
            azimuth: radians_to_degrees(_position.azimuth) + 180,
        }
    }, [sunPositionRaw])

    useEffect(() => {
        if (!useSkyEffect)
            return

        skyEffect.altitude = Number(sunPosition.altitude)
        skyEffect.direction = Boolean(percentage < 50)

        setSkyEffect(skyEffect)
    }, [sunPosition.altitude, percentage, skyEffect, useSkyEffect])

    const backgroundColor = useMemo(() => {
        if (!useSkyEffect)
            return { current: "#ffffff", next: "#ffffff", nextOpacity: 0 }

        return skyEffect.getLinearGradient()
    }, [useSkyEffect, skyEffect.altitude, skyEffect])

    const foregroundColor = useMemo(() => {
        if (!useSkyEffect)
            return "black"

        return sunPosition.altitude > 10 ? "black" : "white"

    }, [useSkyEffect, sunPosition.altitude])

    const styleForWrapper = useMemo(() => {
        return {
            "--background-sun-current": styles.backgroundSunCurrent,
            "--background-sun-next": styles.backgroundSunNext,
            "--foreground-sun": styles.foregroundSun,
            "--background-sun-primary": styles.backgroundSunPrimary,
            "--opacity-sun-next": styles.opacitySunNext,
        } as React.CSSProperties
    }, [styles])

    useEffect(() => {
        styles.backgroundSunCurrent = backgroundColor.current
        styles.backgroundSunNext = backgroundColor.next
        styles.backgroundSunPrimary =
            !useSkyEffect ? "white" : sunPosition.altitude > 10 ? "white" : "black"
        styles.opacitySunNext = backgroundColor.nextOpacity
        setStyles({ ...styles })

    }, [backgroundColor]) // TODO: test deps, immediate

    useEffect(() => {
        styles.foregroundSun = foregroundColor
        setStyles({ ...styles })
    }, [foregroundColor]) // TODO: test deps, immediate

    const tick = useCallback(() => {
        setNow(new Date())
    }, [])

    useEffect(() => {
        if (year != now.getFullYear()) setYear(now.getFullYear())
        if (month != now.getMonth()) setMonth(now.getMonth())
        if (day != now.getDate()) setDay(now.getDate())
    }, [now]) // TODO: test deps

    const geolocate = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
        })
    }, [])

    useEffect(() => {
        // TODO: save with store to localStorage
    }, [lng])

    useEffect(() => {
        // TODO: save with store to localStorage
    }, [lat])


    const startTick = useCallback(() => {
        if (tickTask) return

        const newTask = setInterval(tick, tickInterval)
        setTickTask(newTask)
        return newTask
    }, [tickInterval, tick, tickTask])

    const stopTick = useCallback((customTickTask?: NodeJS.Timeout) => {
        clearInterval(customTickTask || tickTask)
        setTickTask(undefined)
    }, [tickTask])

    useEffect(() => {
        const newTickTask = startTick()

        return () => {
            stopTick(newTickTask)
        }
    }, [])





    return (
        <div className="suntimes__wrapper" style={styleForWrapper}>
            <div className="background background__current"></div>
            <div className="background background__next"></div>
            <div className="suntimes__header">
                <h1>Suntimes</h1>
                <div className="suntimes__header__buttons">
                    <button className={'image-icon-wrapper location-settings__button btn ' + (locationSettingsActive ? 'btn--active' : '')}
                        title="Location"
                        onClick={() => openModal(locationSettingsActive ? undefined : Modal.LocationSettings)}
                    >
                        <i className="fas fa-map-marker-alt"></i>
                    </button>
                    <button className={'image-icon-wrapper general-settings__button btn ' + (generalSettingsActive ? 'btn--active' : '')}
                        onClick={() => openModal(generalSettingsActive ? undefined : Modal.GeneralSettings)}
                    >
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </div>
            <div className="suntimes__modals">
                {generalSettingsActive && <div className="suntimes__modals__modal">
                    TODO: implement GeneralSettings!!
                </div>}
                {locationSettingsActive && <div className="suntimes__modals__modal">
                    TODO: implement LocationSettings!!
                </div>}
            </div>
            <div>
                <span>Jelenlegi idő</span>
                <span className="notranslate">{strftime("%Y.%m.%d. %H:%M:%S", now)}</span>
                <br />
                <span>Napfelkelte:</span>
                <span className="notranslate">{
                    strftime("%H:%M:%S", sunTimes.sunrise)
                }</span>
                <br />
                <span>Naplemente:</span>
                <span className="notranslate">{
                    strftime("%H:%M:%S", sunTimes.sunset)
                }</span>
                <br />
                <span>Nap hossza:</span>
                <span className="notranslate">{
                    format_timespan(sunTimes.day_length)
                }</span>
                <br />
                <span>Altitude:</span>
                <span className="notranslate">{sunPosition.altitude.toFixed(3)} deg</span>
                <br />
                <span>Altitude rate:</span>
                <span className="notranslate">{altituderate.toFixed(2)} deg / 5min</span>
                <br />
                <span>Azimuth:</span>
                <span className="notranslate">{sunPosition.azimuth.toFixed(3)} deg</span>
                <br />
                <span>Százalék:</span>
                <span className="notranslate">{percentage.toFixed(3)} %</span>
                <br />
                <div className="progress sunpercentage">
                    <div className="determinate" style={{ width: percentage + '%' }}></div>
                </div>
                <TimeSelector time={now} updateTime={(val) => setNow(val)} onStopTick={() => stopTick()} onGoNow={() => startTick()} />
                <div>TODO: Implement SunGraph</div>
                <div>
                    Sun data by:
                    <a href="https://www.npmjs.com/package/suncalc">https://www.npmjs.com/package/suncalc</a>
                </div>
            </div>
        </div>
    )
}

export default Suntimes