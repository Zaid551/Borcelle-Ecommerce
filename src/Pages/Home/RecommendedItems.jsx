import { Container, Row, Col, Button} from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import { MiniCard } from '../../Store/MiniCard.jsx';
import { ProductService } from '../../Services/ProductsServices.js';
import ProductSkeleton from '../../Components/ProductSkeleton.jsx';

const RecommendedItems = ({title}) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); 
        const data = await ProductService.getAllProducts({ page: 2 });

        if (data && data.data) {
          setProducts(data.data.slice(0,10));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, []); 
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section>
      <Container className='mt-3'>
        <h4 className="fw-semibold mb-3">{title || "Recommended items"}</h4>
        {isMobile ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={15}
            slidesPerView={3}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-5"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="d-flex h-auto">
                <MiniCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Row className="g-3 row-cols-1 row-cols-md-3 row-cols-lg-5">
            {isLoading ? (
                  Array.from({ length:  10 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <Col key={product.id}> 
                      <MiniCard product={product} />
                    </Col>
                  ))
                ) : (
                  <div className="w-100 text-center py-5">
                    <p className="text-muted">No products found.</p>
                  </div>
                )}
          </Row>
        )}
      </Container>
    </section>
  )
}

export default RecommendedItems