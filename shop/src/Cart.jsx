import React, { useState } from "react";
import { useCart } from "./CartContext";

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    postOffice: "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleBuy = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userInfo);
    clearCart();
    setShowForm(false);
    setFormSubmitted(true);
  };

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id}>
          <span>
            {item.name} (x{item.count})
          </span>
          <span> ${item.price}</span>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={clearCart}>Clear Cart</button>
      <button onClick={handleBuy}>Buy</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
          />
          <input
            name="zip"
            placeholder="Zip Code"
            onChange={handleChange}
            required
          />
          <input
            name="postOffice"
            placeholder="Post Office"
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {formSubmitted && <p>Thanks for purchasing from our store!</p>}
    </div>
  );
}

export default Cart;
