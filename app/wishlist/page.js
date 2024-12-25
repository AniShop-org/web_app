"use client";

import React, { useState, useEffect } from 'react';
import WishListItem from '../componenets/wishlistItem';
import LoadingScreen from '../componenets/loading';
import { TopBar } from '../componenets/topbar';
import Footer from '../componenets/footer';

export default function WishlistPage() {
    const [wishList, setWishList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            // Load wishlist from localStorage
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

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="bg-[#191919] text-white min-h-screen flex flex-col">
            <div className="pb-28">
                <TopBar />
            </div>
            <div className="container mx-auto flex-grow pt-20">
                <h1 className="text-4xl font-bold mb-8">Your Wishlist</h1>

                {wishList.length === 0 ? (
                    <div>Your wishlist is empty.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishList.map((item) => (
                            <WishListItem key={item.id} item={item} onRemove={handleRemove} />
                        ))}
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
}
