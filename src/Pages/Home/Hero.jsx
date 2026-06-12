import React, { useContext, useEffect, useRef, useState } from 'react'
import {Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { AuthContext } from '../../Contexts/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { useNavigate } from 'react-router';
const Hero = () => {
  const navigate = useNavigate
  const [isLoading, setIsLoading] = useState(false);
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const categoryPath = "/category"
  const [categories, setCategories] = useState([])

  useEffect(()=>{
    const callCategoryApi = () =>{
      setIsLoading(true)
      fetch(`${base_url}${categoryPath}`)
      .then(res => {
        if(!res.ok){
          return res.json().then((serverError)=>{
            throw new Error (serverError || 'Something went wrong!')
          })
        }
        return res.json()
      })
      .then(data => {
        if(data.data){
          const validCategories = data.data.filter(cat => cat.name !== null).slice(1,10);
          setCategories(validCategories);
        }
      })
      .catch((err)=>{
          console.error("Error fetching data:", err);
      })
      .finally(()=>{
          setIsLoading(false)
      })
    }
    callCategoryApi()
  },[])
  const {userInfo} = useContext(AuthContext)
  const [activeId, setActiveId] = useState(null);
  const handleTab = (id) =>{
    setActiveId(id)
  }
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      if (!mobile && swiperRef.current && !swiperRef.current.destroyed) {
        swiperRef.current.destroy(true, true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const userImage = userInfo?.data?.image;
  return (
    <section className='pt-3'>
      <Container >
        {isMobile
          ? ( 
            <Row className='mb-5 '>
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
                <BannerContent type={"changeColor"}/>
              </Col>
            </Row>
          )
          : ( 
        <Row className='border rounded-2 p-3 bg-white'>
          <Col md={3}>
            <div className="categories-container">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper; 
                }}
                modules={[FreeMode]}
                freeMode= {true}
                slidesPerView={'auto'} 
                spaceBetween={10}
                className="category-swiper">
                {isLoading ? (
                  <div className="d-flex flex-column justify-content-center align-items-center gap-2 py-5 w-100">
                    <Spinner animation="border" size="md" variant="danger" />
                    <p className="text-muted">Loading categories...</p>
                  </div>
                ) : (
                  categories.map(list => (
                    <SwiperSlide key={list.id} className="category-item">
                      <button 
                        className={`category-btn ${activeId === list.id ? 'active' : ''}`} 
                        onClick={() => handleTab(list.id)}
                      >
                        {list.name}
                      </button>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
              <Button variant="link" className="nav-link pink ps-3 ms-1 fw-medium" onClick={()=> navigate("/products")}>See all</Button>
            </div>
          </Col>
          <Col md={6}>
            <BannerContent />
          </Col>
          <Col md={3}>
            <div className="p-3 rounded-2 mb-2 d-flex flex-column gap-2 " style={{background: "#ffe3ff"}}>
              {userInfo
                ? (
                  <>
                  <div className='d-flex flex-column align-items-center gap-2'>
                    <div className="profile-img-container ">
                      <img src={userImage || defaultAvatar}
                        alt="Profile" 
                        className="rounded-circle border border-4 border-white shadow-sm"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                      />
                    </div>
                    <div className='text-center'>
                      <h5 className=' m-3 mb-1'>Hello, <span className='pink-color fw-semibold '>{userInfo?.data?.name}</span></h5>
                      <p>Let's get started</p>
                    </div>
                  </div>
                  </>
                )
                :(<>
                  <div className='d-flex gap-2'>
                    <PersonCircle className="ml-4 pink-color fs-1" />
                    <h6>Hi, user <br/> let's get stated</h6>
                  </div>
                  <div className='d-flex flex-column gap-2'>
                    <Button variant="light" href='/user/signUp' className="btn-color w-100 rounded-3 text-white">Join now</Button>
                    <Button variant="light" href='/user/login' className="w-100 pink rounded-3 ">Log in</Button>
                  </div>
                </>)
              }
            </div>
            <div className="p-3 rounded-2 mb-2 text-white" style={{backgroundColor: "#F38332"}}>Get US $10 off<br/> with a new<br/> supplier</div>
            <div className="p-3 rounded-2 text-white" style={{backgroundColor: "#F0728D"}}>Send quotes with<br/> supplier<br/> preferences</div>
          </Col>
        </Row>)
        }
      </Container>
    </section>
  )
}

const BannerContent = ({type}) => (
  <Card className="banner text-white border-0 rounded-0 h-100">
    <Card.ImgOverlay className="d-flex flex-column justify-content-center text-dark">
      <Card.Title className="fs-4">Latest trending</Card.Title>
      <Card.Text className="display-6 fw-bold">Electronic items</Card.Text>
      <Button variant="light" className={`w-50 px-4 mt-2 ${type}`}>Learn more</Button>
    </Card.ImgOverlay>
  </Card>
);
export default Hero