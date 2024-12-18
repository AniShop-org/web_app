"use client";

import { Delete, DeleteIcon, Minus, Plus, Trash, Trash2, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const router = useRouter();
    const handleIncrease = () => {
        onQuantityChange(item, 'increase');
    };

    const handleDecrease = () => {
        onQuantityChange(item, 'decrease');
    };

    const handleRemove = () => {
        onRemove(item);
    };

    return (
        <div className="relative flex justify-between items-center rounded-2xl border border-[#FFFFFF1A] lg:p-4 p-2">
            <div className="flex items-center cursor-pointer" onClick={() => { router.push(`/products/${item.product.id}`) }}>
                <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-28 h-32 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <h2 className="text-lg font-bold">{item.product.name}</h2>
                    <p className="text-[#FFFFFF99]">Size: {item.variant.size}</p>
                    <p className="text-[#FFFFFF99] text-sm">M.R.P: <s>₹{item.product.basePrice}</s></p>
                    <p className="text-white font-bold text-xl">₹{item.product.discountPrice}</p>
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
            <div className='absolute bottom-6 right-3 flex items-center lg:gap-2 gap-1 bg-white rounded-full p-2 lg:px-4 px-1'>
                <button
                    onClick={handleDecrease}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                >
                    <Minus size={20} />
                </button>
                <span className="w-8 text-center text-black">{item.quantity}</span>
                <button
                    onClick={handleIncrease}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;