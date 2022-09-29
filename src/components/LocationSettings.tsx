import useComputed from "@/hooks/useComputed"
import useGeocode from "@/hooks/useGeocode"
import { FunctionComponent, useCallback, useState } from "react"

const LocationSettings: FunctionComponent<{
    lat: number,
    lng: number,
    updateLat: (val: number) => void,
    updateLng: (val: number) => void,
    onGeolocate: () => void
}> = ({ lat = 0, lng = 0, updateLat, updateLng, onGeolocate }) => {

    const Lat = useComputed({
        get () {
            return lat
        },

        set (val) {
            updateLat(val)
        }
    }, [lat])

    const Lng = useComputed({
        get () {
            return lng
        },

        set (val) {
            updateLng(val)
        }
    }, [lng])

    const geolocate = useCallback(() => {
        onGeolocate()
    }, [onGeolocate])

    // Geocoding
    const [address, setAddress] = useState("")
    const [addressDisplay, setAddressDisplay] = useState("")

    const { geocode } = useGeocode()

    /**
    * Geocode address, if successful save coordinates to lat and lng
    */
    const geocodeAndSave = useCallback(async () => {
        try {
            setAddressDisplay("...")
            const place = await geocode(address)
            Lat.value = Number(place.lat)
            Lng.value = Number(place.lon)
            setAddressDisplay(place.display_name)
        } catch (err) {
            setAddressDisplay("Not found")
        }
    }, [Lat, Lng, address, geocode])


    return (
        <div className="position-wrapper">
            <div className="mui-textfield">
                <input id="suntimes-address-input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter a city"
                    onKeyDown={(e) => {
                        if (e.key !== 'Enter')
                            return

                        geocodeAndSave()
                    }} />
                <label htmlFor="suntimes-address-input">Address</label>
                <div className="position__addressDisplay">
                    {addressDisplay}
                </div>
            </div>
            <div className="mui-divider"></div>
            <div className="mui-textfield">
                <input id="suntimes-latitude-input" type="number" value={Lat.value} onChange={e => Lat.value = Number(e.target.value)} />
                <label htmlFor="suntimes-latitude-input">Latitude</label>
            </div>

            <div className="mui-textfield">
                <input id="suntimes-longitude-input" type="number" value={Lng.value} onChange={e => Lng.value = Number(e.target.value)} />
                <label htmlFor="suntimes-longitude-input">Latitude</label>
            </div>

            <button type="button" className="mui-btn mui-btn--primary" onClick={geolocate}>
                Geolocate
            </button>
        </div>
    )
}

export default LocationSettings