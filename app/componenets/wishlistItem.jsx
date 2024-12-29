import React from 'react';
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const WishListItem = ({ product, onRemove }) => {
    const router = useRouter();
    const primaryImage = product.images?.[0];
    const rating = product.averageRating;

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove(product);
    };

    return (
        <div className="group relative w-full cursor-pointer bg-[#1D1D1D] p-3 rounded-xl"
            onClick={() => router.push(`/products/${product.id}`)}
            title="View product">
            <div className="relative h-72 overflow-hidden rounded-xl bg-[#1D1D1D]">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Product Details */}
            <div className="mt-4 space-y-3">
                <h3 className="text-lg font-medium text-white line-clamp-1">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                        >
                            ★
                        </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-400">
                        {rating}/5
                    </span>
                </div>

                {/* Price and Remove Button */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
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
                        {product.percentOff > 0 && (
                            <div className="rounded-full bg-[#FF33331A] pl-7 py-1 text-xs font-medium text-[#FF3333]">
                                -{product.percentOff}%
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleRemove}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <Trash2Icon size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishListItem;