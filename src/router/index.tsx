import {
    createBrowserRouter
} from "react-router-dom"
import TimesView from "@/views/TimesView"
import AboutView from "../views/AboutView"
import HomeView from "../views/HomeView"
import App from "@/App"
import { RouteObject } from "react-router-dom"

// React.lazy(
//     () => import("@/App")
// )

// TODO dynamic load

export interface IRouteObject extends RouteObject {
    name?: string,
    path: string,
    meta?: {
        [key: string]: unknown,
    }
    children?: IRouteObject[]
}

export const routes: IRouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                name: 'home',
                element: <HomeView />,
            },

            {
                path: "/times/sun",
                name: 'timesData',
                element: <TimesView />
            },

            {
                path: "/about",
                name: 'about',
                element: <AboutView />
            }
        ]
    },


]

const router = createBrowserRouter(routes)

export default router