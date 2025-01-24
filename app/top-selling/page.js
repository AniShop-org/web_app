"use client";

import React, { useState, useEffect } from "react";
import { FilterSidebar } from "../componenets/FilterSidebar";
import { ProductGrid } from "../componenets/ProductGrid";
import { Pagination } from "../componenets/Pagination";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";

export default function TopSellingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);


  const [filters, setFilters] = useState({
    minRating: 0,
    minPrice: 0,
    maxPrice: 999999,
    size: ""
  });

  const fetchProducts = async (desiredPage = currentPage) => {
    setLoading(true);
    try {
      const url = `https://anishop-backend-test.onrender.com/api/v1/products/topSelling?limit=9&page=${desiredPage}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&minRating=${filters.minRating}&size=${encodeURIComponent(filters.size)}`;

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();

      setProducts(data.products || []);
      const totalPages = Math.ceil(data.totalCount / 9);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchProducts(1);
  };
  const handleClearFilters = () => {
    setFilters({
      minRating: 0,
      minPrice: 0,
      maxPrice: 10000,
      size: ""
    });
    setCurrentPage(1);
    fetchProducts(1);
  }


  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-40">
        <div className="flex gap-8">
          <div>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-white">Top Selling</h1>
            </div>

            {loading ? (
              <div className="flex justify-center content-center pt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
              </div>
            ) : (
              <>
                <ProductGrid products={products} />
              </>
            )}
            
            <hr className="my-6 border-[#FFFFFF1A] sm:mx-auto mt-10" />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}