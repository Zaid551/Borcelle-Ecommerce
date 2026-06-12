import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Envelope } from 'react-bootstrap-icons'

const Subscribe = () => {
  return (
    <section className='gray-200'>
      <Container>
        <Row className='d-flex justify-content-center py-4'>
          <Col lg={7}>
            <Form className='text-center py-4'> 
              <h5 className="fw-bold">Subscribe to our newsletter</h5> 
              <p className="text-muted">Get daily news on upcoming offers from many suppliers all over the world</p> 
                <div className="bg-transparent subForm d-flex flex-column flex-sm-row justify-content-center align-items-center mx-auto mt-4" style={{ maxWidth: '500px', gap: '15px' }}> 
                <div className="input-group flex-nowrap" style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
                  <span className="input-group-text bg-white border-0 pe-2">
                    <Envelope className='text-secondary' style={{ fontSize: '1.2rem' }} />
                  </span>
                  <input 
                    id="newsletter1" 
                    type="email" 
                    className="form-control bg-white border-0 shadow-none" 
                    placeholder="Email" 
                  /> 
                </div>
                <Button type="submit" className='btn-nonHover rounded-2 border-0 pink-bg text-white px-4 shadow-sm'>
                  Subscribe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Subscribe