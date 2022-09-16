import React from 'react'
import logo from './logo.svg'
import './scss/app.scss'

import {
  RouterProvider
} from "react-router-dom"

import router from "@/router/index"


function App () {
  return (
    <div className='app'>

      {/* <PageHeader @sidebaron="sidebarActive = true"></PageHeader> */}
      <div className="content" /*:class="routeClass"*/>
        <RouterProvider router={router} /*className="container" @set-route-class="setRouteClass($event)" */ />
      </div >
      {/* <PageSidebar @sidebaroff="sidebarActive = false" :active = "sidebarActive" ></PageSidebar> */}
    </div >
  )
}

export default App
