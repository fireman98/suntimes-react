import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./Header.scoped.scss"

const Header: FunctionComponent<{ onSidebaron: () => void }> = ({ onSidebaron }) => {

    const [lastScrollTop, setLastScrollTop] = useState(0)
    const [hidden, setHidden] = useState(false)
    const [ontop, setOntop] = useState(true)

    const headerClassName = useMemo(() => {
        let className = "header"
        if (hidden)
            className += " hidden"
        if (ontop)
            className += " ontop"
        return className
    }, [hidden, ontop])

    const scrollHandler = useCallback(() => {
        setHidden(lastScrollTop < document.documentElement.scrollTop)
        setOntop(!document.documentElement.scrollTop)
        setLastScrollTop(document.documentElement.scrollTop)
    }, [setHidden, setOntop, setLastScrollTop, lastScrollTop])


    useEffect(() => {
        window.addEventListener("scroll", scrollHandler, { passive: true })

        return () => {
            window.removeEventListener("scroll", scrollHandler)
        }
    }, [scrollHandler])

    return (
        <header className={headerClassName}>
            <div className="container">
                <div className="companyName">
                    <Link to="/">Kezdőlap</Link>
                </div>
                <div className="links">
                    <button className="image-icon-wrapper" aria-label="Oldalmenü megnyitása" title="Oldalmenü"
                        onClick={onSidebaron}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </header >
    )
}

export default Header