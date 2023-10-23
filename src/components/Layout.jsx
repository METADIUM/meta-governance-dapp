import React from 'react'
import Header from '../components/Header'
import Footer from './Footer'

const Layout = ({ children, activate }) => {
  return (
    <>
      <Header activate={activate} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
