"use client";

import { Minus, Plus, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CartItem = ({ item, onQuantityChange, onRemove, isLoggedIn }) => {
  const router = useRouter();

  const handleIncrease = () => {
    onQuantityChange(item, "increase");
  };

  const handleDecrease = () => {
    onQuantityChange(item, "decrease");
  };

  const handleRemove = () => {
    onRemove(item);
  };

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Extract properties based on whether the user is logged in or not
  let productId,
    productName,
    productImage,
    quantity,
    variantSize,
    basePrice,
    discountPrice;

  if (isLoggedIn) {
    // Server-side cart item structure
    productId = item.product.id;
    productName = item.product.name;
    productImage = item.product.images[0];
    quantity = item.quantity;
    variantSize = item.variant.size;
    basePrice = item.product.basePrice;
    discountPrice = item.product.discountPrice;
  } else {
    // Local storage cart item structure (based on provided JSON)
    productId = item.id;
    productName = item.name;
    productImage = item.images[0];
    quantity = item.quantity || 1;
    variantSize =
      item.variants && item.variants.length > 0 ? item.variants[0].size : "N/A";
    basePrice = item.basePrice;
    discountPrice = item.discountPrice;
  }

  return (
    <div className="relative flex justify-between items-center rounded-2xl border border-[#FFFFFF1A] p-2">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          router.push(`/products/${productId}`);
        }}
      >
        <img
          src={productImage}
          alt={productName}
          className="sm:w-28 sm:h-32 w-24 h-28 object-cover rounded-lg"
        />
        <div className="ml-4">
          <h2 className="font-bold">{truncateText(productName, 20)}</h2>
          <p className="text-[#FFFFFF99]">Size: {variantSize}</p>
          <p className="text-[#FFFFFF99] text-sm">
            M.R.P: <s>₹{basePrice}</s>
          </p>
          <p className="text-white font-bold text-xl">₹{discountPrice}</p>
        </div>
      </div>
      <div className="absolute top-5 right-3 flex flex-col items-end">
        <button onClick={handleRemove} className="ml-4 p-2">
          <Trash2Icon className="h-4 w-4 lg:h-5 lg:w-5" color="red" />
        </button>
      </div>
      <div className="absolute bottom-6 right-3 flex items-center lg:gap-2 gap-1 bg-white rounded-full p-1 sm:p-1.5 lg:px-2 px-1">
        <button
          onClick={handleDecrease}
          className="p-1 text-black hover:bg-gray-100 rounded"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="sm:w-4 w-3 text-center text-black text-sm">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="p-1 text-black hover:bg-gray-100 rounded"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
