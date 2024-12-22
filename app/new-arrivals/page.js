"use client";

import React, { useState, useEffect } from "react";
import { FilterSidebar } from "../componenets/FilterSidebar";
import { ProductGrid } from "../componenets/ProductGrid";
import { Pagination } from "../componenets/Pagination";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://anishop-backend-test.onrender.com/api/v1/products/newProducts?limit=9&page=${currentPage}`
        );
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-40">
        <div className="flex gap-8">
          <FilterSidebar />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">New Arrivals</h1>
            </div>

            {loading ? (
              <div className="text-white">Loading...</div>
            ) : (
              <>
                <ProductGrid products={products} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}