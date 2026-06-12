import {createContext, useCallback, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : null;
  });
  const [loading, setLoading] = useState(true);
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const customerPath = "/customer"
  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  const token = getToken()
// Hook useCallback: We use it to prevent this function(fetchUserProfile) from changing as long as nothing important is affected."
  const fetchUserProfile = useCallback(() => {
    const savedData = localStorage.getItem('userData');
    const parsedData = savedData ? JSON.parse(savedData) : null;
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${base_url}${customerPath}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => {
      if(!res.ok){
        if (res.status === 401) {
          logout(); 
          throw new Error("Unauthorized");
        }
        return res.json().then((serverError)=>{
          throw new Error (serverError || 'Something went wrong!')
        })
      }
      return res.json()
    })
    .then(data => {
      if (data.message === "success") {
        const updatedData = { 
          ...parsedData, 
          data: { ...parsedData.data, ...data.data.user } 
        };
        
        setUserInfo(updatedData);
        localStorage.setItem('userData', JSON.stringify(updatedData));
      }
    })
    .catch(err => console.error("Auth API Error:", err))
    .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  const updateUserData = (data) => {
      setUserInfo(data); 
      if(data) {
          localStorage.setItem('userData', JSON.stringify(data));
      } else {
          localStorage.removeItem('userData');
      }
    }
  const logout = ()=>{
    localStorage.removeItem("userData")
    localStorage.removeItem("token")
    localStorage.removeItem("wishlist");
    localStorage.clear();
    setUserInfo(null)
  }
  return (
    <AuthContext.Provider value={{userInfo, setUserInfo, updateUserData, logout, loading}}>
      {children}
    </AuthContext.Provider>
  )
}
