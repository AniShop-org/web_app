"use client";

import {
  Search,
  Menu,
  ShoppingCart,
  User,
  Bell,
  X,
  Image,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AccountDropdown from "./accountDropdown";

export const TopBar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev);
  };

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((term) => term !== searchTerm),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setShowRecent(false);
    router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
  };

  const handleRecentSearch = (term) => {
    setSearchTerm(term);
    setShowRecent(false);
    router.push(`/search?keyword=${encodeURIComponent(term)}`);
  };

  const navigateToCartOrLogin = () => {
    router.push("/cart");
  };

  const navigateToNotifications = () => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/notifications");
    }
  };

  const navigateToWishlist = () => {
    router.push("/wishlist");
  };

  return (
    <div>
      <div className="z-50 flex items-center justify-between py-4 lg:px-6 fixed top-0 left-0 right-0 container mx-auto sm:mt-4">
        <div className="flex items-center space-x-4 pl-3">
          <a
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src={"/logo.png"}
              alt="logo"
              className="h-8 w-8 lg:w-10 lg:h-10"
            />
            <div className="text-white lg:text-3xl text-2xl font-extrabold tracking-wider pl-1">
              AniShop
            </div>
          </a>
        </div>

        <nav className="hidden lg:flex space-x-8 lg:text-lg">
          <a
            href="#"
            className="text-white hover:text-red-500 transition-colors"
          >
            Download The App
          </a>
        </nav>

        <div className="relative hidden lg:block lg:w-5/12">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowRecent(true)}
              onBlur={() => setShowRecent(false)}
              className="w-full py-3 pl-12 pr-4 bg-[#2A2A2A] text-gray-200 rounded-full placeholder-gray-400
                                      focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            />
          </form>

          {showRecent && recentSearches.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-[#2A2A2A] rounded-lg shadow-lg mt-2 z-50">
              <h3 className="text-sm text-gray-400 px-4 py-2">
                Recent Searches
              </h3>
              <ul className="space-y-1">
                {recentSearches.map((term, index) => (
                  <li
                    key={index}
                    className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                    onMouseDown={() => handleRecentSearch(term)}
                  >
                    <Search size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-200">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4 px-2">
          <button
            onClick={toggleSearchBar}
            className="text-white lg:hidden hover:text-red-500 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            onClick={navigateToNotifications}
            className="text-white transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          <button
            onClick={navigateToWishlist}
            className="text-white transition-colors"
            title="Wishlist"
          >
            <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          <button
            className="text-white transition-colors"
            onClick={navigateToCartOrLogin}
            title="Cart"
          >
            <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          {token ? (
            <AccountDropdown />
          ) : (
            <div>
              <button
                className="p-1 rounded-lg text-white border border-white"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {showSearchBar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleSearchBar}
          />
          <div className="absolute top-0 left-0 right-0 bg-[#2A2A2A] animate-slide-down">
            <div className="p-4">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <Search className="absolute left-4 text-gray-400" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowRecent(true)}
                  onBlur={() => setShowRecent(false)}
                  className="w-full py-3 pl-12 pr-12 bg-[#2A2A2A] text-gray-200 rounded-full
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3333]
                                 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={toggleSearchBar}
                  className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </form>

              {/* Mobile Recent Searches */}
              {showRecent && recentSearches.length > 0 && (
                <div className=" bg-[#2A2A2A] rounded-2xl mt-4">
                  <h3 className="text-sm text-gray-400 px-4 py-2">
                    Recent Searches
                  </h3>
                  <ul className="space-y-1">
                    {recentSearches.map((term, index) => (
                      <li
                        key={index}
                        className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                        onMouseDown={() => {
                          handleRecentSearch(term);
                          toggleSearchBar();
                        }}
                      >
                        <Search size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-200">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
