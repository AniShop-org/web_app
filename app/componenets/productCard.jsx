"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
    const primaryImage = product.images?.[0];
    const rating = product.averageRating;
    const router = useRouter();
    const handleClick = () => {
        router.push(`/products/${product.id}`);
    }
    const [wishlist, setWishlist] = useState([]);

    const handleWishlistClick = (event) => {
        event.stopPropagation();
        try {
            let updatedWishlist;
            if (wishlist.some(item => item.id === product.id)) {
                // Remove item from wishlist
                updatedWishlist = wishlist.filter(item => item.id !== product.id);
            } else {
                // Add item to wishlist
                updatedWishlist = [...wishlist, product];
            }

            // Update localStorage
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    return (
        <div className="group relative cursor-pointer" onClick={handleClick} title='View product'>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-900">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                    className={`absolute left-2 top-2 rounded-full bg-black/50 p-1.5 backdrop-blur-sm transition-colors ${wishlist.some(item => item.id === product.id) ? 'text-red-500' : 'text-white'
                        }`}
                    onClick={handleWishlistClick}
                    title={wishlist.some(item => item.id === product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart
                        className="h-5 w-5"
                        fill={
                            wishlist.some(item => item.id === product.id) ? 'currentColor' : 'none'
                        }
                    />
                </button>
            </div>

            {/* Product Details */}
            <div className="mt-4 space-y-2">
                <h3 className="text-lg font-sans font-extrabold text-white">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-0.5">
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
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                        ₹{product.discountPrice}
                    </span>
                    {product.percentOff > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{product.basePrice}
                        </span>
                    )}
                    {product.percentOff > 0 && (
                        <div className="rounded-full bg-[#FF33331A] px-2 py-1 text-xs font-medium text-[#FF3333]">
                            -{product.percentOff}%
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;