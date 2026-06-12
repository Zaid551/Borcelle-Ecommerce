import React, { useEffect, useState } from 'react'
import { Col, Container,Nav, NavDropdown, Row, Form } from 'react-bootstrap';
import { NavLink} from 'react-router';
import { List, Search } from 'react-bootstrap-icons';
import { SearchBar } from './SearchBar';
import SearchList from './SearchList';

const SecondaryNavbar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [results, setResults] = useState([])
    const [showResults, setShowResults] = useState(false);
    const [input, setInput] = useState("");
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 992);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  return (
    <>
    {isMobile
      ?(
        <div className="pb-1">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="search-bar-container">
                  <SearchBar 
                  input={input}
                  setInput={setInput} 
                  setResults={setResults} 
                  setShowResults={setShowResults}
                  variant="secondary"/>
                  {showResults && input.length > 0  && (
                    <SearchList results={results} setShowResults={setShowResults} />)
                  }
                </div>
              </Col>
            </Row>
          </Container>
        </div>)
      : (
        <div className="border-top py-0">
          <Container>
            <Row>
              <Col lg={12}>
                <div className='d-flex justify-content-between align-item-center'>
                  <Nav className='nav-link d-flex justify-content-start align-item-center flex-grow-1 fw-medium pe-3 gap-2'>
                    <Nav.Link as={NavLink} className='nav-item secondary-nav flex-row fs-6' to="/products" >
                      <List className="me-1"/> All category
                    </Nav.Link>
                    <Nav.Link as={NavLink} className='nav-item fs-6 secondary-nav' to="/about">
                      About Us
                    </Nav.Link>
                    <Nav.Link as={NavLink} className='nav-item fs-6 secondary-nav' to="/help/contact">
                      Contact Us
                    </Nav.Link>
                    <Nav.Link as={NavLink} className='nav-item fs-6 secondary-nav' to="/blogs" >
                      Blogs
                    </Nav.Link>
                    <NavDropdown title="Help" id="basic-nav-dropdown" className='secondary-nav'>
                      <NavDropdown.Item href="/help/faq" className='fs-6 secondary-nav'>FAQ</NavDropdown.Item>
                      <NavDropdown.Item href="/help/privacy" className='fs-6 secondary-nav'>Privacy</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/help/terms" className='fs-6 secondary-nav'>Terms</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </div>
              </Col>
            </Row>
          </Container>
        </div>)
      }
  </>
  )
}

export default SecondaryNavbar