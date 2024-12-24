"use client";

import RatingSlider from "./ratingSlider";
import Slider from "./Slider";

export const FilterSidebar = ({
    filters,
    onFilterChange,
    onApplyFilters
}) => {
    const sizes = [
        "XS", "S", "M", "L",
        "XL", "XXL", "3XL"
    ];

    return (
        <div className="w-64 bg-[#191919] p-6 space-y-6">
            {/* Price Range */}
            <div>
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

            {/* Size */}
            <div>
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

            {/* Rating */}
            <div>
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
                onClick={onApplyFilters}
            >
                Apply Filter
            </button>
        </div>
    );
};