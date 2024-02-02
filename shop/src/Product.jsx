import React, { useState } from "react";
import { useCart } from "./CartContext";

function Product({ product }) {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div
      className="product"
      onClick={handleDetails}
      style={{ display: "flex", alignItems: "center" }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "40%", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)" }}
      />
      <div style={{ width: "60%" }}>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>${product.price}</p>
        {showDetails && (
          <div>
            <p>{product.details}</p>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default Product;
