import React, { useContext, useEffect, useState } from 'react'
import {  Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { aboutImage } from '../Utility/ImagesPlace';
import { AuthContext } from '../Contexts/AuthContext';
import { Link } from 'react-router-dom';

const About = () => {
  const {userInfo} = useContext(AuthContext)
  const [features, setFeatures] = useState([])
  useEffect(()=>{
    fetch(`${import.meta.env.BASE_URL}aboutCard.json`)
    .then((res)=>{
      return res.json()
    })
    .then((data)=>{
      setFeatures(data)
    })
    .catch((err)=>{
      console.error("Error loading features: ", err)
    })
    .finally(()=>{
        console.log("Call API Ended")
    })
  },[])
  return (
    <div className='bg-white border' style={{borderRadius: "0 0 20px 20px"}}>
      <Row className="align-items-center mb-5 pb-5 ps-5">
        <Col lg={6}>
          {userInfo && (<Breadcrumb className="mb-4  " style={{fontSize: '0.9rem'}}>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>About Us</Breadcrumb.Item>
          </Breadcrumb>
          )}
          <h6 className="pink-color fw-bold text-uppercase mb-3 mt-5">Borcelle</h6>
          <h2 className="fw-bold mb-4" style={{ fontSize: '3rem', color: "#1C1C1C" }}>We provide the best <br /> shopping experience.</h2>
          <p className="gray-800 fs-5 lh-lg">
            Borcelle started with a simple idea: making high-quality products accessible to everyone. 
            We believe that shopping should be fun, easy, and reliable.<br/> Our team works tirelessly 
            to curate the best collections just for you.
          </p>
        </Col>
        <Col lg={6} className="text-center mt-4">
          <div className="about-banner">
            <img 
              src= {aboutImage}
              alt="About Borcelle Online Store" 
              className="img-fluid "
            />
          </div>
        </Col>
      </Row>
      <Row className="g-4 px-5 pb-5">
        {features.map((item) => {
          const IconComponent = Icons[item.iconName];

          return (
            <Col xs={12} sm={6} md={4} key={item.id} className="mb-4 d-flex">
              <div className="custom-animated-card w-100">
                <div className="card-inner-content p-4 text-center">
                  <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    {IconComponent && (
                      <IconComponent size={40} className="pink-color mb-3" />
                    )}
                    <h5 className="fw-bold text-dark mb-3">
                      {item.title}
                    </h5>
                    <p className="text-muted gray mb-0">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  )
}

export default About