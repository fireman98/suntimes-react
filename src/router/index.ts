//import React from "react"
import {
    createBrowserRouter
} from "react-router-dom"
import AboutView from "../views/AboutView"
import HomeView from "../views/Homeview"

// React.lazy(
//     () => import("@/App")
// )

const router = createBrowserRouter([
    {
        path: "/",
        element: HomeView()
    },

    {
        path: "/about",
        element: AboutView()
    }
])

export default router