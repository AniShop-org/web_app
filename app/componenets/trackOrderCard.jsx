"use client";
import { MoreVertical, Timer, CheckCircle, ChevronRight, AlertTriangle, Star, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const statusConfig = {
    'PAYMENT_PENDING': { color: '#F0A500', icon: Timer, text: 'Payment Pending' },
    'ORDER_PLACED': { color: '#F0A500', icon: Timer, text: 'Order Placed' },
    'ORDER_CONFIRMED': { color: '#83BF6E', icon: CheckCircle, text: 'Order Confirmed' },
    'ORDER_DISPATCHED': { color: '#F0A500', icon: Timer, text: 'Order Dispatched' },
    'OUT_FOR_DELIVERY': { color: '#F0A500', icon: Timer, text: 'Out for Delivery' },
    'ORDER_DELIVERED': { color: '#83BF6E', icon: CheckCircle, text: 'Order Delivered' },
    'ISSUED_REPLACEMENT': { color: '#FFAA00', icon: Timer, text: 'Replacement Issued' },
    'REPLACEMENT_CONFIRMED': { color: '#83BF6E', icon: CheckCircle, text: 'Replacement Confirmed' },
    'ORDER_REPLACED': { color: '#83BF6E', icon: CheckCircle, text: 'Order Replaced' },
    'ORDER_CANCELLED': { color: '#FF3333', icon: AlertTriangle, text: 'Order Cancelled' },
    'ORDER_REJECTED': { color: '#FF3333', icon: AlertTriangle, text: 'Order Rejected' },
    'ORDER_REFUND': { color: '#FFAA00', icon: Timer, text: 'Refund Processed' },
    'PAYMENT_FAILED': { color: '#FF3333', icon: AlertTriangle, text: 'Payment Failed' },
    'REPLACEMENT_REJECTED': { color: '#FF3333', icon: AlertTriangle, text: 'Replacement Rejected' },
};

function getCurrentStatusKey(order) {
    if (!order?.Orderstatus?.length) return 'Unknown Status';
    const matchedStatus = order.Orderstatus.find((s) => s.id === order.statusId);
    return matchedStatus ? matchedStatus.status : 'Unknown Status';
}


const TrackOrderCard = ({ order }) => {
    const router = useRouter();


    const currentStatusKey = getCurrentStatusKey(order);
    const status = statusConfig[currentStatusKey] || {
        color: '#F0A500',
        icon: Timer,
        text: 'Unknown Status',
    };

    const StatusIcon = status.icon;

    return (
        <>
            <div
                className="rounded-2xl bg-[#1A1A1A] overflow-hidden border border-[#252525] hover:shadow-lg duration-200 cursor-pointer max-w-2xl"
                onClick={() => {
                    router.push(`/products/${order.product.id}?category=${order.product.categoryId}`);
                }}
            >
                <div className=" p-2">
                    <div className="flex gap-4">
                        <Image
                            className="sm:h-28 sm:w-24 h-28 w-24 object-cover rounded-lg"
                            src={order.product.images[0]}
                            alt={order.product.name}
                            width={128}
                            height={128}
                        />

                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-white">
                                        {order.product.name.length > 20 
                                            ? order.product.name.substring(0, 15) + '...' 
                                            : order.product.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">Size {order.varient}</p>
                                </div>
                                {/* Status Indicator */}
                                <div className="flex items-center gap-1 text-xs sm:text-sm">
                                    <StatusIcon size={16} style={{ color: status.color }} />
                                    <span style={{ color: status.color }}>{status.text}</span>
                                </div>
                            </div>
                            <div className="mt-2 text-white text-sm">
                                <div className='flex gap-1'>
                                    <div>Quantity:</div> {order.quantity || 'N/A'}
                                </div>
                                <div className='sm:text-base'>
                                    <strong>Price:</strong> ₹{order.price || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackOrderCard;
