import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HouseFill, Search } from 'react-bootstrap-icons';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <div className="mb-4">
              <h1 
                className='cart-bump'
                style={{ 
                  fontSize: '8rem', 
                  fontWeight: '900', 
                  color: '#e94560', 
                  letterSpacing: '-5px',
                  marginBottom: '40px'
                }}>
                404
              </h1>
            </div>

            <h2 className="fw-bold mb-3">Oops! The page does not exist</h2>
            <p className="text-muted mb-5 px-md-5">
                It seems the link you're trying to access is missing or has been moved. Don't worry, you can go back and start again!
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Button 
                as={Link} 
                to="/" 
                variant="primary" 
                size="lg"
                className="pink-line d-flex align-items-center justify-content-center gap-2 px-4"
                style={{ backgroundColor: '#e94560', border: 'none', borderRadius: '8px' }}
              >
                <HouseFill /> Back to Home
              </Button>

              <Button 
                as={Link} 
                to="/products" 
                variant="outline-secondary" 
                size="lg"
                className="pink-outline d-flex align-items-center justify-content-center gap-2 px-4"
                style={{ borderRadius: '8px' }}
              >
                <Search /> Browse products
              </Button>
            </div>
            <div className="mt-5 pt-4 border-top">
                <p className="small text-muted">
                    If you believe this is a software bug, please <Link to="/help/contact" className="text-decoration-none" style={{color: '#e94560'}}>Contact us</Link>
                </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;