"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export const Searchbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const [showRecent, setShowRecent] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(storedSearches);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        // Update recent searches
        let updatedSearches = [searchTerm, ...recentSearches.filter((term) => term !== searchTerm)];
        if (updatedSearches.length > 5) {
            updatedSearches = updatedSearches.slice(0, 5);
        }
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

        // Navigate to search results page
        router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
    };

    const handleRecentSearch = (term) => {
        setSearchTerm(term);
        router.push(`/search?keyword=${encodeURIComponent(term)}`);
    };

    return (
        <div className="hidden lg:block flex-1 max-w-3xl mx-6">
            <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowRecent(true)}
                        onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                        className="w-full py-3 pl-4 pr-10 bg-[#2A2A2A] bg-opacity-90 text-gray-200 rounded-full placeholder-[#FFFFFF66] focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button type="submit" className="absolute right-3 top-3 text-gray-500 hover:text-white">
                        <Search size={20} />
                    </button>
                </form>
                {showRecent && recentSearches.length > 0 && (
                    <div className="absolute mt-2 w-full bg-[#2A2A2A] bg-opacity-90 text-gray-200 rounded-lg shadow-lg">
                        <ul>
                            {recentSearches.map((term, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                                    onClick={() => handleRecentSearch(term)}
                                >
                                    {term}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};