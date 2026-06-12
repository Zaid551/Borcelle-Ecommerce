import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { ExclamationSquare, Telephone, ExclamationCircle } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router'
import { AuthContext } from '../Contexts/AuthContext'
import { AuthServices } from '../Services/Auth'
import DynamicModal from '../Components/DynamicModal'

const Login = () => {

    const [phoneInfo, setPhone] = useState({"phone": ""})
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState({
      show: false,
      title: '',
      message: '',
      type: 'success'
    });
    const navigate = useNavigate()

    const {userInfo} = useContext(AuthContext)
    useEffect(() => {
      if (localStorage.getItem('userData')) {
        navigate('/')
      }
    }, [navigate, userInfo]);
    
    useEffect(() => {
      if (localStorage.getItem('temp_login')) {
        navigate('/user/verify')
      }
    }, [navigate]);

    const handleLoginSubmit = (e)=>{
        e.preventDefault()
        CallLoginAPI()
    }

    const CallLoginAPI = ()=>{
        setError(null)
        setIsLoading(true)
        AuthServices.login(phoneInfo)
        .then((data)=>{
          localStorage.setItem('temp_login', JSON.stringify(data.data.phone))
          setModalConfig({
            show: true,
            title: 'Successfully...',
            message: 'Login successful. Please send the verification code.',
            type: 'success'
          })
          setTimeout(() => navigate('/user/verify'), 3000);
        })
        .catch((err)=>{
            setError(err)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }
    return (
        <div className='auth-info d-flex flex-column justify-content-center align-items-start px-5'>
            <h5 className='text-dark font-setting fw-medium mb-3'>Welcome!</h5>
            <p className='gray-900 font-setting fw-regular'>Please Log in to continue</p>
            <Form onSubmit={handleLoginSubmit} className='w-100 my-3'>
                <Form.Group >
                  <div className='d-flex align-items-center flex-nowrap p-3 ' style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
                    <Form.Control 
                      type="text" 
                      id="phone"
                      disabled= {isLoading ? "disabled" : ""}
                      className='form-control bg-light border-0 shadow-none '
                      placeholder='Add number'
                      value={phoneInfo.phone}
                      onInput={(e)=>{
                          const value = e.target.value.replace(/\D/g, ""); //To clear the field of any non-numerical inputs
                          if (value.length <= 10) {
                              setPhone({ "phone": value });
                          }
                      }}
                    />
                    <span className="input-group-text bg-light border-0 pe-2">
                        <Telephone className='pink ' style={{ fontSize: '1.5rem' , transform: 'scale(-1,1)'}} />
                    </span>
                  </div>
                  {phoneInfo.phone !== "" &&(
                    <div className='mt-2' style={{ fontSize: '0.85rem' }}>
                      {phoneInfo.phone.length >= 1 && !phoneInfo.phone.startsWith("09") &&(
                        <div className='text-danger mb-1 d-flex align-items-center'><ExclamationCircle size={16} className='me-2'/>The Syrian number must start with 09</div>
                      )}
                      {phoneInfo.phone.length < 10 &&(
                        <div className='text-warning d-flex align-items-center'><ExclamationSquare size={16} className='me-2'/>{10 - phoneInfo.phone.length} digits remaining to complete the Syrian number</div>
                      )}
                    </div>
                  )}
                </Form.Group>
                {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>{error.message}</Alert>}
                <Button 
                    type="submit" 
                    disabled={
                        isLoading || 
                        phoneInfo.phone.length < 10 ||
                        !phoneInfo.phone.startsWith("09")
                    }
                    className='send-btn rounded-2 border-0 pink-bg text-white w-100 py-3 mt-4'>
                    {isLoading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
                    : "Log in"}
                </Button>
            </Form>
            <p className='text-dark font-setting fw-medium mt-3 text-center'>Don't have an account? <span className='pink fw-bold' style={{cursor: "pointer"}} onClick={()=>{navigate("/user/signUp")}}>Create one</span></p>
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

export default Login