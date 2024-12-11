"use client"

import React, { useOptimistic, useState } from 'react';
import { Heart, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductDetail = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();

    const handleAddToCart = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const variant = product.variants.find(v => v.size === selectedSize);
        if (!variant) {
            alert('Please select a size');
            return;
        }

        try {
            let updatedCart;
            if (cartItems.some(item => item.productId === product.id && item.variantId === variant.id)) {
                setIsInCart(true);
            }
            const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/products/cart/addToCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    variantId: variant.id,
                    quantity
                })
            });

            if (response.ok) {
                setIsInCart(true);
                updatedCart = [...cartItems, product];
                setCartItems(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleViewCart = () => {
        router.push('/cart');
    };

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
            <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnail column */}
                <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                    {product.images?.map((img, index) => (
                        <div
                            key={index}
                            className={`lg:w-32 lg:h-36 w-28 h-32 cursor-pointer border-2 ${selectedImage === index ? 'border-[#FF3333] rounded-2xl' : 'border-transparent'
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
                        className="lg:w-60 lg:h-80 w-full h-2/4 max-w-md object-cover rounded-2xl"
                    />
                </div>
            </div>

            {/* Right side - Product details */}
            <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

                <div className="flex items-center gap-2 mb-4 text-2xl">
                    <div className="text-yellow-400">
                        {calculateRating(product.averageRating)}
                    </div>
                    <span className="text-gray-400">{product.averageRating}/5</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">
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

                <p className="text-[#E7E7E799] mb-6 pt-6">{product.description}</p>
                <div className="h-0.5 w-full bg-[#FFFFFF1A]"></div>
                <div className="mb-6 pt-6">
                    <h3 className="text-md mb-2 text-[#E7E7E799]">Choose Size</h3>
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
                    <div className="flex items-center lg:gap-4 gap-2 bg-white rounded-full p-2 lg:px-8 px-1">
                        <button
                            onClick={() => handleQuantityChange('decrease')}
                            className="p-1 text-black hover:bg-gray-100 rounded"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="w-8 text-center text-black">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('increase')}
                            className="p-1 text-black hover:bg-gray-100 rounded"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <button className="flex-1 bg-[#FF3333] text-white py-3 rounded-full hover:bg-red-600"
                        onClick={isInCart ? handleViewCart : handleAddToCart}
                    >
                        {isInCart ? 'View Cart' : 'Add to Cart'}
                    </button>

                    <button className="lg:p-4 rounded hover:bg-gray-700">
                        <Heart size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;