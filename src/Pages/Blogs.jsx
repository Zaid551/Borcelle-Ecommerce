import React, { useEffect, useRef, useState } from 'react'
import { Breadcrumb, Col, Container, Row, Card, Button, Accordion, Form, ButtonGroup, Pagination } from 'react-bootstrap'
import { Grid3x3GapFill, ListUl, ChevronLeft, ChevronRight, Filter, FilterLeft } from 'react-bootstrap-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Link } from 'react-router-dom'; 
import Blog from '../Components/blog';
import RecommendedItems from '../Pages/Home/RecommendedItems'

const Blogs = () => {
  const [activeId, setActiveId] = useState(null);
  const handleTab = (id) =>{
    setActiveId(id)
  }
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false); 

  useEffect(() => {
    setIsMobile(window.innerWidth < 992);
    const handleResize = () => setIsMobile(window.innerWidth < 992)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blogs.json`)
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error loading Blogs: ", err))
  }, [])

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('productView') || 'list';
  })

  const handleViewChange = (mode) => {
    setViewMode(mode)
    localStorage.setItem("productView", mode)
  }

  const [priceRange, setPriceRange] = useState([0, 999999])
  const handleSliderChange = (value) => setPriceRange(value);

  const handleInputChange = (index, e) => {
    const newValue = [...priceRange];
    newValue[index] = Number(e.target.value);
    setPriceRange(newValue);
  };

  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const categoryPath = "/category"
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const callCategoryApi = () => {
      fetch(`${base_url}${categoryPath}`)
        .then(res => {
          if (!res.ok) throw new Error('Something went wrong!')
          return res.json()
        })
        .then(data => {
          if (data.data) setCategories(data.data)
        })
        .catch(err => console.error("Error fetching data:", err))
    }
    callCategoryApi()
  }, [])

  return (
    <>
      {isMobile
        ? (
          <div className='bg-white'>
            <Container fluid>
              <Row >
                <Col xs={12}>
                  <div className="categories-container ">
                    <Swiper
                      onSwiper={(swiper) => {
                        swiperRef.current = swiper; 
                      }}
                      modules={[FreeMode]}
                      freeMode= {true}
                      slidesPerView={'auto'} 
                      spaceBetween={10}
                      className="category-swiper mb-3 px-3">
                      {categories.map(list => (
                        <SwiperSlide key={list.id} className="category-item">
                          <button className={`category-btn ${activeId === list.id ? 'active' : ''} `} onClick={()=>{handleTab(list.id)}}>{list.name}</button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </Col>
              </Row>
              <Row className='bg-white border-top border-bottom mb-3 py-2 px-2 mx-0'>
                <Col xs={12}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    
                    <div className="flex-grow-1 flex-sm-grow-0" style={{ minWidth: '160px', maxWidth: '200px' }}>
                      <Form className="d-flex justify-content-center align-items-center border border-1 rounded-2 text-dark bg-white">
                        <Form.Select size="sm" className="border-0 shadow-none bg-transparent py-2">
                          <option>Sort: Newest</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="newest">Newest Arrivals</option>
                        </Form.Select>
                        <FilterLeft size={20} className='text-secondary pe-2' /> 
                      </Form>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div 
                        className="d-flex justify-content-between align-items-center border border-1 rounded-2 px-3 py-2 text-center text-dark bg-white" 
                        style={{ cursor: 'pointer', height: '38px', minWidth: '100px', fontSize: '14px' }}
                      >
                        Filter(0) <Filter size={18} className='text-secondary ms-2' /> 
                      </div>

                      <ButtonGroup size="sm" className="border rounded shadow-sm bg-white" style={{ height: '38px' }}>
                        <Button 
                          variant={viewMode === 'grid' ? 'light' : 'white'}
                          onClick={() => handleViewChange('grid')}
                          className="border-end px-2 d-flex align-items-center"
                          style={{ backgroundColor: viewMode === 'grid' ? '#d3d6db' : '#FFFFFF' }}>  
                          <Grid3x3GapFill className="text-dark" size={16} />
                        </Button>
                        <Button 
                          variant={viewMode === 'list' ? 'light' : 'white'}
                          onClick={() => handleViewChange('list')}
                          className="px-2 d-flex align-items-center"
                          style={{ backgroundColor: viewMode === 'list' ? '#d3d6db' : '#FFFFFF' }}>  
                          <ListUl className="text-dark" size={16} />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )
        : (
          <div>
            <Container className='py-lg-4 py-0'>
              <Row>
                <Col lg={3}>
                  <div className="sidebar-container" style={{ maxWidth: '250px' }}>
                    <Accordion defaultActiveKey={['0', '1']} alwaysOpen className="border-top">
                      <Accordion.Item eventKey="0" className="border-0 border-bottom bg-light">
                        <Accordion.Header className="fw-semibold">Category</Accordion.Header>
                        <Accordion.Body className="p-0 pb-3">
                          <ul className="list-unstyled mb-0">
                            {categories.map((cat) => (
                              <li key={cat.id}>
                                <Button variant="link" onClick={() => setSelectedCategory(cat.id)} className={`nav-link py-1 ps-0 ${selectedCategory === cat.id ? "fw-semibold pink" : "text-secondary"}`}>
                                  {cat.name}
                                </Button>
                              </li>
                            ))}
                            <li><Button variant="link" className="nav-link pink py-1 ps-0 fw-medium" onClick={() => setSelectedCategory(null)}>See all</Button></li>
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1" className="border-0 border-bottom bg-light">
                        <Accordion.Header className="fw-semibold">Price range</Accordion.Header>
                        <Accordion.Body className="p-0 pb-3">
                          <Form>
                            <Row className="px-2 mb-3">
                              <Col xs={12}>
                                <Slider
                                  range
                                  min={0}
                                  max={1000000}
                                  value={priceRange}
                                  onChange={handleSliderChange}
                                  trackStyle={[{ backgroundColor: '#F0345D' }]}
                                  handleStyle={[
                                    { borderColor: '#F0345D', backgroundColor: '#fff', opacity: 1, boxShadow: "none" },
                                    { borderColor: '#F0345D', backgroundColor: '#fff', opacity: 1, boxShadow: "none" }
                                  ]}
                                />
                              </Col>
                            </Row>
                            <Row className="g-2 mb-3">
                              <Col>
                                <Form.Label className="small" style={{ color: "#1C1C1C" }}>Min</Form.Label>
                                <Form.Control className='input-nonFocus' type="number" value={priceRange[0]} onChange={(e) => handleInputChange(0, e)} size="sm" />
                              </Col>
                              <Col>
                                <Form.Label className="small" style={{ color: "#1C1C1C" }}>Max</Form.Label>
                                <Form.Control className='input-nonFocus' type="number" value={priceRange[1]} onChange={(e) => handleInputChange(1, e)} size="sm" />
                              </Col>
                            </Row>
                            <Button variant='light' className='btn btn-outline-danger w-100' style={{ border: "1px solid #ddd" }}>
                              Apply
                            </Button>
                          </Form>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Col>

                <Col lg={9}>
                  <Card className="mb-3 p-3 border shadow-sm d-flex flex-row align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                      <span className="text-dark fw-normal fs-6">{blogs.length} items of All Blogs</span>
                    </div>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <Form.Check type="checkbox" id="verified-only" label="Verified only" className="text-dark mb-0" style={{ fontSize: "15px" }} defaultChecked />
                      <Form.Select size="sm" className="shadow-none w-auto border text-dark" style={{ minWidth: '120px' }}>
                        <option>Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                      </Form.Select>
                      <ButtonGroup size="sm" className="border rounded">
                        <Button variant={viewMode === 'grid' ? 'light' : 'white'} onClick={() => handleViewChange('grid')} className="border-end px-2" style={{ backgroundColor: viewMode === 'grid' ? '#d3d6db' : '#FFFFFF' }}>
                          <Grid3x3GapFill className="text-dark" size={15} />
                        </Button>
                        <Button variant={viewMode === 'list' ? 'light' : 'white'} onClick={() => handleViewChange('list')} className="px-2" style={{ backgroundColor: viewMode === 'list' ? '#d3d6db' : '#FFFFFF' }}>
                          <ListUl className="text-dark" size={15} />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Card>
                  <Row className="g-4 mb-3 justify-content-between align-items-stretch">
                    <Blog viewMode={viewMode} data={blogs} />
                  </Row>
                </Col>
              </Row>

              <Row className="justify-content-end align-items-center mt-3">
                <Col xs="auto" className="d-flex align-items-center gap-2">
                  <Form.Select size="sm" className="border-secondary shadow-none" style={{ width: '110px', height: '40px' }}>
                    <option value="5">Show 5</option>
                    <option value="10">Show 10</option>
                    <option value="15">Show 15</option>
                  </Form.Select>
                </Col>
                <Col xs="auto">
                  <Pagination className="mb-0 custom-pagination bg-white">
                    <Pagination.Prev className="border rounded-start shadow-sm px-1"><ChevronLeft size={15} className="text-dark" /></Pagination.Prev>
                    {[1, 2, 3].map((number) => (
                      <Pagination.Item key={number} className="border px-1">{number}</Pagination.Item>
                    ))}
                    <Pagination.Next className="border rounded-end shadow-sm px-1"><ChevronRight size={15} className="text-dark" /></Pagination.Next>
                  </Pagination>
                </Col>
              </Row>
            </Container>
          </div>
        )
      }
      <Container className='pb-lg-4 py-0'>
        {isMobile &&(<Row className="g-3 mb-4">
          <Blog viewMode={viewMode} data={blogs} />
        </Row>)}
        <Row>
          <Col xs={12}>
            <RecommendedItems title="You may also like" />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Blogs