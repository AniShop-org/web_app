"use client"

import React, { useState, useEffect } from 'react';
import ProductCard from './productCard';
import { useRouter } from 'next/navigation';

const TopSelling = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/products/topSelling?limit=4');
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
        <section className="px-4 py-16 sm:mt-32">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <h1 className="mb-12 text-center lg:text-3xl text-xl font-bold text-white">
                    Top Selling
                </h1>

                {/* Product Grid */}
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
                    <div className="grid grid-cols-2 gap-2 lg:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-12 text-center">
                    <button className="rounded-full border border-white bg-transparent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black" onClick={() => 
                        router.push('/top-selling')
                        }>
                        View All
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TopSelling;