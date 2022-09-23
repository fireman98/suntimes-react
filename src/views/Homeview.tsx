import { useMainOutletContext } from "@/App"
import { useState } from "react"

function HomeView () {
    const { setRouteClass } = useMainOutletContext()

    return (
        <div className="about">
            {[...Array(25).keys()].map(x => {
                return (
                    <h1>This is an home page</h1>

                )
            })}
            <h1>This is an home page</h1>
            <button onClick={() => setRouteClass("btn")}>button</button>


        </div>
    )
}

export default HomeView