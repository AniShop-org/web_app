"use client";

import React, { useState, useEffect } from 'react';
import CartItem from '../componenets/cartItem';
import LoadingScreen from '../componenets/loading';
import { TopBar } from '../componenets/topbar';
import { ArrowRight } from 'lucide-react';
import Footer from '../componenets/footer';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const token = localStorage.getItem('authToken');
    if (!token) {
        router.push('/login');
    }
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState({
        deliveryCharge: 0,
        totalItems: 0,
        totalPrice: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // Add loading state for updates


    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                'https://anishop-backend-test.onrender.com/api/v1/products/cart/viewCart',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cartItems || []);
                setCartSummary({
                    deliveryCharge: data.deliveryCharge || 0,
                    totalItems: data.totalItems || 0,
                    totalPrice: data.totalPrice || 0,
                });
            } else {
                console.error('Failed to fetch cart items');
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (item, type) => {

        if (isUpdating) return;
        setIsUpdating(true);
        const token = localStorage.getItem('authToken');

        const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;

        if (newQuantity < 1) {
            setIsUpdating(false);
            return;
        }

        try {
            const response = await fetch(
                'https://anishop-backend-test.onrender.com/api/v1/products/cart/updateCart',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${token}`,
                    },
                    body: JSON.stringify({
                        cartItemId: item.id,
                        variantId: item.variantId,
                        quantity: newQuantity,
                    }),
                }
            );

            if (response.ok) {
                await fetchCart();
            } else {
                console.error('Failed to update cart item');
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async (item) => {
        if (isUpdating) return;
        setIsUpdating(true);

        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(
                'https://anishop-backend-test.onrender.com/api/v1/products/cart/updateCart',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${token}`,
                    },
                    body: JSON.stringify({
                        cartItemId: item.id,
                        variantId: item.variantId,
                        quantity: 0,
                    }),
                }
            );

            if (response.ok) {
                await fetchCart();
            } else {
                console.error('Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const { deliveryCharge, totalItems, totalPrice } = cartSummary;
    const totalBasePrice = cartItems.reduce(
        (sum, item) => sum + item.product.basePrice * item.quantity,
        0
    );

    const totalDiscount = totalBasePrice - totalPrice;

    return (
        <div className="bg-[#191919] text-white min-h-screen flex flex-col">
            <div className='pb-28'>
                <TopBar />
            </div>
            <div className='container mx-auto flex-grow'>
                <h1 className="text-4xl font-bold mb-8">Cart</h1>
                
                {isLoading ? <div>Loading Cart Items...</div> : (cartItems.length === 0 ? (
                    <div>Your cart is empty</div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-2 ">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>

                        <div className="w-full md:w-1/3 p-6 rounded-2xl border border-[#FFFFFF1A]">
                            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2 text-[#FFFFFF99]">
                                <div className="flex justify-between">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className='text-white'>₹{totalBasePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Discount</span>
                                    <span className="text-[#01AB31]">-₹{totalDiscount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charge</span>
                                    <span className='text-white'>₹{deliveryCharge.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="my-4 border-b border-gray-700"></div>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span className='text-xl'>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                className={`mt-6 w-full bg-[#FF3333] py-3 rounded-full text-white font-semibold ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isUpdating}
                            >
                                Proceed to Checkout <ArrowRight className="inline" size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                
            </div>
            <div className='mt-auto'>
                <Footer />
            </div>
        </div>
    );
}