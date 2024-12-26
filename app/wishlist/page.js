"use client"

import React, { useState, useEffect } from 'react';
import WishListItem from '../componenets/wishlistItem';
import { TopBar } from '../componenets/topbar';
import Footer from '../componenets/footer';
import { SideNav } from '../componenets/sideNav';

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
        <div className="min-h-screen flex flex-col bg-[#191919] pt-36">
            <TopBar />
            
            <div className="flex-grow mx-auto px-6 pt-8 container">
                <div className="flex gap-8">
                    <SideNav />
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white">My Wishlist</h1>
                        </div>
                        {isLoading ? (
                            <div className='text-lg font-bold'>Loading wishlist...</div>
                            ) : wishList.length === 0 ? (
                                <div className="rounded-2xl bg-[#1A1A1A] p-8 text-center text-gray-400">
                                    Your wishlist is empty.
                                </div>
                            ) : (
                            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 gap-6">
                                {wishList.map((item) => (
                                    <WishListItem 
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