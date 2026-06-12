import { Col, Card, Button } from 'react-bootstrap'
import { Cart, Heart, StarFill, InfoCircle, HeartFill } from 'react-bootstrap-icons';
import { useCart } from '../Contexts/CartContext';
import { useContext } from "react";
import { useNavigate } from 'react-router';
import { WishlistContext } from '../Contexts/WishlistContext';

const Product = ({viewMode, data}) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const isGrid = viewMode === 'grid';

  const {addToCart} = useCart()
  return (
    <>
      {data?.map((product) => (
          <Col key={product.id} xs={12} md={isGrid ? 4 : 12} className="mb-3 fade-in">
            <Card className={`h-100 border shadow-sm empty-state-container ${isGrid ? 'text-center' : ''}`}>
              <div className={isGrid ? 'd-block' : 'row g-0 align-items-center flex-nowrap'}>
                <div className={isGrid ? 'p-3 text-center' : 'col-4 col-md-3 p-3 text-center'}>
                  <Card.Img 
                    src={product.image} 
                    className='product-img'
                    style={{ maxWidth: '100%', 
                    height: isGrid ? '180px' : '100px', objectFit: 'contain' }} 
                  />
                </div>
                <div className={isGrid ? 'card-body' : 'col-8 col-md-9'}>
                  <Card.Body className="position-relative p-2">
                    <Button 
                      onClick={()=> {toggleWishlist(product)}}
                      variant="outline-primary" 
                      className="position-absolute top-0 end-0 mt-2 me-2 p-1 px-2 border-0 bg-white">
                      {isInWishlist(product.id) 
                      ? (<HeartFill size={20} className='pink wish-btn'/>)
                      : (<Heart size={20} className='pink wish-btn'/>)}
                      
                    </Button>
                    {isGrid ? (
                      <>
                        <div className={`d-flex align-items-baseline gap-2 ${isGrid ? 'mb-1' : 'mb-2'}`}>
                          <h4 className="prod-price fw-semibold mb-0">${product.price.toLocaleString()}</h4>
                          {product.oldPrice && (
                            <span className="gray text-decoration-line-through small">
                              ${product.oldPrice  || 0}
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <div className="me-2 d-flex align-items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarFill key={i} className={i < 4 ? 'star-color' : 'star-nonColor'} style={{ fontSize: "16px" }} />
                            ))}
                            <span className="ms-2 star-color">{product.rating  || 7.5}</span>
                          </div>
                        </div>
                        <Card.Title className="prod-title fs-6 gray-800 fw-normal mb-2 text-start">
                          {product.name}
                        </Card.Title>
                      </>
                    ) : (
                      <>
                        <Card.Title className="prod-title fw-medium mb-3">{product.name}</Card.Title>
                        <div className="d-flex align-items-baseline gap-2 mb-2">
                          <h4 className="prod-price fw-semibold mb-0">${product.price.toLocaleString()}</h4>
                          {product.oldPrice && (
                            <span className="gray text-decoration-line-through small">${product.oldPrice || 0} </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center mb-2 flex-wrap">
                          <div className="me-2 d-flex align-items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarFill key={i} className={i < 4 ? 'star-color' : 'star-nonColor'} style={{ fontSize: "16px" }} />
                            ))}
                            <span className="ms-2 star-color">{product.rating  || 7.5}</span>
                          </div>
                          <span className="gray mx-2">•</span>
                          <span className="gray small">{product.orders || 154} orders</span>
                          <span className="gray mx-2">•</span>
                          <span className="text-success small">Free Shipping</span>
                        </div>
                        <Card.Text className="gray-600 small mb-3">
                          {product.description}
                        </Card.Text>
                      </>
                    )}
                    <div className='d-flex justify-content-between px-3'>
                      <Button 
                        onClick={() => {navigate(`/products/${product.id}`)}}
                        variant="link" 
                        className={`text-decoration-none pink-color mt-3 p-0 save-for-later-btn ${isGrid ? 'fs-7' : 'fs-6'}`}
                      >
                        <InfoCircle size={isGrid ? 22 : 20} className='me-2'/>
                        {!isGrid ? "View details" : "View"}
                      </Button>
                      <Button 
                        onClick={() => {addToCart(product)}}
                        variant="link" 
                        className={`text-decoration-none pink-color mt-3 p-0 save-for-later-btn ${isGrid ? 'fs-7 me-0' : 'fs-6 me-5'}`}
                      >
                        <Cart size={isGrid ? 22 : 20} className='me-2'/>
                        {!isGrid ? "Add to Cart" : "Add"}
                      </Button>
                    </div>
                  </Card.Body>
                </div>
              </div>
            </Card>
          </Col>
        ))}
    </>
  )
}

export default Product