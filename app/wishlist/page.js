"use client";

import React, { useState, useEffect } from 'react';
import WishListItem from '../componenets/wishlistItem';
import LoadingScreen from '../componenets/loading';
import { TopBar } from '../componenets/topbar';

export default function WishlistPage() {
  const [wishList, setWishList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      // Get the wishlist items from local storage
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
    <div className="bg-[#191919] text-white min-h-screen p-8">
      <div className='pb-28'>
        <TopBar />
      </div>
      <div className='container mx-auto'>
        <h1 className="text-4xl font-bold mb-8">Your Wishlist</h1>

        {wishList.length === 0 ? (
          <div>Your wishlist is empty.</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-2 ">
              {wishList.map((item) => (
                <WishListItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}