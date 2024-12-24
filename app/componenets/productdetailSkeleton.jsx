import React from 'react';

const ProductDetailSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8 bg-[#191919] text-white p-6 container mx-auto">
            {/* Left side - Image gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnail column - Now first in md+ view, showing on mobile */}
                <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="lg:w-32 lg:h-36 w-28 h-32 bg-gray-700 rounded-2xl"
                        />
                    ))}
                </div>

                {/* Main image - Hidden on mobile, shown on md+ screens */}
                <div className="hidden md:block flex-1">
                    <div className="lg:w-80 lg:h-96 w-full h-2/4 max-w-md bg-gray-700 rounded-2xl" />
                </div>
            </div>

            {/* Right side - Product details */}
            <div className="flex-1">
                {/* Product title */}
                <div className="h-10 bg-gray-700 rounded mb-2 w-3/4" />

                {/* Rating section */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 bg-gray-700 rounded w-32" /> {/* Stars */}
                    <div className="h-6 bg-gray-700 rounded w-16" /> {/* Rating number */}
                </div>

                {/* Price section */}
                <div className="flex items-center gap-2">
                    <div className="h-8 bg-gray-700 rounded w-24" /> {/* Discount price */}
                    <div className="h-6 bg-gray-700 rounded w-20" /> {/* Original price */}
                    <div className="h-6 bg-gray-700 rounded-full w-16" /> {/* Discount percentage */}
                </div>

                {/* Description */}
                <div className="h-24 bg-gray-700 rounded my-6" />

                {/* Divider */}
                <div className="h-0.5 w-full bg-[#FFFFFF1A]" />

                {/* Size selector section */}
                <div className="mb-6 pt-6">
                    <div className="h-6 bg-gray-700 rounded mb-2 w-24" /> {/* "Choose Size" text */}
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="h-10 w-16 bg-gray-700 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom actions section */}
                <div className="flex items-center gap-4 mb-6">
                    {/* Quantity selector */}
                    <div className="flex items-center lg:gap-4 gap-2 bg-gray-700 rounded-full p-2 lg:px-8 px-1">
                        <div className="h-8 w-8 bg-gray-600 rounded-full" /> {/* Minus button */}
                        <div className="h-8 w-8 bg-gray-600 rounded" /> {/* Quantity */}
                        <div className="h-8 w-8 bg-gray-600 rounded-full" /> {/* Plus button */}
                    </div>
                    {/* Add to cart button */}
                    <div className="flex-1 h-12 bg-gray-700 rounded-full" />
                    {/* Wishlist button */}
                    <div className="h-12 w-12 bg-gray-700 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;