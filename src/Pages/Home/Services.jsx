import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import {AirplaneEngines, Search, ShieldShaded, ShopWindow } from 'react-bootstrap-icons';
import { service1, service2, service3, service4 } from '../../Utility/ImagesPlace';
const Services = () => {
  const items = [
    { id: 1, title: 'Source from Industry Hubs', img: service1, icon: Search},
    { id: 2, title: 'Customize Your Products', img: service2, icon: ShopWindow},
    { id: 3, title: 'Fast, reliable shipping by ocean or air', img: service3, icon :AirplaneEngines},
    { id: 4, title: 'Product monitoring and inspection', img: service4, icon: ShieldShaded},
  ];
  return (
    <section>
      <Container className='mt-3'>
        <h4 className="fw-semibold mb-3">Our extra services</h4>
        <Row className="g-3">
          {items.map((item) => {
            const IconTag = item.icon;
            return (
              <Col lg={3} md={6} sm={12} key={item.id}>
                <div className="card service-card h-100 border-1 shadow-sm">
                  <div className="position-relative">
                    <img src={item.img} alt={item.title} className="w-100" />
                    <div className="icon-service shadow-sm">
                      <IconTag size={20} className="text-dark" />
                    </div>
                  </div>
                  <div className="card-body pt-4">
                    <p className="fw-medium mb-0">
                      {item.title}
                    </p>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>

  )
}

export default Services