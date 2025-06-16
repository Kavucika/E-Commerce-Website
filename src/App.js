import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home';
import ShopNow from './Pages/Shopnow';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import ProductDetail from './Pages/ProductDetail';
import Wishlist from './Pages/Wishlist';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import OrdersSection from './Pages/OrdersSection';
import PrivateRoute from './Components/PrivateRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shopnow" element={<ShopNow />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrdersSection />} />
        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />
        <Route path="/Checkout" element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } />
        <Route path="/wishlist" element={
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        } /> 
        {/* ...other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
