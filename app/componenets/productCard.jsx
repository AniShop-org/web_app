import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
    const primaryImage = product.images?.[0];
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(storedWishlist);
    }, []);

    const handleClick = () => {
        router.push(`/products/${product.id}`);
    };

    const handleWishlistClick = (event) => {
        event.stopPropagation();
        try {
            let updatedWishlist;
            if (wishlist.some(item => item.id === product.id)) {
                updatedWishlist = wishlist.filter(item => item.id !== product.id);
            } else {
                updatedWishlist = [...wishlist, product];
            }

            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    return (
        <div className="group relative cursor-pointer" onClick={handleClick} title='View product'>
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
                >
                    <Heart
                        className="h-5 w-5"
                        fill={wishlist.some(item => item.id === product.id) ? 'currentColor' : 'none'}
                    />
                </button>
            </div>

            <div className="mt-4 space-y-2">
                <h3 className="text-lg font-sans font-extrabold text-white">
                    {product.name}
                </h3>
                <p className="text-gray-400">₹{product.discountPrice}</p>
            </div>
        </div>
    );
};

export default ProductCard;