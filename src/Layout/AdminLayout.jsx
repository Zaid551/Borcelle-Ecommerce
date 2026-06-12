import React from 'react';
import { Container, Row, Col, Nav, Button, Offcanvas, Navbar } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { NavLink, useNavigate} from 'react-router';
import { logo } from '../Utility/ImagesPlace';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import { HouseFill, PersonFill, List, PersonAdd, Speedometer2, BoxSeam, CartCheck, BookmarkFill, BookmarkPlus, BookmarkCheck, BoxArrowRight } from 'react-bootstrap-icons';
import DynamicModal from '../Components/DynamicModal';
const AdminLayout = () => {
  const navigate = useNavigate()
    const {userInfo, logout} = useContext(AuthContext) 
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992)
    useEffect(()=>{
      const handleResize = () => setIsMobile(window.innerWidth < 992)
      window.addEventListener("resize", handleResize)
      return ()=> window.removeEventListener("resize", handleResize)
    },[])
      const [modalConfig, setModalConfig] = useState({
        show: false,
        title: '',
        message: '',
        type: 'success',
        isConfirm: false
      });
    const handleLogout = ()=>{
    setModalConfig({
      show : true,
      title: 'We Losing You!!',
      message: "Are you sure you want to log out?",
      type: 'confirm',
      isConfirm: true
    })
  }
  return (
    <Container fluid className="admin-dashboard">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="admin-banner min-vh-100 p-0 ">
          <div className=" p-3 text-center">
            <h5 className="text-white fw-bold">Borcelle Admin</h5>
          </div>
          <Nav className="flex-column p-3">
            <Nav.Link as={Link} to="/admin" className="text-white mb-2">
              <Speedometer2 className='me-2'/> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="text-white mb-2">
              <BoxSeam className='me-2'/> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/categories" className="text-white mb-2">
              <BookmarkCheck className='me-2'/> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" className="text-white mb-2">
              <CartCheck className='me-2'/> Orders
            </Nav.Link>
            <Button onClick={handleLogout} 
              variant="link" className="text-white text-decoration-none text-start py-3 px-3 mt-3 fw-bold border-0">
              <BoxArrowRight className="me-2" /> Log Out
            </Button>
          </Nav>
        </Col>

        {/* Main Content Area */}
        <Col md={10} className="bg-light p-0">
        <header className='mb-2'>
          <Navbar expand="lg" className="bg-white sticky-top py-2">
            <Container>

              <Navbar.Toggle aria-controls="offcanvasNavbar" className='border-0 shadow-none p-0 me-2'>
                <List className='fs-1 text-dark' />
              </Navbar.Toggle>

              <Navbar.Brand as={NavLink} to="/" className='me-lg-4'style={{width:"86px", height: '62px' }}>
                <img src={logo} alt="Logo" style={{width:"100%", height: '100%', objectFit: "contain" }} />
              </Navbar.Brand>

              <Navbar.Offcanvas id="offcanvasNavbar" placement="start">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="ms-auto align-items-center gap-lg-3">
                    <Nav.Link as={NavLink} to="/" className="text-center d-flex flex-column align-items-center">
                      <HouseFill size={20} />
                      <span style={{ fontSize: '12px' }}>Home</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/user/profile" className="text-center d-flex flex-column align-items-center">
                      <img src={userInfo?.data?.image || defaultAvatar}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '20px', height: '20px', objectFit: 'cover', border: '1px solid #e91e63' }}/>
                      <span style={{ fontSize: '12px' }}>Profile</span>
                    </Nav.Link>
                    
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
              {/* Profile and Use Icon  in mobile*/}
              {isMobile && (
                <div className="d-flex align-items-center ms-auto">
                  <Nav.Link as={NavLink} to={userInfo ? "/user/profile" : "/user/login"} className="text-center d-flex flex-column align-items-center">
                    {userInfo ? <PersonFill size={22} /> : <PersonAdd size={22} />}
                    <span style={{ fontSize: '12px' }}>{userInfo ? 'Profile' : 'Login'}</span>
                  </Nav.Link>
                </div>
              )}
            </Container>
          </Navbar>
        </header>
        <main className='p-4'>
          <Outlet />
        </main>
        </Col>
      </Row>
      <DynamicModal
              show={modalConfig.show}
              handleClose={() => setModalConfig({...modalConfig, show: false})}
              handleConfirm={()=> {
                logout(); 
                setModalConfig({...modalConfig, show: false}); 
                navigate('/')}}
              title={modalConfig.title}
              message= {modalConfig.message}
              type="confirm"
              isConfirm = {true}
            />
    </Container>
  );
};

export default AdminLayout;