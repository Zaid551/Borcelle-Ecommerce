import { Route, Routes } from 'react-router'
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Home from './Pages/Home/Home'
import Login from './User/Login'
import Products from './Pages/Products';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';
import Verify from './User/Verify';
import SignUp from './User/SignUp';
import Profile from './User/Profile';
import Terms from './Help/Terms';
import ProfileLayout from './Layout/ProfileLayout';
import Contact from './Help/Contact';
import About from './Help/About';
import Faq from './Help/Faq';
import Privacy from './Help/Privacy';
import { AuthProvider } from './Contexts/AuthContext';
import MessagePage from './Components/MessagePage';
import MyCart from './Pages/MyCart';
import Checkout from './User/Checkout';
import ProductDetails from './Pages/ProductDetails';
import { CartProvider } from './Contexts/CartContext';
import Wishlist from './Pages/Wishlist';
import NotFound from './Pages/NotFound';
import { WishlistProvider } from './Contexts/WishlistContext';
import Blogs from './Pages/Blogs';
import AdminLayout from './Layout/AdminLayout';
import ManageProducts from './Pages/Admin/ManageProducts';
import AdminHome from './Pages/Admin/AdminHome';
import ManageCategories from './Pages/Admin/ManageCategories';
import ManageOrders from './Pages/Admin/ManageOrders';
const App = () => {
  return (
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <Routes>
          <Route path="/" element={<MainLayout  showBanner={false}><Home /> </MainLayout>} />
          <Route path="/products" element={<MainLayout  showBanner={false}><Products /> </MainLayout>} />
          <Route path="/products/:id" element={<MainLayout showSubscribe={false}><ProductDetails /> </MainLayout>} />
          <Route path="/blogs" element={<MainLayout  showBanner={false}><Blogs /> </MainLayout>} />
          <Route path="/myCart" element={<MainLayout showSecondaryNavbar = {false} showSubscribe={false} showContent={false}><MyCart /> </MainLayout>} />
          <Route path="/about" element={<ProfileLayout showSubscribe={false} showSecondaryNavbar = {false} title ="About Us Page" ><About /> </ProfileLayout>} />
          <Route path="/messageUs" element={<ProfileLayout showSecondaryNavbar = {false} showSubscribe={false} title ="Message Us Page"><MessagePage></MessagePage></ProfileLayout>} />
          <Route path="/wishlist" element={<ProfileLayout showSecondaryNavbar = {false} showSubscribe={false}  title ="Wishlist Page"><Wishlist /> </ProfileLayout>} />

          <Route path='/help'>
            <Route index element={<Navigate to="/" replace />} />
            <Route path="terms" element={<ProfileLayout showSubscribe={false} showSecondaryNavbar = {false} title ="Terms and Condition" ><Terms /> </ProfileLayout>} />
            <Route path="contact" element={<ProfileLayout showSubscribe={false} showSecondaryNavbar = {false} title ="Contact Us Page" ><Contact /> </ProfileLayout>} />
            <Route path="faq" element={<ProfileLayout showSubscribe={false} showSecondaryNavbar = {false} title ="FAQ Page" ><Faq /> </ProfileLayout>} />
            <Route path="privacy" element={<ProfileLayout showSubscribe={false} showSecondaryNavbar = {false} title ="Privacy Policy Page" ><Privacy /> </ProfileLayout>} />
          </Route>
          <Route path='/user'>
            <Route index element={<Navigate to="/" replace />} />
            <Route path="profile" element={<ProfileLayout showSubscribe={false} showSecondaryNavbar = {false}  title ="My Account"><Profile /> </ProfileLayout>} />
            <Route path="login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="signUp" element={<AuthLayout><SignUp /></AuthLayout>} />
            <Route path="verify" element={<AuthLayout><Verify /></AuthLayout>} />
            <Route path="checkout" element={<AuthLayout><Checkout /></AuthLayout>} />
          </Route>
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<AdminHome />} /> 
              <Route path='products' element={<ManageProducts />} />
              <Route path='categories' element={<ManageCategories />} />
              <Route path="orders" element={<ManageOrders />} />
            </Route>
          <Route path="/*" element={<MainLayout showBanner={false} showSecondaryNavbar = {false} showSubscribe={false}><NotFound /></MainLayout>} />
        </Routes>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
  )
}

export default App