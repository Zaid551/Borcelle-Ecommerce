import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import DynamicModal from '../Components/DynamicModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('guestCart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success',
    isConfirm: false
  });
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api";
  const cartPath = "/cart";

  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  useEffect(() => {
      const token = getToken();
      if (!token) {
        localStorage.setItem('guestCart', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('guestCart'); 
      }
    }, [cartItems]);
  const fetchCartFromServer = useCallback(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${base_url}${cartPath}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      if (data.message === "success" && data.data) {
        setCartItems(data.data);
      }
    })
    .catch(err => console.error("Error fetching cart:", err));
  }, []);

useEffect(() => {
  const token = getToken();
  
  if (token) {
    fetchCartFromServer();
  } else {
    const localCart = localStorage.getItem('guestCart');
    if (localCart) {
      setCartItems(JSON.parse(localCart));
    }
  }
}, [fetchCartFromServer]);

const addToCart = (product, quantity = null) => {
  const token = getToken();
  if (!token) {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.product?.id === product.id);
        const newQty = quantity !== null ? quantity : (existingItem ? existingItem.quantity + 1 : 1);
        
        if (existingItem) {
          return prev.map(item => 
            item.product.id === product.id ? { ...item, quantity: newQty } : item
          );
        }

        return [...prev, { id: Date.now(), product: product, quantity: newQty }];
      });

      setModalConfig({
        show: true,
        title: 'Success',
        message: 'Product added to local cart! Login to save it permanently.',
        type: 'success'
      });
      return;
    }
  if (!product?.id || !token) return;
  
  const existingItem = cartItems.find(item => item.product?.id === product.id);
  
  const newQty = quantity !== null ? quantity : (existingItem ? existingItem.quantity + 1 : 1);
  const requestBody = {
    product_id: product.id,
    quantity: newQty
  };

  fetch(`${base_url}${cartPath}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(requestBody)
  })
  .then(res => res.json())
  .then(data => {
    console.log(token)
    if (data.code === 1 || data.message === "success") {
      fetchCartFromServer(); 
    }
  })
  .catch(err => console.error("Error adding to cart:", err));
};

  const handleQtyChange = (cartItemId, newQty) => {
    const updatedQty = parseInt(newQty);
    if (updatedQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    const itemToUpdate = cartItems.find(item => item.id === cartItemId);
    if (!itemToUpdate) return;

    setCartItems(prev =>
      prev.map(item => item.id === cartItemId ? { ...item, quantity: updatedQty } : item)
    );

    if (itemToUpdate) {
      addToCart(itemToUpdate.product, updatedQty); 
    }
  };

  const handleRemoveItem = (cartItemId) => {
    const token = getToken();
    if (!token) {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      return;
    }
    fetch(`${base_url}${cartPath}/${cartItemId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.code === 1 || data.message === "success") {
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      }
    })
    .catch(err => console.error("Error removing item:", err));
  };

  const clearCart = () => setCartItems([]);

  const applyCoupon = () => {
  if (couponCode.trim() === "c2026") { 
    setIsCouponApplied(true);
    setModalConfig({
      show: true,
      title: 'Successfully...',
      message: 'Coupon Applied Successfully!',
      type: 'success'
    })
  } else {
    setIsCouponApplied(false);
    setModalConfig({
      show: true,
      title: 'Oh Sorry...',
      message: 'Invalid Coupon Code',
      type: 'warning'
    })
  }
};

  const subTotal = cartItems.reduce((acc, item) => {
    return acc + ((item.product?.price || 0) * (item.quantity || 0));
  }, 0);

  // const tax = subTotal * 0.02;
  const tax = 0;
  const discount = isCouponApplied ? (subTotal * 0.10) : 0;
  const total = Math.max(0, subTotal + tax - discount);

  const syncCartWithServer = useCallback(async () => {
    const token = getToken();
    const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];

    if (!token || localCart.length === 0) return;
    for (const item of localCart) {
      await addToCart(item.product, item.quantity);
    }

    localStorage.removeItem('guestCart');
    fetchCartFromServer();
  }, [getToken, addToCart, fetchCartFromServer]);
  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, handleQtyChange, 
      handleRemoveItem, clearCart, couponCode, setCouponCode, applyCoupon, syncCartWithServer, subTotal, tax, discount, total 
    }}>
      {children}
      <DynamicModal 
        show= {modalConfig.show}
        handleClose={() => setModalConfig({ ...modalConfig, show: false })}
        title = {modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);