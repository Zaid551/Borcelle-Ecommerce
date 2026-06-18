import {Container, Row, Col, Badge, Image} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Book, Box, Box2, Box2Fill, BoxSeam, Cart, CartFill, ChatLeftTextFill, ExclamationCircle, Headphones, Heart, HeartFill, HouseDoor, HouseFill, List, People, PersonAdd, PersonFill, QuestionCircle, Trash3Fill } from 'react-bootstrap-icons';
import { logo } from '../Utility/ImagesPlace';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import { NavLink, useNavigate} from 'react-router';
import { useCart } from '../Contexts/CartContext';
import { WishlistContext } from '../Contexts/WishlistContext';
import { SearchBar } from './SearchBar';
import SearchList from './SearchList';

const MyWebsiteNavbar = ({showContent = true}) => {
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const { cartItems, subTotal, handleRemoveItem, handleQtyChange } = useCart(); 
  const { wishlistItems} = useContext(WishlistContext)
  const [showCart, setShowCart] = useState(false);

  const handleCartClose = () => setShowCart(false);
  const handleCartShow = () => setShowCart(true);
  const [showList, setShowList] = useState(false);

  const handleListClose = () => setShowList(false);
  const handleListShow = () => setShowList(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)
  useEffect(()=>{
    const handleResize = () => setIsMobile(window.innerWidth < 992)
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
  },[])
  const navigate = useNavigate()
  const {userInfo} = useContext(AuthContext)
  const wishlistCount = wishlistItems.length
  const cartCount = cartItems.length;
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  return (
    <>
      <Navbar expand="lg" className="bg-white sticky-top py-2">
        <Container>

          <Navbar.Toggle aria-controls="offcanvasNavbar" className='border-0 shadow-none p-0 me-2' onClick={handleListShow}>
            <List className='fs-1 text-dark' />
          </Navbar.Toggle>

          <Navbar.Brand as={NavLink} to="/" className='me-lg-4'style={{width:"86px", height: '62px' }}>
            <img src={logo} alt="Logo" style={{width:"100%", height: '100%', objectFit: "contain" }} />
          </Navbar.Brand>

          <Navbar.Offcanvas show={showList} onHide={handleListClose} id="offcanvasNavbar" placement="start">
            <Offcanvas.Body className="p-0">
              {!isMobile && (
              showContent &&
                (<div className="search-bar-container">
                  <SearchBar 
                  input={input}
                  setInput={setInput} 
                  setResults={setResults} 
                  setShowResults={setShowResults}
                  variant="primary"/>
                  {showResults && input.length > 0  && (
                    <SearchList results={results} setShowResults={setShowResults} />)
                  }
                </div>
                ))}
              
              {isMobile && (
                <>
                  <div className="bg-light p-4 border-bottom">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <img src={userInfo?.data?.image || defaultAvatar}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', border: '2px solid #e91e63' }}/>
                      </div>
                      <Button variant="link" className="border-0 shadow-none p-1 text-dark" onClick={handleListClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-lg fw-bold" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                      </Button>
                    </div>
                    {!userInfo 
                    ? (<div className="fs-6">
                      <NavLink to="/user/login" className="text-dark text-decoration-none fw-bold">Sign in</NavLink>
                      <span className="mx-2 text-muted">|</span>
                      <NavLink to="/user/signUp" className="text-dark text-decoration-none fw-bold">Register</NavLink>
                    </div>)
                    :( <div>{userInfo?.data?.name}</div>)}
                    
                  </div>
                  <Nav className="flex-column align-items-start p-2 border-bottom" onSelect={handleListClose}>
                    <Nav.Link as={NavLink} to="/" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <HouseDoor size={20} className="text-muted" />
                      <span>Home</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/products" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <Box size={20} className="text-muted" />
                      <span>Products</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/wishlist" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <Heart size={20} className="text-muted" />
                      <span>Favorites</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/user/profile#orders" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <BoxSeam size={20} className="text-muted" />
                      <span>My orders</span>
                    </Nav.Link>
                  </Nav>

                  <Nav className="flex-column  align-items-start p-2 border-bottom" onSelect={handleListClose}>
                    <Nav.Link as={NavLink} to="/help/faq" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <QuestionCircle size={18} className="text-muted"/>
                      <span>faq</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/help/contact" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <Headphones size={18} className="text-muted" />
                      <span>Contact us</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/about" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <People size={18} className="text-muted" />
                      <span>About</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/blogs" className="d-flex align-items-center gap-3 py-2 px-3 text-dark">
                      <Book size={18} className="text-muted" />
                      <span>Blogs</span>
                    </Nav.Link>
                  </Nav>

                  <Nav className="flex-column  align-items-start p-2" onSelect={handleListClose}>
                    <Nav.Link as={NavLink} to="/admin" className="py-2 px-3 text-dark small opacity-75">Dashboard</Nav.Link>
                    <Nav.Link as={NavLink} to="/help/terms" className="py-2 px-3 text-dark small opacity-75">Terms & Conditions</Nav.Link>
                    <Nav.Link as={NavLink} to="/help/privacy" className="py-2 px-3 text-dark small opacity-75">Privacy policy</Nav.Link>
                  </Nav>
                </>
              )}
              {!isMobile && (
                <>
                  <Nav className="ms-auto align-items-center gap-lg-3">
                    <Nav.Link as={NavLink} to="/" className="text-center d-flex flex-column align-items-center">
                      <HouseFill size={20} />
                      <span style={{ fontSize: '12px' }}>Home</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={userInfo ? "/user/profile" : "/user/signUp"} className="text-center d-flex flex-column align-items-center">
                      {userInfo ? <PersonFill size={22} /> : <PersonAdd size={22} />}
                      <span style={{ fontSize: '12px' }}>{userInfo ? 'Profile' : 'Register'}</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/messageUs" className="text-center d-flex flex-column align-items-center">
                      <ChatLeftTextFill size={20} />
                      <span style={{ fontSize: '12px' }}>Message</span>
                    </Nav.Link>

                    <Nav.Link as={NavLink} to="/wishlist" className="p-0 position-relative text-center d-flex flex-column align-items-center">
                      <HeartFill size={20} />
                      <span style={{ fontSize: '12px' }}>Wishlist</span>
                      <Badge 
                        pill 
                        bg="danger" 
                        className="position-absolute top-25 translate-middle ms-0" 
                        style={{insetInlineStart: "88%",  fontSize: '0.6rem' }}
                      >
                        {wishlistCount}
                      </Badge>
                    </Nav.Link>
                    {/* Cart Icon in Large Screen*/}
                    <Button variant="link" className="text-decoration-none p-0 position-relative d-flex flex-column align-items-center  text-dark shadow-none" onClick={handleCartShow}>
                        <CartFill size={22} className="gray-500" />
                        <span style={{ fontSize: '12px' }} className="gray-500">My Cart</span>
                        {cartCount > 0 && (
                          <Badge pill bg="danger" className="position-absolute top-0 start-50 translate-middle-y ms-2" style={{ fontSize: '0.6rem' }}>
                            {cartCount}
                          </Badge>
                        )}
                      </Button>
                    
                  </Nav>
                </>
              )}

            </Offcanvas.Body>
          </Navbar.Offcanvas>
          {/* Profile and Use Icon  in mobile*/}
          {isMobile && (
            <div className="d-flex align-items-center ms-auto">
              <Nav.Link as={NavLink} to={userInfo ? "/user/profile" : "/user/signUp"} className="text-center d-flex flex-column align-items-center">
                {userInfo ? <PersonFill size={22} /> : <PersonAdd size={22} />}
                <span style={{ fontSize: '12px' }}>{userInfo ? 'Profile' : 'Register'}</span>
              </Nav.Link>
            </div>
          )}
          {/* Cart Icon in mobile*/}
          {isMobile && (
            <Button 
              variant="primary" 
              className="cart-floating-btn shadow-lg d-flex flex-column align-items-center justify-content-center" 
              onClick={handleCartShow}
            >
              <div className="position-relative">
                <CartFill size={28} />
                {cartItems.length > 0 && (
                  <Badge 
                    pill 
                    bg="danger" 
                    className="position-absolute top-0 start-100 translate-middle badge-pulse"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </div>
            </Button>
          )}
        </Container>
      </Navbar>

      <Offcanvas show={showCart} onHide={handleCartClose} placement="end" id="cart-drawer">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold">Your Shopping Bag ({cartCount})</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="cart-items-list flex-grow-1 px-4 py-3 overflow-auto">
            {cartItems.map((item) => (
              <Row key={item.id} className="align-items-center mb-4 g-3 border-bottom pb-4 border-light">
                <Col xs={4} className="position-relative">
                  <div className="bg-light rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                    <Image src={item.product?.image || item.img} alt={item.product?.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    <span className="position-absolute top-0  end-0 translate-middle badge rounded-circle pt-1" style={{color: "#EA088B", border: "3px solid #EA088B"  ,zIndex: 2, padding: "5px 7px" }}>
                      {item.quantity}
                    </span>
                  </div>
                </Col>

                <Col xs={8}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: "150px" }}>{item.product?.name}</h6>
                    <span className="fw-bold pink-color text-nowrap">${item.product?.price}</span>
                  </div>
                  <p className="text-muted small mb-3">{item.product?.description}</p>

                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center border rounded-2 px-1 py-1" style={{ backgroundColor: "#f8f9fa" }}>
                      <Button variant="link" className="p-0 text-danger px-2 text-decoration-none" onClick={() => handleQtyChange(item.id, item.quantity - 1)} 
            disabled={item.quantity <= 1}>—</Button>
                      <span className="px-2 fw-medium">{item.quantity}</span>
                      <Button variant="link" className="p-0 text-success fs-4 pt-1 px-2 text-decoration-none"
                        onClick={() => handleQtyChange(item.id, item.quantity + 1)}>+</Button>
                    </div>
                    <Button variant="link" className="p-0 text-danger" onClick={() => handleRemoveItem(item.id)}>
                      <Trash3Fill size={20} className='text-danger'/>
                    </Button>
                  </div>
                </Col>
              </Row>
            ))}
          </div>
          <div className="billing-details border-top p-4 bg-white mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">SubTotal :</h5>
              <h5 className="fw-bold pink-color mb-0">${subTotal}</h5>
            </div>
            <Button 
              onClick={() => navigate('/user/checkout')}
              className="send-btn w-100 py-3 fw-bold border-0 bg-pink shadow-sm rounded-3"
            >
              Checkout
            </Button>
            <Button 
              onClick={() => navigate('/myCart')}
              variant="link" className="text-decoration-none pink-color w-100 text-center mt-3 p-0 fs-6 save-for-later-btn"
            >
              <Cart size={20} className='me-2'/>
              View Cart
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MyWebsiteNavbar