import React from 'react'
// import { useCart } from '../Contexts/CartContext'
// import { Button } from 'react-bootstrap'
// import { Cart } from 'react-bootstrap-icons'

export const MiniCard = ({product}) => {
  
  // const {addToCart} = useCart()
  return (
    <div className="recommend-card-wrapper h-100">
      <div className="custom-animated-card">
        <div className="card-inner-content p-3">
          
          <div className="recommend-image text-center mb-2">
            <img 
              src={product.image || product.img} 
              alt={product.description} 
              className="img-fluid" 
              style={{ height: "120px", objectFit: "contain" }}
            />
          </div>
          
          <div className="d-flex flex-column flex-grow-1">
            <h6 className="fw-bold mt-2 text-dark">${product.price}</h6>
            <p className="mb-1 small text-muted text-clamp" style={{ fontSize: "13px" }}>
              {product.description}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}
