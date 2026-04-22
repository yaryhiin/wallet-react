import React from 'react'
import { Outlet } from 'react-router-dom'

function Container() {
  return (
    <div className="container">
      <Outlet />
    </div>
  )
}

export default Container