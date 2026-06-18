import React from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';
import WishlistContent from '../Components/WishlistContent';
import { Link } from 'react-router-dom';

const Wishlist = () => {

  return (
    <div className='bg-white border' style={{borderRadius: "0 0 20px 20px"}}>
      <Container className="py-4">
        <Breadcrumb className="mb-4 gray px-3">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Wishlist</Breadcrumb.Item>
        </Breadcrumb>
        <WishlistContent />
      </Container>
    </div>
  );
};

export default Wishlist;