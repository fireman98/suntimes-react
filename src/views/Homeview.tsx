import { useMainOutletContext } from "@/App"
import Suntimes from "@/components/Suntimes"

function HomeView () {
    const { setRouteClass } = useMainOutletContext()

    return (
        <div className="view__home">
            <Suntimes onSetRouteClass={(className: string) => setRouteClass(className)} />
        </div>
    )
}

export default HomeView