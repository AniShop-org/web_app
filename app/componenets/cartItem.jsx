"use client";

import { Minus, Plus, Trash2Icon } from 'lucide-react';
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

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div className="relative flex justify-between items-center rounded-2xl border border-[#FFFFFF1A] p-2">
            <div className="flex items-center cursor-pointer" onClick={() => { router.push(`/products/${item.product.id}`) }}>
                <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="sm:w-28 sm:h-32 w-24 h-28 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <h2 className="font-bold">{truncateText(item.product.name, 20)}</h2>
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
                    <Trash2Icon className='h-4 w-4 lg:h-5 lg:w-5' color='red' />
                </button>
            </div>
            <div className='absolute bottom-6 right-3 flex items-center lg:gap-2 gap-1 bg-white rounded-full p-1 sm:p-2 lg:px-2 px-1'>
                <button
                    onClick={handleDecrease}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                >
                    <Minus className='h-3 w-3 lg:h-4 lg:w-4' />
                </button>
                <span className="sm:w-4 w-3 text-center text-black text-sm sm:text-base">{item.quantity}</span>
                <button
                    onClick={handleIncrease}
                    className="p-1 text-black hover:bg-gray-100 rounded"
                >
                    <Plus className='h-3 w-3 lg:h-4 lg:w-4' />
                </button>
            </div>
        </div>
    );
};

export default CartItem;