import React from 'react'
import MyWebsiteNavbar from '../Components/MyWebsiteNavbar'
import SecondaryNavbar from '../Components/SecondaryNavbar'
import MyWebsiteFooter from '../Components/MyWebsiteFooter'
import { Col, Container, Row } from 'react-bootstrap'
import { CaretLeftFill } from 'react-bootstrap-icons'

const ProfileLayout = ({children , showBanner= false, showSecondaryNavbar = true, showSubscribe = true, showContent = true, title}) => {
  return (
    <>
      <header>
        <MyWebsiteNavbar />
        {showSecondaryNavbar && <SecondaryNavbar />}
      </header>
      <main className='bg-light'>
        <section className="py-5">
          <Container>
            <Row>
              <Col lg="12">
                <div className="header-banner" style={{borderRadius: '8px 8px 0 0'}}>
                  {showContent && 
                  <div className='d-flex align-item-center p-4 '>
                    <CaretLeftFill  style={{ fontSize: '40px' }} className="text-white me-3" />
                    <h4 className="text-white fw-regular pt-2" >{title}</h4>
                  </div>}
                </div>
              </Col>
              <Col lg="12" className=''>
                {children}
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <footer >
        <MyWebsiteFooter showSubscribe={showSubscribe} showBanner= {showBanner}/> 
      </footer>
    </>
  )
}
export default ProfileLayout