"use client"

import { useEffect } from 'react';
import { FilterSidebar } from '../componenets/FilterSidebar';
import { ProductGrid } from '../componenets/ProductGrid';
import { Pagination } from '../componenets/Pagination';
import useProductStore from '../store/productstore';

export default function NewArrivals() {
  const { 
    filteredProducts, 
    loading, 
    currentPage, 
    fetchProducts, 
    setCurrentPage 
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                <ProductGrid products={filteredProducts} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={5}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}