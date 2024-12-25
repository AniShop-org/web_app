"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const WishListItem = ({ item, onRemove }) => {
    const router = useRouter();

    const handleRemove = () => {
        onRemove(item);
    };

    return (
        <div className="relative flex flex-col items-center rounded-2xl border border-[#FFFFFF1A] p-4 bg-[#1A1A1A]">
            <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-52 object-cover rounded-lg"
                onClick={() => router.push(`/products/${item.id}`)}
            />
            <div className="flex flex-col items-center mt-3 text-center">
                <h2 className="text-lg font-bold text-white">{item.name}</h2>
                <p className="text-[#FFFFFF99] text-sm mt-1">{item.rating} / 5</p>
                <p className="text-white font-bold text-xl mt-1">₹{item.discountPrice}</p>
            </div>
            <button
                onClick={handleRemove}
                className="mt-3 p-2 text-red-500"
            >
                <Trash2Icon size={24} />
            </button>
        </div>
    );
};

export default WishListItem;
