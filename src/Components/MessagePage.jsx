import React, { useContext } from 'react';
import { Container, Row, Col, Form, Button, Breadcrumb } from 'react-bootstrap';
import { SendFill, ChatLeftDotsFill } from 'react-bootstrap-icons';
import { Link } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';

const MessagePage = () => {
  const {userInfo} = useContext(AuthContext)
  const messageTypes = [
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'inquiry', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Issue' },

]
  return (
          <div className='bg-white border' style={{borderRadius: "0 0 20px 20px"}}>
            <div className="text-center mb-3 pt-4">
              {userInfo && (<Breadcrumb className="px-4" style={{fontSize: '0.9rem'}}>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                  Home
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Message Us</Breadcrumb.Item>
              </Breadcrumb>
              )}
              <div className="icon-circle mb-3 mx-auto">
                <ChatLeftDotsFill size={30} className="pink-color" />
              </div>
              <h2 className="fw-bold">We Value Your Feedback</h2>
              <p className="text-muted">Whether it's a suggestion, a complaint, or a question—we're listening.</p>
            </div>

            <Form className='p-4'>
              <Row>
                <Col md={12} className="mb-4">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Message Type</Form.Label>
                    <Form.Select className="custom-input custom-select shadow-0">
                      {messageTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-4">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Your Name</Form.Label>
                    <Form.Control type="text" placeholder="Alexa Rawlex" className="custom-input-message shadow-none" />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-4">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Order Number (Optional)</Form.Label>
                    <Form.Control type="text" placeholder="#12345" className="custom-input-message shadow-none" />
                  </Form.Group>
                </Col>

                <Col md={12} className="mb-4">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Details</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      placeholder="Please describe your suggestion or complaint in detail..." 
                      className="custom-input-message shadow-none " 
                    />
                  </Form.Group>
                </Col>

                <Button className="pink-bg btn-nonHover w-100 py-3 fw-bold send-btn border-0 d-flex align-items-center justify-content-center gap-2">
                  <SendFill size={18} />
                  Submit Feedback
                </Button>
              </Row>
            </Form>
          </div>
  );
};

export default MessagePage;