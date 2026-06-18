import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Breadcrumb, Modal } from 'react-bootstrap';
import { StarFill, HeartFill, Heart, Basket3, ChatLeftText, Eye} from 'react-bootstrap-icons';
import { useParams } from 'react-router';
import { useContext } from "react";
import { WishlistContext } from '../Contexts/WishlistContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { CheckLg } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useCart } from '../Contexts/CartContext';
import RecommendedItems from './Home/RecommendedItems';
import { ProductService } from '../Services/ProductsServices';
const ProductDetails = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)
  useEffect(()=>{
    const handleResize = () => setIsMobile(window.innerWidth < 992)
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
  },[])
  const {addToCart} = useCart()
  const { toggleWishlist, isInWishlist, setWishlistItems, wishlistItems } = useContext(WishlistContext);
  const [details, setDetails] = useState({})
  const [showDesign, setShowDesign] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const {id} = useParams()
  useEffect(()=>{
    const callDetailsApi = () => {
      ProductService.getProductById(id)
      .then(data => {
        console.log(data.data)
        setDetails(data.data)
      })
      .catch((err)=>{
          console.error("Error fetching data:", err);
      })
      .finally(()=>{
          console.log("API Call Ended!!!!")
      })
    }
    if(id){
      callDetailsApi()
    }
  }, [id])
  useEffect(()=>{
    if(details && details.is_favorite){
      const isAlreadyInWishlist = wishlistItems.some(item => {
      const actualId = item.product ? item.product.id : item.id;
      return String(actualId) === String(details.id);
      
    });
    if(!isAlreadyInWishlist){
      setWishlistItems((prev) => [...prev,{id: details.id, product: details}])
    }
    }
  },[details, setWishlistItems, wishlistItems])
  const product = {
    inStock: true,
    rating: 9.3,
    reviews: 32,
    soldCount: 154,
  };

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
    setShowImageModal(true);
  };
  const allProductImages = [details.image, ...(details.images || [])];

  return (
    <Container className="py-4 product-header-section fade-in">
      {!isMobile && (<Row>
        <Col lg={12}>
          <Breadcrumb style={isMobile ? { fontSize: "14px" } : {}}>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
              All Category
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {details.category?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {details.name}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>)}
      <Row className='border rounded-2 p-3 bg-white empty-state-container'>
        <Col lg={6} className="position-relative ">
          {isMobile ? (
            <div className="mobile-swiper-wrapper position-relative">
              <Swiper
                key={allProductImages.length}
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                initialSlide={0} 
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                className="rounded-3 border"
              >
                {allProductImages.map((img, index) => (
                  <SwiperSlide 
                    key={index}
                    onClick={() => handleImageClick(img)} 
                    className="text-center p-3" 
                    style={{ backgroundColor: "#F0F0F0", height: '305px', cursor: 'pointer' }}
                  >
                    <img 
                      src={img} 
                      alt={`Product ${index}`} 
                      className="img-fluid" 
                      style={{ width: "100%", height: '100%', objectFit: 'contain' }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="custom-nav-wrapper d-flex gap-2">
                <button className="swiper-button-prev-custom shadow-sm">
                  <ArrowLeft size={20} />
                </button>
                <button className="swiper-button-next-custom shadow-sm">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ height: '400px', cursor: 'zoom-in' }} 
                onClick={() => handleImageClick(allProductImages[mainImageIndex])}
                className="main-image-container border rounded-3 p-3 mb-3 text-center" >
                <img 
                    src={allProductImages[mainImageIndex]}
                    alt={details.name} 
                    className="img-fluid" 
                    style={{width: "100%", height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                {allProductImages.map((thumb, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail-container border rounded-2 p-1 ${mainImageIndex === index ? 'border-dark' : ''}`} 
                    style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                    onClick={() => setMainImageIndex(index)}
                  >
                    <img src={thumb} alt={`Thumbnail ${index + 1}`} className="img-fluid h-100 object-fit-contain" />
                  </div>
                ))}
              </div>
            </>
          )}
        </Col>

        <Col lg={6}>
          <Card className="border-0  p-3 h-100">
            {product.inStock && (
              <div className="d-flex align-items-center text-success mb-2 small">
                <CheckLg size={20} className="me-2" />
                <span>In stock</span>
              </div>
            )}

            <h4 className="fw-bold mb-3 product-title text-dark">{details.name}</h4>
            
            <div className="d-flex align-items-center gap-2 mb-4" style={{fontSize: "16px"}}>
              {[...Array(5)].map((_, i) => (
                <StarFill key={i} className={i < 4 ? 'star-color' : 'star-nonColor'} style={{ fontSize: "16px" }} />
              ))}
              <span className=" star-color">
                {product.rating}
              </span>
              <span className="gray mx-2" style={{color: "#DBDBDB"}}>•</span>
              <span style={{color: "#787A80"}}>
                <ChatLeftText size={16} /> {product.reviews} reviews</span>
              <span className="gray mx-2" style={{color: "#DBDBDB"}}>•</span>
              <span style={{color: "#787A80"}}>
                <Basket3 size={16} /> {product.soldCount} sold
              </span>
            </div>
            <div className="price-container rounded-3 p-3 mb-4" 
                style={isMobile ? {backgroundColor : "#F7FAFC"} : {backgroundColor : "#FF901710"}}>
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="fw-bold mb-0" style={{ color: "#FA3434", fontSize: "24px" }}>
                  ${details.price?.toLocaleString()}
                </h2>
                <span className="text-muted text-decoration-line-through small">
                  ${(details.price * 1.2).toLocaleString()}
                </span>
                <span className="badge bg-danger bg-opacity-10 text-danger fw-normal ms-auto">
                  -10% OFF
                </span> 
              </div>

              {details.prices?.[0]?.from > 1 && (
                <p className="text-muted small mb-0 mt-1">
                  {details.prices[0].from} pcs (Min. Order)
                </p>
              )}

              {details.prices && details.prices.length > 1 && (
                <div className="mt-3 pt-3 border-top border-secondary border-opacity-10">
                  <h6 className="fw-bold text-dark small mb-3">Wholesale Pricing:</h6>
                  <div className="d-flex gap-4 flex-wrap">
                    {details.prices.map((p, i) => (
                      <div key={i} className={`price-bracket ${i > 0 ? 'border-start ps-4' : ''}`}>
                        <span className="d-block fw-bold text-dark">${p.price}</span>
                        <span className="text-muted" style={{ fontSize: "11px" }}>
                          {p.from === p.to ? `${p.from} pc` : `${p.from}-${p.to} pcs`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {isMobile && (
              <div className="d-flex gap-2 mb-4">
                <Button 
                  onClick={() => addToCart(details)} 
                  className="send-btn flex-grow-1 border-0 py-2 fw-bold"
                >
                  Add to cart
                </Button>
                <Button 
                  variant="white" 
                  onClick={() => toggleWishlist(details)}
                  className="d-flex align-items-center justify-content-center px-3"
                  style={{ borderColor: '#dee2e6' }}
                >
                  {isInWishlist(details.id) ? <HeartFill className="pink-color" size={22} /> : <Heart size={22} />}
                </Button>
              </div>
            )}
          
            {!isMobile && (
              <div>
                <p className="text-muted mb-4 fs-6" style={{ lineHeight: '1.8' }}>
                  {details.description}
                </p>
            </div>
            )}
            <Table borderless size="sm" className="properties-table mb-0">
              <tbody>
                <tr className='border-bottom'><td className="ps-0 py-1 text-nowrap">Category:</td><td className="pb-2 fw-medium">{details.category?.name || "Uncategorized"}</td></tr>
                <tr><td className="ps-0 py-1 text-nowrap">Model SKU:</td><td className="pb-2">{details.sku}</td></tr>
                <tr>
                  <td className="ps-0 py-1 text-nowrap">Design:</td>
                  <td className="pb-2">
                    <Button 
                      variant="link" 
                      className="save-for-later-btn p-0 fw-semibold pink-color fw-medium text-decoration-none" 
                      onClick={() => setShowDesign(true)}
                    >
                      <Eye size={18}/> Show Blueprints
                    </Button>
                  </td>
                </tr>
                <tr className='border-bottom'>
                  <td className="ps-0 py-1 text-nowrap">Color:</td>
                  <td className="pb-2 gap-3 d-flex justify-content-start align-items-center">
                    {details.colors && details.colors.length > 0
                    ? (<>
                      {details.colors.map(color => (
                        <div key={color.id}>
                          <span 
                            className="rounded-circle border me-1 pb-2" 
                            style={{ 
                              width: '15px', 
                              height: '15px', 
                              backgroundColor: color.hex,
                              display: 'inline-block'
                            }}></span>
                          <span className="">{color.name}</span>
                        </div>
                      ))}
                  </>)
                    :(
                    <span className="pb-2">
                      Not specified
                    </span>)}
                  </td>
                </tr>
              </tbody>
            </Table>
            {!isMobile && (
              <>
                <Button onClick={() => addToCart(details)} className="send-btn w-100 border-0 my-3 btn-nonHover" size="lg">Add to Cart</Button>
                <Button 
                  onClick={() => {toggleWishlist(details)}}
                  variant="link" className="text-decoration-none d-flex gap-2 justify-content-center align-items-center pink-color w-100 mt-3 p-0 fs-6 save-for-later-btn">
                  {isInWishlist(details.id)
                      ? (<HeartFill size={20} />)
                      : (<Heart size={20} />)}
                  Save For Later
                </Button>
              </>
            )}
            
            {isMobile && (<div className="mt-3">
              <p className={`text-muted small ${isMobile ? 'mb-1' : ''}`} style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {details.description}
              </p>
              <Button variant="link" className="p-0 pink-color text-decoration-none small fw-bold">Read more</Button>
            </div>)}
          </Card>
        </Col>
      </Row>
      <RecommendedItems title={"Similar products"} page={1}/>
      <Modal show={showDesign} onHide={() => setShowDesign(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Design Layout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={details.design} alt="Design" className="img-fluid rounded" />
        </Modal.Body>
      </Modal>
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Body className="text-center p-0">
          <img 
            src={selectedImage} 
            alt="Full Size" 
            className="img-fluid rounded" 
            style={{ maxHeight: '80vh', objectFit: 'contain' }} 
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProductDetails;