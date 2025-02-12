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


const OrderCard = ({ order }) => {
    const router = useRouter();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const currentStatusKey = getCurrentStatusKey(order);
    const status = statusConfig[currentStatusKey] || {
        color: '#F0A500',
        icon: Timer,
        text: 'Unknown Status',
    };
    
    const StatusIcon = status.icon;

    const getButtonText = () => {
        if (order.isCompleted && !order.isReviewed) {
            return 'Rate Product';
        }

        const cancellations = [
            'ORDER_CANCELLED',
            'ORDER_REJECTED',
            'REPLACEMENT_REJECTED',
            'PAYMENT_FAILED'
        ];

        if (cancellations.includes(currentStatusKey)) {
            return 'View Product';
        }

        return [
            'ORDER_PLACED',
            'ORDER_CONFIRMED',
            'ORDER_DISPATCHED',
            'OUT_FOR_DELIVERY'
        ].includes(currentStatusKey) ? 'Track Order' : 'View Product';
    };

    const handleButtonClick = () => {
        if (order.isCompleted && !order.isReviewed) {
            setIsReviewModalOpen(true);
            return;
        }

        const cancellations = [
            'ORDER_CANCELLED',
            'ORDER_REJECTED',
            'REPLACEMENT_REJECTED',
            'PAYMENT_FAILED'
        ];

        if (cancellations.includes(currentStatusKey)) {
            router.push(`/products/${order.product.id}?category=${order.product.categoryId}`);
            return;
        }

        if ([
            'ORDER_PLACED',
            'ORDER_CONFIRMED',
            'ORDER_DISPATCHED',
            'OUT_FOR_DELIVERY'
        ].includes(currentStatusKey)) {
            router.push(`/track/${order.id}`);
            return;
        }

        router.push(`/products/${order.product.id}?category=${order.product.categoryId}`);
    };

    const submitReview = async () => {
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const token = typeof window !== 'undefined'
                ? localStorage.getItem('authToken')
                : null;
            const response = await fetch(
                'https://anishop-backend-test.onrender.com/api/v1/order/review',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token || '',
                    },
                    body: JSON.stringify({
                        orderId: order.id,
                        rating: Number(rating),
                        comment,
                    }),
                }
            );
            if (response.ok) {
                setSuccessMessage('Review submitted successfully!');
                setTimeout(() => {
                    setIsReviewModalOpen(false);
                }, 2000);
            } else {
                setErrorMessage('Failed to submit review. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Error posting review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <div className="rounded-2xl bg-[#1A1A1A] overflow-hidden border border-[#252525]">
            <div className="p-1">
                <div className="flex gap-4">
                    <Image
                        className="sm:h-28 sm:w-28 h-24 w-20 object-cover rounded-lg"
                        src={order.product.images[0]}
                        alt={order.product.name}
                        width={128}
                        height={128}
                    />

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                    <h3 className="sm:text-lg font-medium text-white">
                                        {
                                            order.product.name.length > 25
                                                ? order.product.name.slice(0, 25) + '...'
                                                : order.product.name
                                        }
                                    </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Size {order.varient}
                                </p>
                            </div>
                        </div>

                        <div className="">
                                <div className="flex items-center text-xs sm:text-sm sm:gap-2 gap-1">
                                    <span style={{ color: status.color }}>{status.text}</span>
                                    <StatusIcon className='sm:h-5 sm:w-5 h-3 w-3' style={{ color: status.color }} />
                                </div>
                            <div className="flex items-center justify-between">
                                    <p className="sm:text-xl text-white font-semibold">
                                        ₹{order.price}
                                    </p>
                                    <div className='w-[78px] sm:w-[95px] bg-white rounded-md sm:m-2 sm:py-1 py-1 m-1'>
                                <button
                                    className="text-xs text-black flex items-center mx-auto"
                                    onClick={handleButtonClick}
                                >
                                    <span className=''>{getButtonText()}</span>
                                    {[
                                        'ORDER_PLACED',
                                        'ORDER_CONFIRMED',
                                        'ORDER_DISPATCHED',
                                        'OUT_FOR_DELIVERY',
                                    ].includes(currentStatusKey)}


                                </button>
                                    </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>


            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative bg-[#1A1A1A] w-full max-w-md mx-auto p-6 rounded-xl border border-[#252525]">
                        <button
                            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setIsReviewModalOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white">Leave a Review</h2>
                            <hr className="my-6 border-[#FFFFFF1A] sm:mx-auto" />
                            <p className="text-white mb-1 lg:text-xl">How was your order?</p>
                            <p className="text-[#808080]">Please give your rating and also your review.</p>
                        </div>

                        {successMessage && <div className="mb-4 text-green-500">{successMessage}</div>}
                        {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

                        {/* Star Rating */}
                        <div className="mb-6">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={32}
                                            fill={star <= (hoverRating || rating) ? '#F0A500' : 'transparent'}
                                            stroke={star <= (hoverRating || rating) ? '#F0A500' : '#666666'}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="mb-8">
                            <textarea
                                placeholder="Write your review..."
                                rows="4"
                                className="w-full bg-inherit text-white p-4 rounded-lg border border-[#333333] focus:outline-none focus:border-red-500 placeholder-[#FFFFFF1A]"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={submitReview}
                            disabled={!rating || isSubmitting}
                            className="w-full py-3 bg-red-600 text-black font-semibold rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderCard;
