"use client";

import React, { useState, useEffect, useRef } from "react";
import { FilterSidebar } from "../componenets/FilterSidebar";
import { ProductGrid } from "../componenets/ProductGrid";
import { Pagination } from "../componenets/Pagination";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    minRating: 0,
    minPrice: 0,
    maxPrice: 10000,
    size: ""
  });

  const filtersRef = useRef(filters);

  const fetchProducts = async (desiredPage = currentPage) => {
    setLoading(true);
    try {
      const url = `https://anishop-backend-test.onrender.com/api/v1/products/newProducts?&minPrice=${filtersRef.current.minPrice}&maxPrice=${
        filtersRef.current.maxPrice
      }&minRating=${filtersRef.current.minRating}&size=${encodeURIComponent(
        filtersRef.current.size
      )}&page=${desiredPage}&limit=9`;

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      const totalPages = Math.ceil(data.totalCount / 9);

      setProducts(data.products || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

    // Keep ref in sync
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Fetch on filter changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {

    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      const unchanged =
        updated.minRating === prev.minRating &&
        updated.minPrice === prev.minPrice &&
        updated.maxPrice === prev.maxPrice &&
        updated.size === prev.size;
      return unchanged ? prev : updated;
    });
  };

  const handleApplyFilters = () => {
    setFilters(filtersRef.current);
    fetchProducts();
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

  if (products.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[#191919]">
        <div className="max-w-7xl mx-auto py-40">
          <div className="flex px-4">
            <div>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <svg
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h1 className="text-3xl font-bold mb-2 text-white">
                No products found
              </h1>
              <p className="text-gray-400">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#191919] overflow-x-hidden">
    <TopBar />
    <div className="container mx-auto px-4 py-40 overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:gap-7 max-w-7xl">
        {/* Sidebar - Hide on mobile, show as modal/drawer */}
        <div className="lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold text-white">New Arrivals</h1>
          </div>

          {loading ? (
            <div className="flex justify-center content-center pt-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200 container mx-auto" />
            </div>
          ) : (
            <ProductGrid products={products} />
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