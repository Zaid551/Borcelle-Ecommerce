import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Suppliers = () => {
  
  const [flagsItems, setFlagsItems] = useState([])
  useEffect(()=>{
    fetch(`${import.meta.env.BASE_URL}flags.json`)
    .then( res => {return res.json()})
    .then( data => setFlagsItems(data))
    .catch( err => console.error("Error loading flags items: ", err))
    .finally(() => console.log("API CALL ENDED"))
  },[])
  return (
    <section className='py-3 d-none d-lg-block'>
      <Container>
        <h4 className="fw-semibold mb-3">Suppliers by region</h4>
        <Row className="g-3">
          {flagsItems.map((item) => (
            <Col key={item.id} lg={3} className="supplier-col">
              <div className="d-flex flex-wrap align-items-center bg-transparent gap-2">
                <div className='supplier-image me-2'>
                  <img src={item.img} alt={item.title} style={{width:"28px", height: "20px"}}/>
                </div>
                <div className="text-start supp-info">
                  <h6 className="text-dark mb-1">{item.title}</h6>
                  <p className="gray-500 mb-0">{item.link}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default Suppliers