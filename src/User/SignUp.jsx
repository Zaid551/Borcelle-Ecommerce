import { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { Envelope, Image, PersonCircle, Telephone, ExclamationCircle, ExclamationSquare } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router'
import { AuthServices } from '../Services/Auth'
import DynamicModal from '../Components/DynamicModal'

const SignUp = () => {
  const navigate = useNavigate()
  const [registerData, setRegisterData] = useState({
          "name": "",
          "phone": "",
          "email": "",
          "image": null
          
      }
  )
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null)
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });
    
  const handleRegisterSubmit = (e)=>{
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    AuthServices.register(registerData)
    .then((data)=>{
      console.log(data)
      setModalConfig({
        show: true,
        title: 'Successfully...',
        message: 'Your account has been successfully created, please log in.',
        type: 'success'
      })
      setTimeout(() => navigate("/user/login"), 3000);
    })
    .catch((err)=>{
        setError(err)
    })
    .finally(()=>{
        setIsLoading(false)
    })
  }
const [preview, setPreview] = useState(null); 

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setRegisterData({
            ...registerData,
            "image": file
        });
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        console.log("Preview URL:", objectUrl);
    }
    if (preview) URL.revokeObjectURL(preview);
};
    return (
        <div className='auth-info d-flex flex-column justify-content-center align-items-start px-5 mt-3'>
            <h5 className='text-dark font-setting fw-medium mb-3'>Fill your information</h5>
            <p className='gray-900 font-setting fw-regular'>Enter your details</p>
            <Form onSubmit={handleRegisterSubmit}  className='w-100 my-3'>
                <Form.Group className='mb-4'>
                    <div className='d-flex flex-column align-items-center'>
                        <label 
                            htmlFor="image-profile" 
                            className="d-flex align-items-center justify-content-center rounded-2 border overflow-hidden bg-light"
                            style={{ 
                                width: '148px', 
                                height: '148px', 
                                cursor: 'pointer',
                                position: 'relative',
                                border: '2px dashed #dee2e6' 
                            }}>
                            {preview ? (
                                <img 
                                    src={preview} 
                                    alt="preview" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                <Image className="pink-color" style={{ fontSize: '3rem' }}/>
                            )
                        }
                        </label>
                        <Form.Control
                            id='image-profile'
                            type='file'
                            className='d-none' 
                            accept='image/png, image/jpeg'
                            onChange={handleImageChange}
                            disabled={isLoading} 
                        />
                        
                        <Form.Label className="mt-2" style={{color: "#5C5C5C", cursor: 'pointer'}} htmlFor="image-profile">
                            {preview ? "Change Photo" : "Add Photo (Optional)"}
                        </Form.Label>
                    </div>
                </Form.Group>
                <Form.Group className='mb-4' >
                    <div className='d-flex align-items-center flex-nowrap p-3' style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
                        <Form.Control 
                            type="text" 
                            id="userName"
                            className='form-control bg-light border-0 shadow-none '
                            placeholder='Full Name...'
                            disabled={isLoading}
                            onInput={(e)=>{
                                const value = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g,"");
                                setRegisterData({
                                    ...registerData,
                                    "name":  value
                                })
                            }}
                        />
                        <span className="input-group-text bg-light border-0 pe-2">
                            <PersonCircle className='pink' style={{ fontSize: '1.5rem' }} />
                        </span>
                    </div>
                    {registerData.name !== "" && registerData.name.trim().length < 6 && (
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
                            className='form-control bg-light border-0 shadow-none '
                            placeholder='Email'
                            disabled={isLoading}
                            onInput={(e)=>{
                                setRegisterData({
                                    ...registerData,
                                    "email" : e.target.value
                                })
                            }}
                        />
                        <span className="input-group-text bg-light border-0 pe-2">
                            <Envelope className='pink' style={{ fontSize: '1.5rem'}} />
                        </span>
                    </div>
                    {registerData.email !== "" && !/\S+@\S+\.\S+/.test(registerData.email) && (
                        <div className='mt-2 text-danger d-flex align-items-center' style={{ fontSize: '0.85rem' }}>
                            <ExclamationCircle size={16} className='me-2'/>Please enter a valid email address (e.g., name@example.com)
                        </div>
                    )}
                </Form.Group>
                <Form.Group className='mb-4'>
                    <div className='d-flex align-items-center flex-nowrap p-3' style={{ border: '1px solid #dee2e6', borderRadius: '6px', overflow: 'hidden' }}>
                        <Form.Control 
                            type="text" 
                            id="phone"
                            className='form-control bg-light border-0 shadow-none '
                            placeholder='Add number'
                            disabled={isLoading}
                            value={registerData.phone}
                            onInput={(e)=>{
                                const value = e.target.value.replace(/\D/g, "").slice(0, 10); //To clear the field of any non-numerical inputs and make them only 10 numbers
                                setRegisterData({...registerData, phone: value});
                            }}
                        />
                        <span className="input-group-text bg-light border-0 pe-2">
                            <Telephone className='pink' style={{ fontSize: '1.5rem' , transform: 'scale(-1,1)'}} />
                        </span>
                    </div>
                    {registerData.phone !== "" &&(
                        <div className='mt-2' style={{ fontSize: '0.85rem' }}>
                            {registerData.phone.length >= 1 && !registerData.phone.startsWith("09") &&(
                                <div className='text-danger mb-1 d-flex align-items-center'><ExclamationCircle size={16} className='me-2'/>The Syrian number must start with 09</div>
                            )}
                            {registerData.phone.length < 10 &&(
                                <div className='text-warning d-flex align-items-center'><ExclamationSquare size={16} className='me-2'/>{10 - registerData.phone.length} digits remaining to complete the Syrian number</div>
                            )}
                        </div>
                    )}
                </Form.Group>
                {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>{error.message}</Alert>}
                <Button 
                type="submit"
                disabled={
                    isLoading || 
                    registerData.name.trim().length < 6 || 
                    !/\S+@\S+\.\S+/.test(registerData.email) || 
                    registerData.phone.length < 10 ||
                    !registerData.phone.startsWith("09")
                } 
                className='btn-nonHover send-btn rounded-2 border-0 pink-bg text-white w-100 py-3 mt-4'>
                    
                    {isLoading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span><i>Saving...</i></>
                    : "Save"}
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

export default SignUp