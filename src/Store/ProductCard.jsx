import React, { useEffect, useState } from 'react'

const ProductCard = ({ item, variant }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
if (variant === "deal") {
    return (
      <div className="custom-product-card p-3 text-center py-2 h-100 d-flex flex-column align-items-center justify-content-between">
        <div style={{ height: "120px" }} className="mb-2 py-3">
          <img src={item.image} className="img-fluid h-100 object-fit-contain" alt={item.name} />
        </div>
        <p className="small mb-1 text-dark">{item.name}</p>
        <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2" 
              style={{ fontSize: '0.75rem', backgroundColor: '#FFE3E3' }}>
          -25%
        </span>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <>
      {!isMobile
      ? (<div className="custom-product-card p-3 d-flex flex-column h-100 p-2"> 
      <h6 className="text-dark text-truncate-2" style={{ fontSize: "16px", minHeight: "19px" }}>
        {item.name}
      </h6>
      <div className="d-flex justify-content-between align-items-end mt-auto w-100">
        <p className="gray mb-0" style={{ fontSize: "13px" }}>
          From <br/> USD {item.price}
        </p>
        <div style={{ width: "70px", height: "70px" }} className="flex-shrink-0">
          <img src={item.image} className="img-fluid h-100 object-fit-contain" alt={item.name} />
        </div>
      </div>
    </div>)
      : (<>
      <div className="custom-product-card p-3 text-center py-2 h-100 d-flex flex-column align-items-center justify-content-between">
        <div style={{ height: "120px" }} className="py-4">
          <img src={item.image} className="img-fluid h-100 object-fit-contain" alt={item.name} />
        </div>
        <h6 className="small mb-1 text-dark">{item.name}</h6>
        <p className="gray d-block" style={{fontSize: "13px"}}>From USD {item.price}</p>
      </div>
      </>)
    }
        
      </>
    );
  }
}

export default ProductCard