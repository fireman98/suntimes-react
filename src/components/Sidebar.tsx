import { FunctionComponent, useMemo, useRef, useState } from "react"
import "./Sidebar.scoped.scss"
import { IRouteObject, routes } from "@/router/index"
import { Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

//Define additional routes that not belong to the application
const additional_routes = [
    {
        name: "Github",
        path: "https://github.com/fireman98/suntimes-vue",
    },
]

const getTitle = (route: IRouteObject): string => {
    if (!(typeof route === "object" && route !== null)) return "Invalid input"

    if (route.meta && typeof route.meta.title === 'string' && route.meta.title) return route.meta.title

    if (route.name) return route.name

    if (route.path) return route.path

    return ""
}

const Sidebar: FunctionComponent<{
    active: boolean,
    onSidebaroff: () => void
}> = ({ active, onSidebaroff }) => {

    const routesToShow = useMemo(() => routes.length > 0 && routes[0].children ? routes[0].children : [], [])

    const nodeRef = useRef(null)
    const [showOverlay, setShowOverlay] = useState(active)

    return (
        <nav className="sidebar-wrapper">
            <div className={'sidebar ' + (active ? 'active' : '')}>
                <div>
                    <ul>
                        {/* TODO: activeClass */}
                        {routesToShow.map(link => {
                            return (
                                <li key={link.path} onClick={() => onSidebaroff()}>
                                    <Link to={link.path}>
                                        {getTitle(link)}
                                    </Link>
                                </li>
                            )
                        })}
                        {additional_routes.map(link => {
                            return (
                                <li key={link.path}>
                                    <a href={link.path}>{link.name}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div >

            <CSSTransition
                in={active}
                nodeRef={nodeRef}
                classNames='fade'
                timeout={800}
                onEnter={() => setShowOverlay(true)}
                onExited={() => setShowOverlay(false)}
            >
                <div ref={nodeRef} className={'overlay ' + (active || showOverlay ? '' : 'v-hidden')} onClick={() => onSidebaroff()}></div>
            </CSSTransition>


        </nav >
    )
}

export default Sidebar