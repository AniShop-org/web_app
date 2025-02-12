"use client"

import React, { useState, useEffect } from 'react';
import ProductCard from './productCard';
import { useRouter } from 'next/navigation';

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/products/newProducts?limit=4');
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="px-4 sm:py-16 py-4 ">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <h1 className="sm:mb-12 mb-4 text-center text-xl lg:text-2xl font-bold text-white">
                    New Arrivals
                </h1>

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square rounded-lg bg-[#32323280]" />
                                <div className="mt-4 h-4 w-3/4 rounded bg-[#32323280]" />
                                <div className="mt-2 h-4 w-1/4 rounded bg-[#32323280]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="sm:mt-12 mt-4 text-center">
                    <button className="rounded-full border border-white bg-transparent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black" onClick={() => {
                        router.push('/new-arrivals');
                    }}>
                        View All
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;