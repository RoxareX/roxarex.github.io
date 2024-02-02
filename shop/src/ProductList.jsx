import React, { useState } from "react";
import Product from "./Product";

function ProductList() {
  const [products] = useState([
    {
      id: 1,
      name: "CPU",
      description: "Intel i7",
      price: 300,
      details: "8 Cores, 16 Threads, up to 5.0 GHz Max Turbo Frequency",
      image: "/cpu.png",
    },
    {
      id: 2,
      name: "CPU Cooler",
      description: "Cooler Master Hyper 212",
      price: 40,
      details: "4 Heat pipes, 120mm PWM Fan, Aluminum Fins",
      image: "/cpu-cooler.png",
    },
    {
      id: 3,
      name: "GPU",
      description: "Nvidia RTX 3080",
      price: 700,
      details: "10GB GDDR6X, Ray Tracing, 3x DisplayPort, 1x HDMI",
      image: "/gpu.png",
    },
    {
      id: 4,
      name: "RAM",
      description: "Corsair Vengeance LPX 16GB",
      price: 80,
      details: "2 x 8GB, DDR4, 3200MHz, C16, Black",
      image: "/ram.png",
    },
    {
      id: 5,
      name: "Coolers",
      description: "Noctua NH-D15",
      price: 90,
      details: "Dual-Tower CPU Cooler, 6 Heatpipe, 2x NF-A15 PWM Fans",
      image: "/cooler.png",
    },
    {
      id: 6,
      name: "Motherboard",
      description: "ASUS ROG Strix B450-F",
      price: 130,
      details: "ATX, AM4 Socket, DDR4, USB 3.1, HDMI, SATA 6Gb/s",
      image: "/motherboard.png",
    },
    {
      id: 7,
      name: "PSU",
      description: "EVGA 600 W1, 80+ WHITE 600W",
      price: 50,
      details: "80 PLUS White certified, 3 Year Warranty, Power ON Self Tester",
      image: "/psu.png",
    },
    {
      id: 8,
      name: "Case",
      description: "NZXT H510",
      price: 70,
      details: "ATX Mid-Tower, Tempered Glass Panel, Front I/O USB Type-C Port",
      image: "/case.png",
    },
    {
      id: 9,
      name: "SSD",
      description: "Samsung SSD 860 EVO 1TB",
      price: 100,
      details: "1TB, SATA 6Gb/s, 2.5 Inch, Internal Solid State Drive",
      image: "/ssd.png",
    },
  ]);

  return (
    <dir>
      <h2>Products</h2>
      <div className="ProductList">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </dir>
  );
}

export default ProductList;
