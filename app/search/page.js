"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductGrid } from "../componenets/ProductGrid";
import { Pagination } from "../componenets/Pagination";
import { TopBar } from "../componenets/topbar";
import { FilterSidebar } from "../componenets/FilterSidebar";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);


  const fetchSearchResults = async () => {
    try {
      const response = await fetch(
        `https://anishop-backend-test.onrender.com/api/v1/products/search-filter?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&limit=9`
      ,
      { method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
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
  
  return (
    <div className="min-h-screen bg-[#191919]">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-40">
        <div className="flex gap-8">
          <FilterSidebar />
          <div className="flex-1">
            {products.length === 0 ? (<div>
            <h1 className="text-2xl font-bold text-white">No results found for "{keyword}"</h1>
        </div>) : (<div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-4">Search Results for "{keyword}"</h1>
            </div>)}

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
    </div>
  );
};

export default SearchResults;