"use client";

import { useState } from "react";
import RatingSlider from "./ratingSlider";
import Slider from "./Slider";
import { Filter, X } from "lucide-react";

export const FilterSidebar = ({
    filters,
    onFilterChange,
    onApplyFilters,
    onClearFilters
}) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

    const handleApplyAndClose = () => {
        onApplyFilters();
        setIsMobileOpen(false);
    };

    const handleClearAndClose = () => {
        onClearFilters();
        setIsMobileOpen(false);
    };

    const FilterContent = () => (
        <div className="mt-10 lg:mt-0">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-bold text-2xl">Filters</h1>
                <button
                    onClick={handleClearAndClose}
                    className="text-sm text-red-500 hover:text-red-400"
                >
                    Clear filters
                </button>
            </div>

            <hr className="border-[#FFFFFF1A] sm:mx-auto" />
            {/* Price Range */}
            <div className="my-6">
                <h3 className="text-lg font-semibold text-white">Price</h3>
                <div className="px-2">
                    <Slider
                        defaultValue={[filters.minPrice, filters.maxPrice]}
                        max={10000}
                        min={0}
                        step={50}
                        className="w-full"
                        onChange={(value) =>
                            onFilterChange({ minPrice: value[0], maxPrice: value[1] })
                        }
                    />
                </div>
            </div>

            <hr className="border-[#FFFFFF1A] sm:mx-auto" />
            {/* Size */}
            <div className="my-6">
                <h3 className="text-lg font-semibold text-white mb-4">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            className={`px-3 py-1 rounded-full border ${filters.size === size
                                ? "border-white text-white"
                                : "border-gray-600 text-gray-300"
                                } hover:border-white hover:text-white text-sm`}
                            onClick={() => onFilterChange({ size })}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-[#FFFFFF1A] sm:mx-auto" />
            {/* Rating */}
            <div className="my-6">
                <h3 className="text-lg font-semibold text-white">Rating</h3>
                <div className="px-2">
                    <RatingSlider
                        defaultValue={[filters.minRating, 5]}
                        min={0}
                        max={5}
                        step={0.5}
                        className="w-full"
                        onChange={(value) =>
                            onFilterChange({ minRating: value[0] })
                        }
                    />
                </div>
            </div>

            <button
                className="w-full bg-red-500 hover:bg-red-600 text-white mt-4 p-2 rounded-full"
                onClick={handleApplyAndClose}
            >
                Apply Filter
            </button>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                className="md:hidden fixed bottom-4 right-4 z-40 bg-red-500 p-3 rounded-full shadow-lg"
                onClick={() => setIsMobileOpen(true)}
            >
                <Filter className="w-6 h-6 text-white" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 bg-[#191919] p-6 space-y-6 border border-[#FFFFFF1A] rounded-2xl h-auto">
                <FilterContent />
            </div>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed left-0 top-0 h-full w-80 bg-[#191919] p-6 z-50 overflow-y-auto">
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                        <FilterContent />
                    </div>
                </>
            )}
        </>
    );
};