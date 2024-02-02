import { useState } from "react";
import "./App.css";
import ProductList from "./ProductList";
import Cart from "./Cart";

function App() {
  return (
    <div className="box fade-background">
      <header className="fading-lines">
        <h1>PC Parts Store</h1>
      </header>
      <div className="Container">
        <div className="leftContainer">
          <ProductList />
        </div>
        <div className="rightContainer">
          <Cart />
        </div>
      </div>
    </div>
  );
}

export default App;
