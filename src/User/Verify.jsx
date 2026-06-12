import { useContext, useEffect, useState } from 'react'
import {Form, Button, Toast, ToastContainer } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import OTPInput, { ResendOTP } from "otp-input-react";
import DynamicModal from '../Components/DynamicModal';
import { AuthContext } from '../Contexts/AuthContext';
import { AuthServices } from '../Services/Auth';
import { useCart } from '../Contexts/CartContext';

const Verify = () => {
    const { syncCartWithServer } = useCart();
    
    const [modalConfig, setModalConfig] = useState({
        show: false,
        title: '',
        message: '',
        type: 'success'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    const [tempUser, setTempUser] = useState()
    const [OTP, setOTP] = useState("");
    const [OtpPayLoad, setOtpPayLoad] = useState( {"phone": "", "otp": ""} )
    const navigate = useNavigate()
    const { updateUserData } = useContext(AuthContext);

    useEffect(()=>{
        const storedPhone = localStorage.getItem('temp_login')
        if(storedPhone) {
            setTempUser(storedPhone)
            setOtpPayLoad(
                {
                    ...OtpPayLoad,
                    "phone": storedPhone.replace(/['"]/g, '') // to remove extra qoutations or double qoutations from localStorage value 
                }
            )
        }else{
            navigate('/user/login');
        }
    }, [])

    useEffect(()=>{
        if(OTP.length === 5) {
            setOtpPayLoad(
                {
                    ...OtpPayLoad,
                    "otp": OTP
                }
            )
        }
    }, [OTP])

    const callVerifyAPI = ()=>{
        setError(null)
        setIsLoading(true)
        console.log(OtpPayLoad)
        AuthServices.verify(OtpPayLoad)
        .then(async(data)=>{
            localStorage.setItem('userData', JSON.stringify(data))
            updateUserData(data)
            localStorage.removeItem('temp_login')
            await syncCartWithServer();
            setTimeout(() => navigate('/'), 3000);
        })
        .catch((err)=>{
            setError(err)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }
    const callResendAPI = ()=>{
        setError(null)
        setIsLoading(true)
        AuthServices.resend(OtpPayLoad)
        .then((data)=>{
            console.log(data)
            setModalConfig({
                show: true,
                title: 'We sent it!',
                message: 'The new code has been successfully sent to your number.',
                type: 'success'
            })
        })
        .catch((err)=>{
            setError(err)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    }
    const handleFormSubmit = (e)=>{
        e.preventDefault()
        callVerifyAPI()
    }
    const handleResend = () => {
        callResendAPI()
    }
    const renderButton = (buttonProps) => {
        return <button {...buttonProps} style={{fontSize: "22px", background: 'transparent'}} className='pink-color border-0'>Resend Code</button>;
    };
    const renderTime = (remainingTime) => {
        return <div className='pink-color' style={{fontSize: "22px"}}> <span className='font-setting fw-medium' style={{color: "#C0C0C0"}}>Didn’t receive code ?</span> 00:{remainingTime}</div>;
    };
    if(!tempUser) return null
        return (
        <div className='auth-info d-flex flex-column justify-content-center align-items-start px-5 mt-3'>
            <h5 className='text-dark font-setting fw-medium mb-3'>Verification</h5>
            <p className='font-setting fw-regular' style={{color: "#333333"}}>Enter the code we send to :  {tempUser}</p>
            <Form 
                className='w-100 my-3'
                onSubmit={handleFormSubmit}>
                <OTPInput 
                    value={OTP} 
                    onChange={setOTP} 
                    autoFocus 
                    OTPLength={5} 
                    otpType="number" 
                    disabled={isLoading} 
                    inputClassName="my-otp-input"
                />
                <ResendOTP
                    maxTime = {59}
                    timeInterval = {1000}
                    onResendClick={handleResend}
                    className = "d-flex flex-column gap-3 mt-3" 
                    renderButton = {renderButton} 
                    renderTime = {renderTime}/>
                {error
                ? <div className='alert alert-danger mt-3'>{error.message}</div>
                : ""}
                <Button
                    type="submit" 
                    disabled={isLoading || OTP.length < 5}
                    className='btn-nonHover send-btn rounded-2 border-0 pink-bg text-white w-100 py-3 mt-4'>
                        {isLoading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Verifying...</>
                        : "Verify"}
                </Button>

                <div className="d-flex align-items-center my-4">
                    <div className="flex-grow-1 border-bottom" style={{color: "#CBD5E1"}}></div>
                    <span className="mx-3 font-setting fw-regular" style={{color: "#64748B", fontSize: "22px"}}>OR</span>
                    <div className="flex-grow-1 border-bottom" style={{color: "#CBD5E1"}}></div>
                </div>

                <Button 
                    variant='light'
                    className='btn btn-outline-hover  w-100 py-3 '
                    style={{border: "1px solid #F0345D" }}
                    onClick={()=>{navigate("/user/login")}}>
                    Go back
                </Button>
                <DynamicModal 
                    show={modalConfig.show} 
                    handleClose={() => setModalConfig({ ...modalConfig, show: false })}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    type={modalConfig.type}
                />
            </Form>
        </div>
    )
}

export default Verify