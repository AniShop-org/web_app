"use client";

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
        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <div className="flex items-center cursor-pointer" onClick={() => { router.push(`/products/${item.product.id}`) }}>
                <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4">
                    <h2 className="text-lg font-bold">{item.product.name}</h2>
                    <p className="text-gray-400">Size: {item.variant.size}</p>
                    <p className="text-gray-400">M.R.P: ₹{item.product.basePrice}</p>
                    <p className="text-gray-400">Price: ₹{item.product.discountPrice}</p>
                </div>
            </div>
            <div className="flex items-center">
                <button
                    onClick={handleDecrease}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                >
                    -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                    onClick={handleIncrease}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded"
                >
                    +
                </button>
                <button
                    onClick={handleRemove}
                    className="ml-4 p-2 bg-red-600 hover:bg-red-500 rounded"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;