"use client";

import { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";
import { productApi } from "@/api/product";

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await productApi.getProducts();
      setProducts(res.products);
    };
    fetch();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
