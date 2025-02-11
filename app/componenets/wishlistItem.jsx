"use client";

import React, { useEffect, useState } from 'react';
import { Heart, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProductCard = ({ product, onRemove }) => {
    const primaryImage = product.images?.[0];
    const rating = product.averageRating;
    const router = useRouter();
    const handleClick = () => {
        router.push(`/products/${product.id}?category=${product.categoryId}`);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove(product);
    };

    return (
        <div className="group relative cursor-pointer" onClick={handleClick} title='View product'>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-900">
                <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Product Details */}
            <div className="sm:mt-4 mt-2 sm:space-y-2">
                <h3 className="text-sm sm:text-lg font-sans font-extrabold text-white">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center sm:gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={`lg:text-xl text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="ml-1 text-sm text-gray-400">
                        {rating}/5
                    </span>
                </div>

                {/* Price */}
                <div className='flex justify-between'>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                            ₹{product.discountPrice}
                        </span>
                        {product.percentOff > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{product.basePrice}
                            </span>
                        )}
                    </div>
                    <div >
                        <button
                            onClick={handleRemove}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Trash2Icon size={16} color='red'/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;