"use client"

import React, { useState } from 'react';
import { Heart, Minus, Plus } from 'lucide-react';

const ProductDetail = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const calculateRating = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return Array.from({ length: 5 }, (_, index) => {
            if (index < fullStars) return '★';
            if (index === fullStars && hasHalfStar) return '★';
            return '☆';
        }).join('');
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 bg-[#191919] text-white p-6">
            {/* Left side - Image gallery */}
            <div className="flex gap-4">
                {/* Thumbnail column */}
                <div className="flex flex-col gap-2">
                    {product.images?.map((img, index) => (
                        <div
                            key={index}
                            className={`w-32 h-36 cursor-pointer border-2 ${selectedImage === index ? 'border-red-500' : 'border-transparent'
                                }`}
                            onClick={() => setSelectedImage(index)}
                        >
                            <img
                                src={img}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                    ))}
                </div>

                {/* Main image */}
                <div className="flex-1">
                    <img
                        src={product.images[selectedImage]}
                        alt={product.name}
                        className="w-full max-w-md object-cover rounded-2xl"
                    />
                </div>
            </div>

            {/* Right side - Product details */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

                <div className="flex items-center gap-2 mb-4">
                    <div className="text-yellow-400">
                        {calculateRating(product.averageRating)}
                    </div>
                    <span className="text-gray-400">{product.averageRating}/5</span>
                </div>

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

                <p className="text-gray-400 mb-6">{product.description}</p>

                <div className="mb-6">
                    <h3 className="text-sm mb-2">Choose Size</h3>
                    <div className="flex gap-2">
                        {product.variants.map((variant) => (
                            <button
                                key={variant.id}
                                className={`px-4 py-2 rounded-full ${selectedSize === variant.size
                                    ? 'bg-[#FF3333] text-white'
                                    : 'bg-[#F0F0F0] text-black'
                                    }`}
                                onClick={() => setSelectedSize(variant.size)}
                            >
                                {variant.size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white rounded-full p-2">
                        <button
                            onClick={() => handleQuantityChange('decrease')}
                            className="p-1 text-black hover:bg-gray-100 rounded"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-black">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('increase')}
                            className="p-1 text-black hover:bg-gray-100 rounded"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <button className="flex-1 bg-[#FF3333] text-white py-3 rounded-full hover:bg-red-600">
                        Add to Cart
                    </button>

                    <button className="p-3 bg-gray-800 rounded hover:bg-gray-700">
                        <Heart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;