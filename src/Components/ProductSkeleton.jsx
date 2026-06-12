import React from 'react'
import {  Col } from 'react-bootstrap';

const ProductSkeleton = () => (
  <Col className="border border-end border-bottom p-3">
    <div className="skeleton-wrapper" style={{ animation: 'placeholderShimmer 1.5s infinite linear', background: '#f6f7f8' }}>
      <div style={{ width: '100%', height: '180px', backgroundColor: '#eee', marginBottom: '10px' }}></div>
      <div style={{ width: '80%', height: '15px', backgroundColor: '#eee', marginBottom: '8px' }}></div>
      <div style={{ width: '40%', height: '15px', backgroundColor: '#eee' }}></div>
    </div>
    
    <style>{`
      @keyframes placeholderShimmer {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
      }
    `}</style>
  </Col>
);

export default ProductSkeleton