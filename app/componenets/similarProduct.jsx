"use client"

import React, { useState, useEffect } from 'react';
import ProductCard from './productCard';
import { useRouter } from 'next/navigation';

const SimilarProducts = ({ categoriId }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/category/${categoriId}?page=1&limit=4`);
                const data = await response.json();
                setProducts(data.products)
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="px-4 py-16 mt-32">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <h1 className="sm:mb-12 mb-6 text-center lg:text-4xl text-2xl font-bold text-white">
                    You might also like
                </h1>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:gap-8 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square rounded-lg bg-[#32323280]" />
                                <div className="mt-4 h-4 w-3/4 rounded bg-[#32323280]" />
                                <div className="mt-2 h-4 w-1/4 rounded bg-[#32323280]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:gap-8 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SimilarProducts;