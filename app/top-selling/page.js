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

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // or 1, updated dynamically if your API returns a page count

  // For filters
  const [filters, setFilters] = useState({
    minRating: 0,
    minPrice: 0,
    maxPrice: 999999,
    size: ""
  });

  // Fetch “topSelling” products with filters
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

  // Initial fetch and refetch on page change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Called when user changes pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Called by FilterSidebar on slider/button changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Called by the “Apply Filter” button in FilterSidebar
  const handleApplyFilters = () => {
    // Reset to page 1 to display all matching results from the start
    setCurrentPage(1);
    fetchProducts(1);
  };

  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-40">
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
          />

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Top Selling</h1>
            </div>

            {loading ? (
              <div className="text-white">Loading...</div>
            ) : (
              <>
                <ProductGrid products={products} />
              </>
            )}
          </div>
        </div>
      </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          />
      <Footer />
    </div>
  );
}