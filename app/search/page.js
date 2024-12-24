"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductGrid } from "../componenets/ProductGrid";
import { Pagination } from "../componenets/Pagination";
import { TopBar } from "../componenets/topbar";
import { FilterSidebar } from "../componenets/FilterSidebar";
import Footer from "../componenets/footer";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  // Store filters in local state for the sidebar
  const [filters, setFilters] = useState({
    minRating: 0,
    minPrice: 0,
    maxPrice: 999999,
    size: ""
  });

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const fetchSearchResults = async (desiredPage) => {
    setLoading(true);
    try {
      const url = `https://anishop-backend-test.onrender.com/api/v1/products/search-filter?keyword=${encodeURIComponent(
        keyword
      )}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&minRating=${filters.minRating}&size=${encodeURIComponent(
        filters.size
      )}&page=${desiredPage || page}&limit=9`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const totalPages = Math.ceil(data.totalCount / 9);
        setProducts(data.products || []);
        setTotalPages(totalPages);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [keyword, page]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchSearchResults(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 py-40">
        <div className="flex gap-8">
          {/* Filter Sidebar: pass filters and callbacks */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : products.length === 0 ? (
              <div>
                <h1 className="text-2xl font-bold text-white">
                  No results found for "{keyword}"
                </h1>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold mb-4 text-white">
                    Search Results for "{keyword}"
                  </h1>
                </div>
                <ProductGrid products={products} />                
              </>
            )}
          </div>
        </div>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
                />
      <Footer />
    </div>
  );
};

export default SearchResults;