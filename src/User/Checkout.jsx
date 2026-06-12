import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Image, Form, Spinner } from 'react-bootstrap';
import DynamicModal from '../Components/DynamicModal';
import {  useCart } from '../Contexts/CartContext';
import { CreditCardFill, GeoAltFill, Trash3Fill, ChatLeftTextFill, TelephoneFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, total, tax, discount, subTotal, handleRemoveItem, clearCart, couponCode } = useCart(); // جلب البيانات الحقيقية  // const cartItems = [
  const [loading, setLoading] = useState(true); 
  const [addresses, setAddresses] = useState([]); 
  const [addressId, setAddressId] = useState('');
  const [paymentType, setPaymentType] = useState('CASH');
  const [orderNote, setOrderNote] = useState('');
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const addressPath = "/address"
  const orderPath = "/order"
  const parsedData = JSON.parse(localStorage.getItem('userData'));
  const currentToken = parsedData.data?.token;
  useEffect(()=>{
    const callAddressApi = () =>{
      fetch(`${base_url}${addressPath}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        if(!res.ok){
          return res.json().then((serverError)=>{
            throw new Error (serverError || 'Something went wrong!')
          })
        }
        return res.json()
      })
      .then(data => {
        console.log(data.data)
        if(data.code === 1){
          setAddresses(data.data)
        }
      })
      .catch((err)=>{
        console.error("Error fetching addresses:", err);
      })
      .finally(()=>{
        setLoading(false);
      })
    }
    callAddressApi()
  },[currentToken])
const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) {
        setModalConfig({
            show: true,
            title: 'Empty Cart',
            message: 'Your cart is empty. Please add some products first.',
            type: 'warning'
        });
        return;
    }
    if(!addressId) {
        setModalConfig({
            show: true,
            title: 'Address Required',
            message: 'Please select a shipping address to proceed with your order.',
            type: 'warning'
        });
        return;
    }
    const orderBody = {
        note: orderNote,
        payment_type: paymentType,
        address_id: addressId,
        coupon_code: couponCode 
      };
    fetch(`${base_url}${orderPath}`, { 
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${currentToken}`
    },
    body: JSON.stringify(orderBody)
  })
  .then(res => res.json())
  .then(data => {
    if(data.code === 1) {
      clearCart()
      setModalConfig({
        show: true,
        title: 'Successfully...',
        message: 'you have successfully paid for your order.',
        type: 'success'
      })
      setTimeout(() => navigate('/user/profile#orders'), 3000);
    } else{
      setModalConfig({
        show: true,
        title: 'Sorry...',
        message: 'An error occurred while completing the order.',
        type: 'warning'
        }) 
    }
  })
  .catch((err)=>{
    console.error("Error fetching order store:", err);
    setModalConfig({
        show: true,
        title: 'Error',
        message: 'Network error. Please try again later.',
        type: 'warning'
    });
  })
  .finally(()=>{
    setLoading(false);
  })
}
const selectedAddress = addresses.find(a => a.id === parseInt(addressId));
  return (
    <div className="checkout-card p-5 rounded-4 shadow-sm" >
      <div className="cart-items-list mb-4">
        {cartItems.map((item) => (
          <Row key={item.id} className="align-items-center mb-4 text-start g-0">
            <Col xs={3}>
              <div style={{width: "72px", height: "87px"}}>
                <Image src={item.product?.image || item.img} alt={item.product?.name} rounded className="bg-light p-1 w-100" style={{width: "100%", height: "100%", objectFit: "cover"}}/>
              </div>
            </Col>
            <Col xs={5} >
              <h6 className="fw-bold mb-1 " style={{ fontSize: '18px' }}>{item.product?.name}</h6>
              <p className="gray mb-0" style={{ fontSize: '16px' }}>{item.product?.description}</p>
            </Col>
            <Col xs={1} className="text-center px-0 ms-3">
              <div className="quantity-box border rounded py-1 px-2 small d-flex align-items-center gap-3">{item.quantity}
                <Button variant="link" className="p-0 text-danger" onClick={() => handleRemoveItem(item.id)}>
                  <Trash3Fill size={18} className='text-danger'/>
                </Button>
              </div>
            </Col>
            <Col xs={2} className="text-end">
              <span className="pink-color fw-bold small">${item.product?.price}</span>
            </Col>
          </Row>
        ))}
      </div>
      <div className="order-options border-top pt-4 mb-4 text-start">
        <Row>
          <Col md={12} className="mb-3">
            <Form.Label className="fw-bold">
              <GeoAltFill className="me-2 pink-color"/> Shipping Address
            </Form.Label>
            
            {loading ? (
              <div className="d-flex align-items-center gap-2 text-muted">
                <Spinner animation="border" size="sm" variant="danger" /> Loading Address...
              </div>
            ) : (
              <>
                <Form.Select 
                  className="rounded-3 shadow-none border-light-subtle"
                  value={addressId}
                  onChange={(e) => setAddressId(e.target.value)}
                >
                  <option value="">Select Address</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.city}, {addr.street} ({addr.name}) {addr.is_default === 1 ? ' - [Default]' : ''}
                    </option>
                  ))}
                </Form.Select>
                {addressId && (
            <div className="mt-2 p-3 bg-white rounded-3  text-muted border">
              {selectedAddress && (
                <div className='d-flex flex-column gap-2'>
                  <span>
                    <GeoAltFill className="me-1 pink-color" />
                    City: {selectedAddress.neighborhood}, Building: {selectedAddress.building}, Zip: {selectedAddress.zip_code}.
                  </span>
                  <span>
                    <TelephoneFill className="me-1 pink-color" />
                    Phone Number: {selectedAddress.phone}.
                  </span>
                </div>
              )}
            </div>
          )}
              </>
            )}
          </Col>
          
          <Col md={12} className="mb-3">
            <Form.Label className="fw-bold">
              <CreditCardFill className="me-2 pink-color"/> Payment Method
            </Form.Label>
            <Form.Select 
              className="rounded-3 shadow-none border-light-subtle"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="CASH" >Cash </option>
              <option value="Syriatel">Syriatel</option>
              <option value="MYN">MTN</option>
            </Form.Select>
          </Col>

          <Col md={12} className="mb-3">
            <Form.Label className="fw-bold ">
              <ChatLeftTextFill className="me-2 pink-color"/> Order Note
            </Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} 
              placeholder= "Any special instructions?"
              className="rounded-3 shadow-none border-light-subtle"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
            />
          </Col>
        </Row>
      </div>
      <div className="billing-details border-top pt-4">
        <div className='d-flex flex-column gap-4' >
          <div className="d-flex justify-content-between mb-3 text-muted" >
            <span style={{fontSize: "22px"}}>Total</span>
            <span style={{fontSize: "22px"}}>{subTotal}</span>
          </div>
          <div className="d-flex justify-content-between mb-3 text-muted">
            <span style={{fontSize: "22px"}}>Discount</span>
            <span style={{fontSize: "22px"}} className="text-danger">-${discount}</span>
          </div>
          <div className="d-flex justify-content-between mb-4 text-muted border-bottom pb-4">
            <span style={{fontSize: "22px"}}>Tax</span>
            <span style={{fontSize: "22px"}} className=" text-success">+${tax}</span>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark">Net Total</h4>
          <h3 className="pink-color fw-bold">${total}</h3>
        </div>

        <Button onClick={handleCheckout}
          className="send-btn bg-pink w-100 py-3 fw-bold border-0 send-btn">
          Confirm Payment
        </Button>
        <DynamicModal 
          show= {modalConfig.show}
          handleClose={() => setModalConfig({ ...modalConfig, show: false })}
          title = {modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
        />
      </div>
    </div>
  )
}
export default Checkout;