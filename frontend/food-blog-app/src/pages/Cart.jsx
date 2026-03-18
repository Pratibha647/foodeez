import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import defaultFoodImg from '../assets/foodRecipe1.avif';
import { BsTrash } from 'react-icons/bs';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        showToast("Order placed successfully! 🚀 Check your email for details.");
        setTimeout(() => {
            clearCart();
            navigate("/");
        }, 2000);
    };

    const subtotal = getCartTotal();
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = (subtotal + tax).toFixed(2);

    return (
        <>
            <div className="page-header">
                <h2>Your Cart 🛒</h2>
                <p>Review your ordered meals</p>
            </div>

            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-state">
                            <h3>Your cart is empty</h3>
                            <button className="btn-edit" style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img
                                    src={item.coverImage || defaultFoodImg}
                                    alt={item.title}
                                    onError={(e) => { e.target.src = defaultFoodImg; }}
                                />
                                <div className="cart-item-info">
                                    <h4>{item.title}</h4>
                                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-control">
                                        <button onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    </div>
                                    <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                                    <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                                        <BsTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Estimated Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </>
    );
}
