import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './scss/app.scss'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { Outlet, useOutletContext } from 'react-router-dom'

import store from "@/store/configureStore"
import { Provider } from 'react-redux'

type ContextType = { setRouteClass: React.Dispatch<React.SetStateAction<string>> }

const unfocusButtonIfnotKeyboard = () => {
  //Blur active element if clicked or touched, but not if interacted by keyboard or accessibility tools
  const focused = document.activeElement

  if (!focused || !(focused instanceof HTMLElement)) return

  const tagnames = ["button"]
  if (!tagnames.includes(focused.tagName.toLowerCase())) return

  focused.blur()
}

const App = () => {
  const [sidebarActive, setSidebarActive] = useState(false)
  const [routeClass, setRouteClass] = useState("")

  useEffect(() => {
    window.addEventListener("mouseup", unfocusButtonIfnotKeyboard)
    window.addEventListener("touchend", unfocusButtonIfnotKeyboard)

    return () => {
      window.removeEventListener("mouseup", unfocusButtonIfnotKeyboard)
      window.removeEventListener("touchend", unfocusButtonIfnotKeyboard)
    }
  }, [])

  return (
    <Provider store={store}>
      <div className='app'>
        <Header onSidebaron={() => {
          setSidebarActive(true)
        }}></Header>
        <div className={'content ' + routeClass}>
          <div className="container">
            <Outlet context={{ setRouteClass }} />
          </div>
        </div >
        <Sidebar onSidebaroff={() => {
          setSidebarActive(false)
        }} active={sidebarActive}></Sidebar>
      </div >
    </Provider>
  )
}

export function useMainOutletContext () {
  return useOutletContext<ContextType>()
}

export default App
