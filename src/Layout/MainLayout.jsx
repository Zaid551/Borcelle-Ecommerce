import React from 'react'
import MyWebsiteFooter from '../Components/MyWebsiteFooter'
import MyWebsiteNavbar from '../Components/MyWebsiteNavbar'
import SecondaryNavbar from '../Components/SecondaryNavbar'

const MainLayout = ({children, showBanner = true ,showSecondaryNavbar = true, showSubscribe = true, showContent = true}) => {
  return (
    <>
      <header >
        <MyWebsiteNavbar showContent= {showContent}/>
        {showSecondaryNavbar && <SecondaryNavbar />}
      </header>
      <main className='bg-light'>
        {children}
      </main>
      <footer className='bg-light'>
        <MyWebsiteFooter showSubscribe={showSubscribe} showBanner= {showBanner}/> 
      </footer>
    </>
  )
}

export default MainLayout