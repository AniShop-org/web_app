"use client";

import { Minus, Plus, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const WishListItem= ({ item, onRemove }) => {
    const router = useRouter();
    const handleRemove = () => {
        onRemove(item);
    };

    return (
        <div className="relative flex justify-between items-center rounded-2xl border border-[#FFFFFF1A] lg:p-4 p-2">
            <div className="flex items-center cursor-pointer" onClick={() => { router.push(`/products/${item.id}`) }}>
                <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-28 h-32 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-[#FFFFFF99] text-sm">M.R.P: <s>₹{item.basePrice}</s></p>
                    <p className="text-white font-bold text-xl">₹{item.discountPrice}</p>
                </div>
            </div>
            <div className="absolute top-5 right-3 flex flex-col items-end">
                <button
                    onClick={handleRemove}
                    className="ml-4 p-2"
                >
                    <Trash2Icon size={24} color='red' />
                </button>
            </div>

        </div>
    );
};

export default WishListItem;