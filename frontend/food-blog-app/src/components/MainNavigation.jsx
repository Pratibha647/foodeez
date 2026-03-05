import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom' //it basically renders the children compomnents
import Footer from './Footer'

export default function MainNavigation() {
  return (
    <>
        <Navbar/>
        <Outlet/>  
        <Footer/>
    </>
  )
}
