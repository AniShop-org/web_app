import Slider from './Slider';
import useProductStore from '../store/productstore';

export const FilterSidebar = () => {
    const { filters, setFilters, setCurrentPage, applyFilters } = useProductStore();

    const categories = [
        { id: 'tshirts', label: 'T-shirts' },
        { id: 'shorts', label: 'Shorts' },
        { id: 'shirts', label: 'Shirts' },
        { id: 'hoodie', label: 'Hoodie' },
        { id: 'jeans', label: 'Jeans' }
    ];

    const sizes = [
        'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large'
    ];


    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleCategoryClick = (categoryId) => {
        handleFilterChange({ categoryId });
    };

    const handleSizeClick = (size) => {
        handleFilterChange({ size });
    };

    const handleApplyFilters = () => {
        applyFilters();
    };

    return (
        <div className="w-64 bg-[#191919] p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>

                {/* Categories */}
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="flex items-center py-2"
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <span className={`text-gray-300 hover:text-white cursor-pointer ${filters.categoryId === category.id ? 'text-white' : ''
                            }`}>
                            {category.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Price</h3>
                <div className="px-2">
                    <Slider
                        defaultValue={[filters.minPrice, filters.maxPrice]}
                        max={2000}
                        min={200}
                        step={50}
                        className="w-full"
                        onValueChange={(value) => handleFilterChange({
                            minPrice: value[0],
                            maxPrice: value[1]
                        })}
                    />
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            className={`px-3 py-1 rounded-full border ${filters.size === size
                                    ? 'border-white text-white'
                                    : 'border-gray-600 text-gray-300'
                                } hover:border-white hover:text-white text-sm`}
                            onClick={() => handleSizeClick(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Rating</h3>
                <div className="px-2">
                    <Slider
                        defaultValue={[filters.minRating, 5]}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                        onValueChange={(value) => handleFilterChange({
                            minRating: value[0]
                        })}
                    />
                </div>
            </div>

            <button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleApplyFilters}
            >
                Apply Filter
            </button>
        </div>
    );
};