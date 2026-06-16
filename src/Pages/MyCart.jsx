import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Image, InputGroup } from 'react-bootstrap';
import { ArrowLeft, ShieldCheck, Truck, ChatLeftTextFill, CartPlusFill } from 'react-bootstrap-icons';
import { CartPlus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { useCart } from '../Contexts/CartContext';

const MyCart = () => {
    const navigate = useNavigate()
    const { cartItems, addToCart, handleQtyChange, handleRemoveItem, clearCart, subTotal, tax, discount, total, couponCode, setCouponCode, applyCoupon  } = useCart(); // جلب البيانات الحقيقية  // const cartItems = [
    
    const [savedItems, setSavedItems] = useState(()=>{
      const savedLater = localStorage.getItem('savedItem')
      return savedLater ? JSON.parse(savedLater) : []
    });

    useEffect(()=>{
      localStorage.setItem("savedItem", JSON.stringify(savedItems))
    }, [savedItems])
    const handleSaveForLater = (item) => {
      setSavedItems((prevSaved) => {
        const isAlreadySaved = prevSaved.find(i => i.id === item.id);
        if (isAlreadySaved) {
          return prevSaved; 
        }
        return [...prevSaved, item]; 
      });
      handleRemoveItem(item.id); 
    };
    const handleMoveToCart = (item) => {
      const existingInCart = cartItems.find(i => i.id === item.id);

      if (existingInCart) {
        handleQtyChange(item.id, Number(existingInCart.quantity) + 1);
      } else {
        addToCart(item.product, 1);
      }
      setSavedItems(prev => prev.filter(i => i.id !== item.id));
    };

    // const clearCart = () =>{
    //   setModalConfig({
    //     show : true,
    //     title: 'Wait!!',
    //     message: "Are you sure you want to clear your cart?",
    //     type: 'confirm',
    //     isConfirm: true
    //     })
    // }
  const [paymentWays, setPaymentWays] = useState([])
  useEffect(()=>{
    fetch(`${import.meta.env.BASE_URL}paymentWay.json`)
    .then( res => {return res.json()})
    .then( data => setPaymentWays(data))
    .catch( err => console.error("Error loading flags items: ", err))
    .finally(() => console.log("API CALL ENDED"))
  },[])
  const goToCheckOut = ()=>{
    if(cartItems.length > 0){
      navigate("/user/checkout")
    }
  }
  return (
    <Container className="py-5">
      <h3 className="fw-bold mb-4">My cart ({cartItems.length})</h3>
      <Row>
        <Col lg={9}>
          <Card className="border shadow-sm p-3 mb-4 rounded-3">
            {cartItems.length === 0
              ? ( <div className='text-center py-5'>
                  <CartPlusFill size={40} className='pink-color'/>
                  <h5 className='pt-3'>Your Cart is Empty...</h5>
                </div>
              ) : ( <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-bottom py-3">
                      <Row className="align-items-center">
                        <Col md={2} xs={4}>
                          <div className='gray-200 rounded border' style={{width: "80px", height: "80px",}}>
                            <Image src={item.product?.image} alt={item.product?.name} className="border-0 p-2" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                          </div>
                        </Col>
                        <Col md={6} xs={8}>
                          <h6 className="fw-bold mb-1">{item.product?.name}</h6>
                          <p className="gray-500 mb-1">{item.product?.description}</p>
                          <div className="d-flex gap-2">
                            <Button variant="outline-danger" size="sm" className="btn-action pink-outline" onClick={()=> handleRemoveItem(item.id)}>Remove</Button>
                            <Button variant="outline-primary" size="sm" className="btn-action pink-outline" onClick={() => handleSaveForLater(item)}>Save for later</Button>
                          </div>
                        </Col>
                        <Col md={2} xs={6} className="text-md-end mt-3 mt-md-0">
                          <span className="fw-bold">${item.product?.price}</span>
                        </Col>
                        <Col md={2} xs={6} className="mt-3 mt-md-0">
                          <Form.Select style={{boxShadow: "none", borderColor: "#ededed"}} value={item.quantity} size="sm" onChange={(e)=>{handleQtyChange(item.id, e.target.value)}}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( num => (
                              <option key={num} value={num}>Qty: {num}</option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </>
              )}
            <div className="d-flex justify-content-between mt-4">
              <Button variant="danger" className="pink-line px-4" onClick={() => navigate("/products")}>
                <ArrowLeft className="me-2" /> Back to shop
              </Button>
              <Button variant="outline-secondary" className='pink-outline' disabled={cartItems.length === 0} onClick={()=> {clearCart()}}>Remove all</Button>
            </div>
          </Card>
          <Row className=" mt-4">
            <Col md={4} className="d-flex  align-items-center mb-3">
              <div className='d-flex justify-content-center align-items-center me-2'
                style={{width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#DEE2E7"}}>
                <ShieldCheck size={24} className="gray-500" />
              </div>
              <div><strong className="d-block  text-dark">Secure payment</strong><span style={{fontSize:'16px', color: "#A9ACB0"}}>Have you ever finally just</span></div>
            </Col>
            <Col md={4} className="d-flex align-items-center mb-3">
              <div className='d-flex justify-content-center align-items-center  me-2'
                style={{width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#DEE2E7"}}>
                <ChatLeftTextFill size={24} className="gray-500" />
              </div>
              <div><strong className="d-block  text-dark">Customer support</strong><span style={{fontSize:'16px', color: "#A9ACB0"}}>Have you ever finally just</span></div>
            </Col>
            <Col md={4} className="d-flex align-items-center mb-3">
              <div className='d-flex justify-content-center align-items-center me-2'
                style={{width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#DEE2E7"}}>
                <Truck size={24} className="gray-500" />
              </div>
              <div><strong className="d-block  text-dark">Free delivery</strong><span style={{fontSize:'16px', color: "#A9ACB0"}}>Have you ever finally just</span></div>
            </Col>
          </Row>
        </Col>

        <Col lg={3}>
          <Card className="border shadow-sm p-4 mb-3 rounded-3">
            <p className="text-muted mb-2">Have a coupon?</p>
            <InputGroup className="mb-4">
              <Form.Control value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border" 
                placeholder="Add coupon" 
                style={{boxShadow: "none", borderColor: '#E0E0E0 '}} />
              <Button variant="outline-primary" className="pink-outline" onClick={applyCoupon}>Apply</Button>
            </InputGroup>
          </Card>
          <Card className="border shadow-sm p-4 mb-3 rounded-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${subTotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Discount:</span>
              <span className='text-danger'>- ${discount}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
              <span>Shipping:</span>
              <span className='text-success'>+ ${tax}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold">Total:</h5>
              <h4 className="fw-semibold" style={{fontSize: "20px"}}>${total > 0 ? total : 0}
                {total > 0 
                ? <span className='text-decoration-line-through ms-1' style={{color: "#CFCFCF", fontSize: "12px"}}>${subTotal}</span>
                : ""}
              </h4>
            </div>
            <Button disabled={cartItems.length === 0}
                    className="checkout-btn w-100 py-3 fw-bold border-0 shadow-sm"
                    onClick={goToCheckOut}>
              Checkout
            </Button>
            <div className=" mt-3 d-flex justify-content-center gap-2 ">
              {paymentWays.map((item) =>(
                <div key={item.id} className='rounded border d-flex justify-content-center align-items-center' style={{width: "34px", height: "22px",}}>
                  <Image src={item.image} alt={item.title} className="border-0 p-1" style={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      <Card className="p-4 shadow-sm border rounded-3">
        <h5 className="fw-bold mb-4">Saved for later</h5>
        <Row className="g-3"> 
          {savedItems.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3}> 
              <Card className="border-0 h-100 p-3 rounded-3 shadow-sm bg-white">
                <div className="text-center mb-3 rounded-3 p-4" style={{backgroundColor: "#EEEEEE"}}>
                  <img src={item.product?.image} alt={item.product?.name} style={{ width: '100%', height: '160px', objectFit: 'contain' }} />
                </div>
                <h6 className="fw-bold mb-2" style={{ fontSize: '18px' }}>${item.product?.price}</h6>
                <p className="mb-3 text-muted" style={{ fontSize: '16px' }}>{item.product?.name}</p>
                <Button 
                  variant="outline-primary" 
                  className="w-100 d-flex align-items-center justify-content-center gap-2 fw-medium pink-outline"
                  style={{ fontSize: '16px', color:"#F0345D", borderColor: "#F0345D" }}
                  onClick={() => handleMoveToCart(item)}>
                  <CartPlus size={18} /> Move to cart
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      {/* <DynamicModal 
        show={modalConfig.show}
        handleClose={() => setModalConfig({ ...modalConfig, show: false })}
        handleConfirm={() => {
          if (modalConfig.type === 'confirm') {
            setCartItems([]);
          }
          setModalConfig({ ...modalConfig, show: false }); 
        }}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}e
        isConfirm={modalConfig.isConfirm}
      /> */}
    </Container>
  );
};

export default MyCart