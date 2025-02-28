"use client";

import React, { useState, useEffect } from "react";
import CartItem from "../componenets/cartItem";
import { TopBar } from "../componenets/topbar";
import Footer from "../componenets/footer";
import { useRouter } from "next/navigation";
import Checkout from "../componenets/checkout";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    deliveryCharge: 0,
    totalItems: 0,
    totalPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeAddress, setActiveAddress] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchActiveAddress = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/account/active-address`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setActiveAddress(data.address);
      }
    } catch (error) {
      console.error("Error fetching active address:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/viewCart`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems || []);
        setCartSummary({
          deliveryCharge: data.deliveryCharge || 0,
          totalItems: data.totalItems || 0,
          totalPrice: data.totalPrice || 0,
        });
      } else {
        console.error("Failed to fetch cart items");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };
  const calculateLocalCartSummary = (items) => {
    const totalItems = items.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    const totalPrice = items.reduce(
      (sum, item) => sum + item.discountPrice * (item.quantity || 1),
      0,
    );

    // You can adjust your delivery charge logic as needed
    const deliveryCharge = totalPrice > 500 ? 0 : 50;

    return {
      deliveryCharge,
      totalItems,
      totalPrice: totalPrice + deliveryCharge,
    };
  };

  const fetchCartFromLocalStorage = () => {
    try {
      const items = JSON.parse(localStorage.getItem("cart")) || [];

      // Add quantity property if not present
      const processedItems = items.map((item) => {
        if (!item.quantity) {
          return { ...item, quantity: 1 };
        }
        return item;
      });

      setCartItems(processedItems);

      const summary = calculateLocalCartSummary(processedItems);
      setCartSummary(summary);
    } catch (error) {
      console.error("Error fetching cart from localStorage:", error);
      setCartItems([]);
      setCartSummary({
        deliveryCharge: 0,
        totalItems: 0,
        totalPrice: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    setIsLoggedIn(!!token);

    if (token) {
      fetchCart();
      fetchActiveAddress();
    } else {
      fetchCartFromLocalStorage();
    }
  }, []);

  const handleQuantityChange = async (item, type) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const token = localStorage.getItem("authToken");
    const newQuantity =
      type === "increase" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity < 1) {
      setIsUpdating(false);
      return;
    }

    if (token) {
      // User is logged in, update server cart
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/updateCart`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `${token}`,
            },
            body: JSON.stringify({
              cartItemId: item.id,
              variantId: item.variantId,
              quantity: newQuantity,
            }),
          },
        );

        if (response.ok) {
          await fetchCart();
        } else {
          console.error("Failed to update cart item");
        }
      } catch (error) {
        console.error("Error updating cart item:", error);
      }
    } else {
      // User is not logged in, update local storage
      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemIndex = localCart.findIndex(
          (cartItem) => cartItem.variantId === item.variantId,
        );

        if (itemIndex !== -1) {
          localCart[itemIndex].quantity = newQuantity;
          localStorage.setItem("cart", JSON.stringify(localCart));
          fetchCartFromLocalStorage();
        }
      } catch (error) {
        console.error("Error updating local cart:", error);
      }
    }

    setIsUpdating(false);
  };

  const handleRemove = async (item) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const token = localStorage.getItem("authToken");

    if (token) {
      // User is logged in, remove from server cart
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/products/cart/updateCart`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `${token}`,
            },
            body: JSON.stringify({
              cartItemId: item.id,
              variantId: item.variantId,
              quantity: 0,
            }),
          },
        );

        if (response.ok) {
          await fetchCart();
        } else {
          console.error("Failed to remove item from cart");
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    } else {
      // User is not logged in, remove from local storage
      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = localCart.filter(
          (cartItem) => cartItem.variantId !== item.variantId,
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        fetchCartFromLocalStorage();
      } catch (error) {
        console.error("Error removing item from local cart:", error);
      }
    }

    setIsUpdating(false);
  };

  const { deliveryCharge, totalItems, totalPrice } = cartSummary;

  // Calculate total base price differently based on logged in status
  const totalBasePrice = isLoggedIn
    ? cartItems.reduce(
        (sum, item) => sum + item.product.basePrice * item.quantity,
        0,
      )
    : cartItems.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

  const totalDiscount = totalBasePrice - (totalPrice - deliveryCharge);

  return (
    <div className="bg-[#191919] text-white min-h-screen flex flex-col lg:p-0 p-4">
      <div className="sm:pb-36 pb-20">
        <TopBar />
      </div>
      <div className="container mx-auto flex-grow">
        <div className="flex md:gap-4 gap-2">
          <button
            onClick={() => router.push("/")}
            className="pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-4"
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
          <h1 className="sm:text-3xl text-2xl font-bold">My cart</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center content-center pt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-gray-400">
              Add items to your cart to see them here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 pt-2 sm:pt-8">
            <div className="flex-1 space-y-2 ">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id || index}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>

            <div className="w-full md:w-1/3">
              <Checkout
                cartSummery={cartSummary}
                totalDiscount={totalDiscount}
                totalBasePrice={totalBasePrice}
                activeAddress={activeAddress}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto pt-28">
        <Footer />
      </div>
    </div>
  );
}
