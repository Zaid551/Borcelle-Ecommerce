import { createContext, useEffect, useState } from 'react'
import DynamicModal from '../Components/DynamicModal'

export const WishlistContext = createContext()

export const WishlistProvider = ({children}) => {
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const favoritePath = "/favorite"
  const [wishlistItems, setWishlistItems] = useState([]);
    const [modalConfig, setModalConfig] = useState({
      show: false,
      title: '',
      message: '',
      type: 'success',
      isConfirm: false
    });
  useEffect(()=>{
    if(wishlistItems.length > 0){
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    }
  },[wishlistItems])
  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  const token = getToken()
  useEffect(()=>{
    if (!token) return;
    const callApiShowFavorite = () => {
      fetch(`${base_url}${favoritePath}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Accept-Language": "en",
          "Authorization": `Bearer ${token}` 
        }})
      .then(res => {
            if(!res.ok){
              return res.json().then((serverError)=>{
                throw new Error (serverError || 'Something went wrong!')
              })
            }
            return res.json()
          })
      .then((data) => {
        console.log(data);
        if (data.message === "success" && data.data) {
          setWishlistItems(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
      })
      .finally(() => {
        console.log("Wishlist API Call Ended!!!!");
      });
    }
    callApiShowFavorite()
  },[token])


  const toggleWishlist = (product) => {
    const isExist = wishlistItems.find(item => item.id === product.id)
      if(isExist){
        removeFromWishlist(product.id)
      }else{
        addToFavorite(product)
      }
  };
  const addToFavorite = (product)=>{
    const requestBody = {
      product_id: product.id,
    };
    if(!token){
    setModalConfig({
      show: true,
      title: 'Login Required',
      message: 'Log in first to be able to add products to your favorites',
      type: 'warning'
    })
    }
    const callApiStoreFavorite = () => {
      fetch(`${base_url}${favoritePath}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "en",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(requestBody)
      })
      .then(res => {
            if(!res.ok){
              return res.json().then((serverError)=>{
                throw new Error (serverError || 'Something went wrong!')
              })
            }
            return res.json()
          })
      .then((data) => {
        console.log(data);
        setWishlistItems(prev => [...prev, { ...product, favorite_id: data.data?.id }]);
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
      })
      .finally(() => {
        console.log("API Call Ended!!!!");
      });
    }
    callApiStoreFavorite()
  }
  const removeFromWishlist = (favoriteId) => {
    const callApiDeleteFromCart = () => {
      fetch(`${base_url}${favoritePath}/${favoriteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })
      .then(res => {
        if(!res.ok){
          return res.json().then((serverError)=>{
            throw new Error (serverError || 'Something went wrong!')
          })
        }
        return res.json()
        })
      .then((data) => {
        console.log( data);
        if (data.message === "success") {
          setWishlistItems(prev => prev.filter(item => {
            const actualId = item.product ? item.product.id : item.id;
            return actualId !== favoriteId;
          }));
        console.log("Done");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
      })
      .finally(() => {
        console.log("API Call Ended!!!!");
      });
    }
    callApiDeleteFromCart()
  };
const isInWishlist = (productId) => {
  return wishlistItems.some(item => {
    const actualProductId = item.product ? item.product.id : (item.product_id || item.id);
    return String(actualProductId) === String(productId);
  });
};
  return (
    <WishlistContext.Provider value={{ wishlistItems, setWishlistItems ,toggleWishlist, removeFromWishlist, isInWishlist }}>
        {children}
      <DynamicModal 
        show= {modalConfig.show}
        handleClose={() => setModalConfig({ ...modalConfig, show: false })}
        title = {modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </WishlistContext.Provider>
  )
}