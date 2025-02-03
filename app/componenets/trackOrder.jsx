"use client";

import { Timer, CheckCircle, AlertTriangle } from 'lucide-react';

const statusConfig = {
    PAYMENT_PENDING: { color: '#F0A500', icon: Timer, text: 'Payment Pending' },
    ORDER_PLACED: { color: '#F0A500', icon: Timer, text: 'Order Placed' },
    ORDER_CONFIRMED: { color: '#83BF6E', icon: CheckCircle, text: 'Order Confirmed' },
    ORDER_DISPATCHED: { color: '#F0A500', icon: Timer, text: 'Order Dispatched' },
    OUT_FOR_DELIVERY: { color: '#F0A500', icon: Timer, text: 'Out for Delivery' },
    ORDER_DELIVERED: { color: '#83BF6E', icon: CheckCircle, text: 'Order Delivered' },
    ISSUED_REPLACEMENT: { color: '#FFAA00', icon: Timer, text: 'Replacement Issued' },
    REPLACEMENT_CONFIRMED: { color: '#83BF6E', icon: CheckCircle, text: 'Replacement Confirmed' },
    ORDER_REPLACED: { color: '#83BF6E', icon: CheckCircle, text: 'Order Replaced' },
    ORDER_CANCELLED: { color: '#FF3333', icon: AlertTriangle, text: 'Order Cancelled' },
    ORDER_REJECTED: { color: '#FF3333', icon: AlertTriangle, text: 'Order Rejected' },
    ORDER_REFUND: { color: '#FFAA00', icon: Timer, text: 'Refund Processed' },
    PAYMENT_FAILED: { color: '#FF3333', icon: AlertTriangle, text: 'Payment Failed' },
    REPLACEMENT_REJECTED: { color: '#FF3333', icon: AlertTriangle, text: 'Replacement Rejected' },
};

const TrackingPage = ({ order }) => {
    const sortedStatuses = [...order.Orderstatus]
        .sort((a, b) => a.id - b.id)
        .filter(status => status.isCompleted && status.status !== 'PAYMENT_PENDING');
    const totalSteps = sortedStatuses.length;
    const currentStatusId = order.statusId;

    const completedCount = sortedStatuses.filter(st => st.id <= currentStatusId).length;
    const progressPercentage = (completedCount / totalSteps) * 100 - 12;

    return (
        <div className="min-h-screen p-8 text-white">
            <div className="mx-auto max-w-2xl">
                <div className="relative flex">
                    <div
                        className="relative flex-shrink-0 w-1 rounded-t-full bg-[#333333]"
                        style={{ minHeight: '400px' }}
                    >
                        {/* Active fill */}
                        <div
                            className="absolute left-0 top-0 w-1 bg-[#0C9409] rounded-t-full rounded-b-full"
                            style={{ height: `${progressPercentage}%` }}
                        />
                        {/* Rounded ball at the current position */}
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#0C9409]"
                            style={{ top: `calc(${progressPercentage}% - 8px)` }}
                        />
                    </div>

                    {/* Status content */}
                    <div className="flex-1 ml-8 space-y-8">
                        {sortedStatuses.map((status) => {
                            const isCompleted = status.id <= currentStatusId;
                            const info = statusConfig[status.status] || {
                                color: '#F0A500',
                                icon: Timer,
                                text: status.status,
                            };

                            return (
                                <div key={status.id} className="flex flex-col">
                                    <h3 className="text-lg font-medium">{info.text}</h3>
                                    <p className="mt-1 text-sm text-[#808080]">
                                        {status.updatedAt
                                            ? new Date(status.updatedAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })
                                            : 'Date not available'
                                        }
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;