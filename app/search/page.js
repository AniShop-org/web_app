"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ProductGrid } from "../componenets/ProductGrid";
import { Pagination } from "../componenets/Pagination";
import { TopBar } from "../componenets/topbar";
import { FilterSidebar } from "../componenets/FilterSidebar";
import Footer from "../componenets/footer";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [filters, setFilters] = useState({
    minRating: 0,
    minPrice: 0,
    maxPrice: 10000,
    size: ""
  });
  const filtersRef = useRef(filters);

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSearchResults = async (desiredPage = page) => {
    setLoading(true);
    try {
      const url = `https://anishop-backend-test.onrender.com/api/v1/products/search-filter?keyword=${encodeURIComponent(
        keyword
      )}&minPrice=${filtersRef.current.minPrice}&maxPrice=${
        filtersRef.current.maxPrice
      }&minRating=${filtersRef.current.minRating}&size=${encodeURIComponent(
        filtersRef.current.size
      )}&page=${desiredPage}&limit=9`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(Math.ceil(data.totalCount / 9));
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Keep ref in sync
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Fetch on keyword/page changes
  useEffect(() => {
    fetchSearchResults();
  }, [keyword, page]);

  // Fetch on filter changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {

    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  // Only update if any filter value changed
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
    fetchSearchResults();
  };

  const handleClearFilters = () => {
    setFilters({ minRating: 0, minPrice: 0, maxPrice: 10000, size: "" });
    fetchSearchResults();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-3 py-40">
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
            {loading ? (
              <div className="flex justify-center content-center pt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
              </div>
            ) : products.length === 0 ? (
              <h1 className="text-2xl font-bold text-white">
                No results found for "{keyword}"
              </h1>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-4 text-white">
                  Search Results for "{keyword}"
                </h1>
                <ProductGrid products={products} />
              </>
            )}
            <hr className="my-6 border-[#FFFFFF1A] sm:mx-auto mt-10" />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}