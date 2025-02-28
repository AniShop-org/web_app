"use client";

import { useEffect, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Reviews from "./reviews";
import Alert from "./alert";

const ProductDetail = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const router = useRouter();

  // Check if product is already in cart when component loads
  useEffect(() => {
    const checkCartStatus = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const isProductInCart = storedCart.some((item) => item.id === product.id);
      setIsInCart(isProductInCart);
      setCartItems(storedCart);
    };

    checkCartStatus();
  }, [product.id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const variant = product.variants.find((v) => v.size === selectedSize);
    if (!variant) {
      setAlertMessage("Please select a size");
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            variantId: variant.id,
            quantity,
          }),
        },
      );

      if (response.ok) {
        setIsInCart(true);
        // Don't need to update localStorage for logged-in users
        // as the server handles the cart
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCart = () => {
    router.push("/cart");
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const calculateRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) return "★";
      if (index === fullStars && hasHalfStar) return "★";
      return "☆";
    }).join("");
  };

  const handleCart = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const token = localStorage.getItem("authToken");

    // If the product is already in the cart, navigate to the cart page
    if (isInCart) {
      handleViewCart();
      return;
    }

    // For logged-in users, add to server-side cart
    if (token) {
      await handleAddToCart();
      return;
    }

    // For guest users, add to localStorage cart
    const variant = product.variants.find((v) => v.size === selectedSize);
    if (!variant) {
      setAlertMessage("Please select a size");
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if product is already in cart (should be redundant with isInCart check)
      const existingItemIndex = storedCart.findIndex(
        (item) =>
          item.id === product.id && item.selectedVariantId === variant.id,
      );

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        storedCart[existingItemIndex].quantity = quantity;
      } else {
        // Add new item with selected options
        const cartItem = {
          ...product,
          quantity: quantity,
          selectedSize: selectedSize,
          selectedVariantId: variant.id,
          size: selectedSize, // Adding this for compatibility with cart display
        };
        storedCart.push(cartItem);
      }

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(storedCart));

      // Update state
      setIsInCart(true);
      setCartItems(storedCart);

      // Show success message (optional)
      setAlertMessage("Added to cart successfully!");
      setShowAlert(true);
    } catch (error) {
      console.error("Error adding to local cart:", error);
      setAlertMessage("Failed to add to cart. Please try again.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleWishlistClick = (event) => {
    event.stopPropagation();
    try {
      let updatedWishlist;
      if (wishlist.some((item) => item.id === product.id)) {
        // Remove item from wishlist
        updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      } else {
        // Add item to wishlist
        updatedWishlist = [...wishlist, product];
      }

      // Update localStorage
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div>
      {showAlert && (
        <Alert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
      <button
        onClick={() => router.back()}
        className="pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-4 sm:h-6 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <div className="flex flex-col md:flex-row gap-8 bg-[#191919] text-white p-6 px-4">
        {/* Left side - Image gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnail column */}
          <div className="flex md:flex-col gap-2 md:mt-0 pl-4 sm:pl-0">
            {product.images?.map((img, index) => (
              <div
                key={index}
                className={`w-16 h-16 md:w-18 md:h-18 lg:w-24 lg:h-24 cursor-pointer border-2 ${
                  selectedImage === index
                    ? "border-[#FF3333] rounded-2xl"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-hidden p-5 sm:p-0 pb-0">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="
                                w-full
                                max-w-[365px]
                                object-cover
                                rounded-xl
                                h-[320px]
                                md:h-[500px]
                                lg:h-[400px]
                            "
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="lg:text-3xl text-xl font-bold sm:mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 sm:mb-4 text-xl">
            <div className="text-yellow-400">
              {calculateRating(product.averageRating)}
            </div>
            <span className="text-gray-400 text-sm sm:text-lg">
              {product.averageRating}/5
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl lg:font-bold font-semibold text-white">
              ₹{product.discountPrice}
            </span>
            {product.percentOff > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.basePrice}
              </span>
            )}
            {product.percentOff > 0 && (
              <div className="rounded-full bg-[#FF33331A] px-2 py-1 text-xs font-medium text-[#FF3333]">
                -{product.percentOff}%
              </div>
            )}
          </div>

          <p className="text-[#E7E7E799] mb-6 sm:pt-6 pt-2 text-sm lg:text-lg">
            {product.description}
          </p>
          <div className="h-0.5 w-full bg-[#FFFFFF1A]"></div>
          <div className="lg:mb-6 pt-6 mb-3">
            <h3 className="text-md mb-2 text-[#E7E7E799]">Choose Size</h3>
            <div className="flex gap-2 text-sm lg:text-lg">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  disabled={loading}
                  className={`px-3 py-2 lg:px-4 rounded-full ${
                    selectedSize === variant.size
                      ? "bg-[#FF3333] text-white"
                      : "bg-[#F0F0F0] text-black"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setSelectedSize(variant.size)}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center lg:gap-4 gap-6 mb-6">
            <div className="flex items-center lg:gap-2 gap-2 bg-white rounded-full p-2 lg:px-2 px-1">
              <button
                disabled={loading}
                onClick={() => handleQuantityChange("decrease")}
                className={`p-1 text-black hover:bg-gray-100 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
              <span className="lg:w-8 w-4 text-center text-sm lg:text-base text-black">
                {quantity}
              </span>
              <button
                disabled={loading}
                onClick={() => handleQuantityChange("increase")}
                className={`p-1 text-black hover:bg-gray-100 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
            <button
              disabled={loading}
              className={`flex-1 bg-[#FF3333] text-white lg:py-3 py-2 rounded-full hover:bg-red-600 md:mx-12
                            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleCart}
            >
              {loading
                ? "Adding to Cart..."
                : isInCart
                  ? "View Cart"
                  : "Add to Cart"}
            </button>

            <button
              disabled={loading}
              className={`rounded hover:bg-gray-700 ${
                wishlist.some((item) => item.id === product.id)
                  ? "text-red-500"
                  : "text-white"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleWishlistClick}
              title={
                wishlist.some((item) => item.id === product.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                className="h-5 w-5 lg:w-7 lg:h-7"
                fill={
                  wishlist.some((item) => item.id === product.id)
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Reviews reviews={product.reviews} />
      </div>
    </div>
  );
};

export default ProductDetail;
