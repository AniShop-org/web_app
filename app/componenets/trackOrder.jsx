"use client";
import { MoreVertical, Timer, CheckCircle, ChevronRight, AlertTriangle, Star, X } from 'lucide-react';

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

const TrackingPage = ({ order }) => {
    const sortedStatuses = [...order.Orderstatus].sort((a, b) => a.id - b.id).filter(status => status.isCompleted );
    const currentStatusId = order.statusId;

    return (
        <div className="min-h-screen p-8 text-white">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-8 text-3xl font-bold">Order Tracking</h1>
                <div className="">
                    {sortedStatuses.map((status, index) => {
                        const isCompleted = status.id <= currentStatusId;
                        const isLast = index === sortedStatuses.length - 1;
                        const nextStatus = sortedStatuses[index + 1];
                        const isLineCompleted = nextStatus?.id <= currentStatusId;

                        return (
                            <div key={status.id} className="flex items-start">
                                {/* Timeline marker */}
                                <div className="mr-4 flex flex-col items-center">
                                    <div className={`${isCompleted ? 'flex h-6 w-6 items-center justify-center rounded-full bg-[#0C9409]' : 'h-6 w-6 bg-[#333333] rounded-full'}`} />
                                    {/* Vertical line */}
                                    {(
                                        <div className={`w-1 ${isLineCompleted ? 'bg-[#0C9409]' : 'bg-[#333333]'}`} style={{ height: '6rem' }} />
                                    )}
                                </div>

                                {/* Status content */}
                                <div className="flex-1 pb-8">
                                    <h3 className="text-lg font-medium text-white">
                                        {statusConfig[status.status]?.text || status.status}
                                    </h3>
                                    <p className="mt-1 text-sm text-[#808080]">
                                        {status.updatedAt ?
                                            new Date(status.updatedAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            }) :
                                            'Date not available'
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;