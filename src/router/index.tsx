import {
    createBrowserRouter
} from "react-router-dom"
import App from "@/App"
import { RouteObject } from "react-router-dom"
import { lazy } from "react"
import Error from "@/components/Error"

export interface IRouteObject extends RouteObject {
    name?: string,
    path: string,
    meta?: {
        [key: string]: unknown,
    }
    children?: IRouteObject[]
}

const HomeView = lazy(() => import('../views/HomeView'))
const TimesView = lazy(() => import('@/views/TimesView'))
const AboutView = lazy(() => import('@/views/AboutView'))

const createRouteRecord = (record: IRouteObject): IRouteObject => {
    return {
        errorElement: <Error />,
        ...record
    }
}

export const routes: IRouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            createRouteRecord({
                path: "",
                name: 'home',
                element: <HomeView />,
            }),

            createRouteRecord({
                path: "/times/sun",
                name: 'timesData',
                element: <TimesView />,
            }),

            createRouteRecord({
                path: "/about",
                name: 'about',
                element: <AboutView />,
            })
        ]
    },


]

const router = createBrowserRouter(routes)

export default router