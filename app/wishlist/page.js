"use client"

import React, { useState, useEffect } from 'react';
import ProductCard from '../componenets/wishlistItem';
import { TopBar } from '../componenets/topbar';
import Footer from '../componenets/footer';
import { SideNav } from '../componenets/sideNav';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const [wishList, setWishList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const items = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishList(items);
        } catch (error) {
            setWishList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (item) => {
        try {
            const items = wishList.filter((i) => i.id !== item.id);
            localStorage.setItem('wishlist', JSON.stringify(items));
            setWishList(items);
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] sm:pt-36 pt-16">
            <TopBar />
            
            <div className="flex-grow mx-auto px-6 pt-8 container">
                <div className="flex gap-8">
                    <SideNav />
                    <div className="flex-1">
                        <div className="sm:mb-8 mb-4">
                            <h1 className="sm:text-3xl text-2xl font-bold text-white">My Wishlist</h1>
                        </div>
                        {isLoading ? (
                            <div className="flex justify-center content-center pt-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
                            </div>
                        ) : wishList.length === 0 ? (
                            <div className="text-center py-12">
                                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                                <p className="text-gray-400">
                                    Add items to your wishlist to see them here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-4 grid-cols-2 md:grid-cols-3 sm:gap-5 gap-3">
                                {wishList.map((item) => (
                                    <ProductCard 
                                        key={item.id} 
                                        product={item} 
                                        onRemove={handleRemove} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='pt-36'>
                <Footer />
            </div>
        </div>
    );
}