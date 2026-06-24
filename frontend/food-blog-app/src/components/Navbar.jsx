import React, { useState, useEffect } from 'react'
import Modal from './Modal';
import InputForm from './InputForm';
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from '../context/CartContext';
import { BsCart3 } from 'react-icons/bs';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const { cartItems } = React.useContext(CartContext);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Listen for storage changes (login/logout from InputForm)
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("authChange", handleStorage);
    return () => window.removeEventListener("authChange", handleStorage);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      setIsOpen(true);
    }
  };

  const handleNavClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsOpen(false);
  };

  return (
    <div>
      <header>
        <h2 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          F<span style={{ color: "#1a7a54" }}>oo</span>deez
        </h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li onClick={!isLoggedIn ? handleNavClick : undefined}>
            <NavLink to={isLoggedIn ? "/myRecipe" : "/"}>My Recipes</NavLink>
          </li>
          <li onClick={!isLoggedIn ? handleNavClick : undefined}>
            <NavLink to={isLoggedIn ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>
          <li onClick={!isLoggedIn ? handleNavClick : undefined}>
            <NavLink to={isLoggedIn ? "/cart" : "/"} className="cart-nav" style={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
              <BsCart3 size={18} />
              <span className="cart-text">Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          </li>
          {isLoggedIn && (
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          )}
          <li>
            <span className="login-btn" onClick={handleAuthClick}>
              {isLoggedIn ? "Logout" : "Login"}
            </span>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm onSuccess={handleLoginSuccess} />
        </Modal>
      )}
    </div>
  );
}
