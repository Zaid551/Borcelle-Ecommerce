import React from 'react'
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap'

const Quote = () => {
  return (
    <section>
  <Container className='quote mt-3 border rounded-2 overflow-hidden p-0'>
    <Row className='g-0 h-100 align-items-center'>
      <Col lg={7} md={12} className='p-4 p-lg-5'>
        <div className='text-light position-relative z-3'>
          <h2 className='fw-semibold'>An easy way to send<br/> requests to all suppliers</h2>
          <p className="d-none d-lg-block">Lorem ipsum dolor sit amet, consectetur adipisicing<br/> elit, sed do eiusmod tempor incididunt.</p>
          <Button className='btn-nonHover rounded-2 border-0 pink-bg text-white my-3 d-lg-none d-block'>
            Send inquiry
          </Button>
        </div>
      </Col>
      <Col lg={5} className='d-none d-lg-block p-4'>
        <div className='bg-white p-4 border rounded-2 shadow position-relative z-3'>
          <h5 className='text-black mb-3'>Send quote to suppliers</h5>
          <Form>
            <Form.Group className="mb-3" controlId="color">
              <Form.Control type="text" placeholder="What item you need?" />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" rows={3} placeholder='Type more details' />
            </Form.Group>
            
            <div className="d-flex gap-2 mb-3">
              <Form.Control type="number" placeholder="Quantity" className='w-50'/>
              <Form.Select className='w-50'>
                <option>Pcs</option>
                <option value="1">One</option>
              </Form.Select>
            </div>

            <Button type="submit" className='btn-nonHover rounded-2 border-0 pink-bg text-white w-auto px-4'>
              Send inquiry
            </Button>
          </Form>
        </div>
      </Col>
      
    </Row>
  </Container>
</section>
  )
}

export default Quote