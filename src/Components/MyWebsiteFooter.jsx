import React, { useEffect, useState } from 'react'
import {Row, Col, Container, ButtonGroup, Button } from 'react-bootstrap'
import { Apple, Facebook, GooglePlay, Instagram, Linkedin, Twitter, Youtube } from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link } from "react-router-dom"
import {  logo } from '../Utility/ImagesPlace';
import Subscribe from './Subscribe';

const MyWebsiteFooter = ({showSubscribe = true, showBanner = true}) => {
  const [footerSections, setFooterSections] = useState([]) 
  useEffect(()=>{
    fetch(`${import.meta.env.BASE_URL}footerSection.json`)
    .then((res)=>{
      return res.json()
    })
    .then((data)=>{
      setFooterSections(data)
    })
    .catch((err)=>{
      console.error("Error loading Footer Section: ", err)
    })
    .finally(()=>{
        console.log("Call API Ended")
    })
  },[])
  return (
      < >
        {showSubscribe && <Subscribe/>}
        {showBanner && (<section className="py-4">
          <Container >
            <Row className="g-0 overflow-hidden shadow-sm" style={{ borderRadius: "8px 25px 25px 8px" }}>
              <Col lg={7} md={6} className="position-relative" style={{ backgroundColor: "#D04462" }}>
                <div className="p-4 text-white d-flex flex-column justify-content-center h-100" style={{ zIndex: 2, position: 'relative' }}>
                  <h4 className="fw-semibold mb-1">Super discount on more than 100 USD</h4>
                  <p className="mb-0 opacity-75">Have you ever finally just write dummy info</p>
                </div>
                <div className="position-absolute top-0 end-0 h-100" style={{ zIndex: 1}}>
                  <svg 
                    width="110%" 
                    height="110%" 
                    viewBox="0 0 209 631" 
                    fill="none" 
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'block' }}
                  >
                    <path d="M209 0H0L209 631V0Z" fill="#9D2740"/>
                  </svg>
                </div>
              </Col>
              <Col lg={5} md={6} style={{ backgroundColor: "#9D2740" }} className="d-flex align-items-center justify-content-center p-4">
                <Button 
                  className="fw-bold border-0 shadow-sm px-4 py-2" 
                  style={{ backgroundColor: "#FF9017", color: "white" }} >
                  Shop now
                </Button>
              </Col>
            </Row>
          </Container>
        </section>)}
        <section className="pt-5 bg-white border-top">
          <Container>
            <Row> 
              <Col md="3" className='mb-3'> 
                <div>
                  <img src={logo} alt="Borcelle" className="mb-3" style={{ maxWidth: '150px' }} />
                  <p className="text-muted small">Your one-stop shop for everything. Quality products, fast delivery.</p>
                  <ul className="list-unstyled d-flex mt-3">
                    {[ 
                      { icon: <Facebook />, link: "https://facebook.com" },
                      { icon: <Twitter />, link: "https://twitter.com" },
                      { icon: <Linkedin />, link: "https://linkedin.com" },
                      { icon: <Instagram />, link: "https://instagram.com" },
                      { icon: <Youtube />, link: "https://youtube.com" }
                    ].map((social, index) => (
                      <li key={index} className={index === 0 ? "" : "ms-3"}>
                        <a href={social.link} target="_blank" rel="noreferrer" className="text-secondary social-icon">
                          {social.icon}
                        </a>
                      </li>
                    ))}
                  </ul> 
                </div>
              </Col>
              {footerSections.map((section, idx) => (
                <Col md="2" key={idx} className='mb-3'> 
                  <h6 className='fw-bold text-dark mb-3'>{section.title}</h6>
                  <ul className="nav flex-column"> 
                    {section.links.map((link, lIdx) => (
                      <li key={lIdx} className="nav-item mb-2">
                        <Link 
                          to={link.path} 
                          className="nav-link p-0 text-muted footer-link">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul> 
                </Col> 
              ))}
              <Col md="1" className='mb-3'>
                <h6 className='fw-bold text-dark mb-3'>Get app</h6> 
                <div className="d-flex flex-column gap-2">
                  <a href="https://apple.com" target="_blank" rel="noreferrer" className="app-button-modern">
                    <Apple className='fs-4 me-2' />
                    <div className="text-start text-nowrap" style={{ lineHeight: '1.2' }}>
                      <small className="d-block">Download on</small>
                      <span className="fw-bold">App Store</span>
                    </div>
                  </a>
                  <a href="https://play.google.com" target="_blank" rel="noreferrer" className="app-button-modern">
                    <GooglePlay className='fs-4 me-2' />
                    <div className="text-start text-nowrap" style={{ lineHeight: '1.2' }}>
                      <small className="d-block">Get it on</small>
                      <span className="fw-bold text-uppercase">Google Play</span>
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section className='gray-200'>
          <Container>
            <Row>
              <Col lg="12">
                <div className="d-flex flex-sm-row align-item-center justify-content-between pt-3 border-top"> 
                  <p className='copy'>©2026 Borcelle. </p> 
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </>
  )
}

export default MyWebsiteFooter