import React, { useContext, useState, useEffect } from 'react'
import { Alert, Button, Form, Spinner, Breadcrumb } from 'react-bootstrap'
import { ChatSquareText, Envelope, PersonCircle, ExclamationCircle, ChatLeftDotsFill } from 'react-bootstrap-icons'
import { AuthContext } from '../Contexts/AuthContext';
import DynamicModal from '../Components/DynamicModal';
import { AuthServices } from '../Services/Auth';
import { Link } from 'react-router-dom';

const Contact = () => {
  const { userInfo } = useContext(AuthContext);
  const [error, setError] = useState(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    type: "EMAIL",  // EMAIL, PHONE,
    email: "", 
    message: ""
  })
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if(userInfo?.data){
      setContactForm( prev => ({
        ...prev,  
        name : userInfo?.data.name || "",
        email: userInfo?.data.email || ""
      }))
    }
  }, [userInfo])
  const handleContactSubmit = (e)=>{
    e.preventDefault()
    setIsLoading(true);

    AuthServices.contactUs(contactForm)
    .then(() => {
      setModalConfig({
        show: true,
        title: 'Successfully...',
        message: 'Message sent successfully!',
        type: 'success'
      })
      setContactForm({...contactForm, message : ""})
    })
    .catch((err) => {
      setModalConfig({
        show: true,
        title: 'Opps!!!',
        message: err,
        type: 'warning'
      })
      setError(err.message)
    })
    .finally(() => {
        setIsLoading(false);
    });
  }
    const [modalConfig, setModalConfig] = useState({
      show: false,
      title: '',
      message: '',
      type: 'success'
    });
  return (
    <div className='bg-white border' style={{borderRadius: "0 0 20px 20px"}}>
      <div className="text-center mb-3 pt-4">
        {userInfo && (<Breadcrumb className="px-4" style={{fontSize: '0.9rem'}}>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Contact Us</Breadcrumb.Item>
        </Breadcrumb>
        )}
        <div className="icon-circle mb-3 mx-auto">
          <ChatLeftDotsFill size={30} className="pink-color" />
        </div>
        <h2 className="fw-bold">Contact Us</h2>
        <p className="text-muted">We would be happy to hear from you at any time...</p>
      </div>
      
      <Form onSubmit={handleContactSubmit}  className='w-100 px-5 py-3'>        
        <Form.Group className='mb-4' >
          <div className='d-flex align-items-center flex-nowrap p-3' style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
              <Form.Control 
                  type="text" 
                  id="userName"
                  readOnly={!!userInfo}
                  disabled={isLoading ? "disabled" : ""}
                  value={contactForm.name}
                  onChange={(e)=>{
                    setContactForm({
                      ...contactForm,
                      name : e.target.value
                    })
                  }}
                  className={`form-control border-0 shadow-none ${userInfo ? 'bg-light' : ''}`}
                  placeholder='Full Name...'
                  required/>
              <span className="input-group-text bg-white border-0 pe-2">
                  <PersonCircle className='pink' style={{ fontSize: '1.5rem' }} />
              </span>
          </div>
          {contactForm.name !== "" && contactForm.name.trim().length < 6 && (
            <div className='mt-2 text-danger d-flex align-items-center' style={{ fontSize: '0.85rem' }}>
                <ExclamationCircle size={16} className='me-2'/>Name must be at least 6 characters long
            </div>
          )}
        </Form.Group>
        <Form.Group className='mb-4'>
          <div className='d-flex align-items-center flex-nowrap p-3' style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
            <Form.Control 
              type="email" 
              id="email"
              disabled={isLoading ? "disabled" : ""}
              readOnly={!!userInfo}
              value={contactForm.email}
              onChange={(e)=>{
                setContactForm({
                  ...contactForm,
                  email : e.target.value
                })
              }}
              className={`form-control border-0 shadow-none ${userInfo ? 'bg-light' : ''}`}
              placeholder='Email'
              required/>
            <span className="input-group-text bg-white border-0 pe-2">
              <Envelope className='pink' style={{ fontSize: '1.5rem'}} />
            </span>
          </div>
          {contactForm.email !== "" && !/\S+@\S+\.\S+/.test(contactForm.email) && (
            <div className='mt-2 text-danger d-flex align-items-center' style={{ fontSize: '0.85rem' }}>
              <ExclamationCircle size={16} className='me-2'/>Please enter a valid email address (e.g., name@example.com)
            </div>
          )}
        </Form.Group>
        <Form.Group className='mb-4'>
            <div className='d-flex align-items-center flex-nowrap p-3' style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
              <Form.Control 
              as="textarea" 
              placeholder='Write Message'
              disabled={isLoading ? "disabled" : ""}
              value={contactForm.message}
              onChange={(e)=>{
                setContactForm({
                  ...contactForm,
                  message : e.target.value
                })
              }}
              className='border-0 shadow-none' 
              rows={6} 
              required 
              maxLength={65000}/>
              <span className="input-group-text bg-white border-0 pe-2">
                <ChatSquareText className='pink' style={{ fontSize: '1.5rem'}} />
              </span>
            </div>
        </Form.Group>
        {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>{error}</Alert>}
        
        <Button 
          type="submit"
          disabled={isLoading ||
            !/\S+@\S+\.\S+/.test(contactForm.email)|| 
            contactForm.name.trim().length < 6 || 
            !contactForm.message.trim()}
          className='send-btn rounded-2 border-0 pink-bg text-white w-100 py-3 mt-4'>
            {isLoading ? <> <Spinner size="sm" /> Sending</> : "Send Message"}
        </Button>
      </Form>
        <DynamicModal 
          show= {modalConfig.show}
          handleClose={() => setModalConfig({ ...modalConfig, show: false })}
          title = {modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
        />
    </div>
  )
}

export default Contact