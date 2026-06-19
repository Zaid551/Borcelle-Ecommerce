import React from 'react'
import { mtnIcon, syriatelIcon, whiteLogo } from '../Utility/ImagesPlace'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router'
import { ArrowCounterclockwise } from 'react-bootstrap-icons'
import MyWebsiteNavbar from '../Components/MyWebsiteNavbar'
import { useCart } from '../Contexts/CartContext'
const AuthLayout = ({children}) => {
  const { couponCode, setCouponCode, applyCoupon } = useCart();
  const location = useLocation()
  const cartPage = location.pathname === "/user/checkout"
  return (
        <>
      {cartPage && (<header><MyWebsiteNavbar/></header>)}
      <main>
        <Container fluid>
          <Row>
            <Col lg="6" className='auth-left'>
              <div className='auth-info d-flex flex-column justify-content-center align-items-center'>
                
                {cartPage
                ? (<div className='form-payment text-start w-100 px-lg-5 px-3 py-4' >
                    <h3 className='font-setting' style={{fontSize: "22px"}}>Payment Method</h3>
                    <p className='font-setting' style={{fontSize: "18px"}}>Pick your payment method </p>
                    <Form>
                      <div className="payment-grid mb-3">
                        {[
                          { id: 'way-1', label: 'Cash', icon: null },
                          { id: 'way-2', label: 'Syriatel', icon: syriatelIcon },
                          { id: 'way-3', label: 'MTN', icon: mtnIcon }
                        ].map((item, index) => (
                          <Form.Group key={item.id} className='payment-box d-flex align-items-center justify-content-between p-2 mb-2 rounded-2'>
                            <Form.Label htmlFor={item.id} className="d-flex align-items-center gap-2 mb-0 text-white cursor-pointer flex-grow-1">
                              {item.icon && <img src={item.icon} alt={item.label} style={{ width: '20px' }} />}
                              <span style={{ fontSize: '18px' }}>{item.label}</span>
                            </Form.Label>
                            <Form.Check
                              type="radio"
                              name="paymentWays"
                              id={item.id}
                              value={index + 1}
                              className="custom-radio"
                            />
                          </Form.Group>
                        ))}
                      </div>

                      <div className='discount-mini-box p-2 rounded-2 bg-transparent d-flex align-items-center'>
                        <div className="flex-grow-1">
                          <Form.Control
                            type='text'
                            id='discountCode'
                            placeholder='Discount Code'
                            className='border-0 shadow-none py-2 '
                            style={{ fontSize: '13px' }}
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                        </div>
                        <Button onClick={applyCoupon} className='bg-white pink-color border-0 py-1 px-3 ms-2  btn-check-hover'
                          ><ArrowCounterclockwise/> Check
                        </Button>
                      </div>
                      
                    </Form>
                  </div>)
                : (<>
                  <img src={whiteLogo} alt="Borcelle Online Store" className='auth-image' />
                  <div className='auth-text'>
                    <h1 className='font-setting '>Let’s get started</h1>
                    <p className='font-setting'>Where opportunities meet simplicity!<br/>
                        Whether you’re here to fill out your 
                        <br className='d-none d-lg-block'/> cart <br />
                        or to check irresistible offers.
                    </p>
                  </div>
                </>)}
              </div>
            </Col>
            <Col lg="6" className='auth-right bg-light mt-lg-0 mt-5'>
              {children}
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default AuthLayout