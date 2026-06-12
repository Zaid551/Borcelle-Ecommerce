import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Col, Row, Breadcrumb } from 'react-bootstrap'
import { faqImg } from '../Utility/ImagesPlace'
import { AuthContext } from '../Contexts/AuthContext'
import { Link } from 'react-router'

const Faq = () => {
    const {userInfo} = useContext(AuthContext)
    const [faq, setFaq] = useState([])
    useEffect(()=>{
        fetch("/faq.json")
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        setFaq(data)
      })
      .catch((err)=>{
        console.error("Error loading FAQ: ", err)
      })
      .finally(()=>{
          console.log("Call API Ended")
      })
    },[])
  return (
    <div className='bg-white border' style={{borderRadius: "0 0 20px 20px"}}>
      <Row className='align-items-center mb-5 pb-5 ps-5'>
        <Col lg={12}>
          {userInfo && (<Breadcrumb className="pt-3" style={{fontSize: '0.9rem'}}>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>FAQ</Breadcrumb.Item>
          </Breadcrumb>
          )}
        </Col>
        <Col lg={6}>
          <h2 className="fw-bold pb-3 pt-3">Frequently Asked Questions</h2>
          <Accordion className="custom-faq mt-5">
            {faq.map((item) => (
              <Accordion.Item eventKey={item.id} key={item.id} className="mb-3 border-1 rounded-3 overflow-hidden" style={{backgroundColor: "#F9F9F9"}}>
                <Accordion.Header className="fw-semibold px-4">
                  <span className="fs-5" style={{ color: '#333' }}>{item.question}</span>
                </Accordion.Header>
                <Accordion.Body className="gray-800 lh-lg ">
                  {item.answer}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
        <Col lg={6} className="text-center mt-4">
          <div className="faq-banner">
            <img 
              src= {faqImg}
              alt="FAQ Borcelle" 
              className="img-fluid pt-5"
              style={{width: "100%", height: "100%", objectFit: "contain"}}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Faq