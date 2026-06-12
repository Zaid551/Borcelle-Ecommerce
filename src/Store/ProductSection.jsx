import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'react-bootstrap-icons';
import { ProductService } from '../Services/ProductsServices';
import ProductSkeleton from '../Components/ProductSkeleton';


const ProductSection = ({ title, limit, hasTimer, bannerImg, selectView, page }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); 
        const data = await ProductService.getAllProducts({ 
          page: page || 1, 
          per_page: limit 
        });

        if (data && data.data) {
          setProducts(data.data.slice(0, limit));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [page, limit]); 
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  useEffect(() => {
    const targetDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d < 10 ? `0${d}` : d,
        hours: h < 10 ? `0${h}` : h,
        minutes: m < 10 ? `0${m}` : m,
        seconds: s < 10 ? `0${s}` : s
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
    const timerUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hour' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];
  return (
    <section className='pt-3 fade-in'>
      <Container >
        <Row className="border border-bottom-0 border-end-0  bg-white empty-state-container">
          <Col lg={3} md={5} className="d-none d-md-flex border-end flex-column p-4 pt-5" 
              style={{ background: `url(${bannerImg}) center/cover` }}>
            <h5 className="fw-semibold"style={{width: "160px"}}>{title}</h5>
            {hasTimer ? (<>
              <p className='gray-500'>Hygiene equipments</p>
              <div className="d-flex gap-2">
                {timerUnits.map((unit, index) => (
                  <div 
                    key={index} 
                    className="text-center text-white rounded p-2" 
                    style={{ width: '60px', backgroundColor: '#606060' }}
                  >
                    <div className="fw-bold fs-5">{unit.value}</div>
                    <div style={{ fontSize: '10px' }}>{unit.label}</div>
                  </div>
                ))}
              </div>
              </>
            ) : (
              <div>
                <Button variant='light'
                  className=" mt-3 w-fit shadow-sm" onClick={()=>{navigate("/products")}}>Source now</Button>
              </div>
            )}
          </Col>
          <Col lg={9} md={8}>
            {isMobile  ? (
              <>
              <div className='d-flex justify-content-between'>
                <div>
                  <h6 className='pt-4 fw-semibold' style={{fontSize: "18px", color: "#1c1c1c"}}>{title}</h6>
                  {hasTimer && (<p>Electronic equipments</p>)}
                </div>
                {hasTimer && (
                  <div className="d-flex gap-2 pt-4">
                  {timerUnits.map((unit, index) => (
                    <div key={index} className={`text-center rounded p-2 gray ${index === 0 ? 'd-none d-lg-block' : 'd-block'}`} style={{ width: '50px', height: "60px" , background: "#EFF2F4" }}>
                      <div className="fw-bold fs-5">{unit.value}</div>
                      <div style={{ fontSize: '12px' }}>{unit.label}</div>
                    </div>
                  ))}
                </div>
                )}
              </div>
                <Swiper slidesPerView={2.2} spaceBetween={10} className=" border">
                  {products.map(item => (
                    <SwiperSlide key={item.id} className=' border-end h-100'>
                      <ProductCard item={item} variant={selectView}/>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className=' border-bottom py-3 m-0'>
                  <Button variant='white'
                      className='save-for-later-btn pink-color text-start w-100 '
                      style={{border : "1px solid transparent"}}
                      onClick={()=>{navigate("/products")}}>Source now <ArrowRight /></Button>
                </div>
              </>
            ) : (
              <Row className={`row-cols-2 row-cols-md-3 row-cols-lg-${limit === 5 ? '5' : '5'} section-${selectView}`}>
                {isLoading ? (
                  Array.from({ length: limit || 10 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                ) : products.length > 0 ? (
                  products.map(item => (
                    <Col key={item.id} className="border border-end border-bottom p-0">
                      <ProductCard item={item} variant={selectView} />
                    </Col>
                  ))
                ) : (
                  <div className="w-100 text-center py-5">
                    <p className="text-muted">No products found.</p>
                  </div>
                )}
              </Row>
            )}
          </Col>

        </Row>
      </Container>
    </section>
  );
};
export default ProductSection;