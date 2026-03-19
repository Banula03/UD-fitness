import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;