import React, { useContext } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Cart, Heart, HeartFill, StarFill, Trash } from 'react-bootstrap-icons';
import { useCart } from '../Contexts/CartContext';
import { WishlistContext } from '../Contexts/WishlistContext';

// هذا المكون يعرض فقط القائمة
const WishlistContent = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <Card className="text-center p-5 border-0 bg-transparent fade-in">
        <Card.Body className='empty-state-container'>
          <div className="display-1 pink-color opacity-75 mb-3"><HeartFill /></div>
          <Card.Title className="h5 text-muted">Your Wishlist is Empty</Card.Title>
          <Button href="/products" className='send-btn rounded-2 border-0 pink-bg text-white px-5 py-2 mt-3'>Start Shopping</Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {wishlistItems.map(item => {
        const actualProduct = item.product || item;
        return (
          <div className='fade-in'>
            <Card key={item.id} className="mb-3 border-0 overflow-hidden empty-state-container" style={{ borderRadius: '8px' }}>
            <Row className="g-0 align-items-center">
              <Col xs={4} md={2} className="p-3 text-center">
                <img 
                  src={actualProduct.image} 
                  alt={actualProduct.name} 
                  className="img-fluid rounded"
                  style={{ maxHeight: '80px', objectFit: 'contain' }}
                />
              </Col>
              <Col xs={8} md={7} className="p-3">
                <h6 className="fw-semibold text-truncate mb-1">{actualProduct.name}</h6>
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="h5 fw-bold text-dark mb-0">${actualProduct.price}</span>
                </div>
                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarFill key={i} className={i < 4 ? 'star-color' : 'star-nonColor'} style={{ fontSize: "14px" }} />
                  ))}
                  <span className="ms-2 star-color small">{actualProduct.rating || 7.5}</span>
                </div>
              </Col>
              <Col xs={12} md={3} className="p-3 d-flex d-md-block gap-2 border-top border-md-top-0">
                <Button 
                  className="w-100 mb-md-2 send-btn border-0 py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => addToCart(actualProduct)}
                >
                  <Cart size={14} /> Add
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="w-100 py-2 d-flex align-items-center justify-content-center gap-2 small" 
                  onClick={() => removeFromWishlist(item.product?.id || item.id)}
                >
                  <Trash size={14} /> Remove
                </Button>
              </Col>
            </Row>
          </Card>
          </div>
        );
      })}
    </>
  );
};

export default WishlistContent;