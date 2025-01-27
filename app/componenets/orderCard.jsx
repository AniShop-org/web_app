import { MoreVertical, Timer, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

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
    // Pick the last completed status (by creation time) instead of matching statusId
    const completed = order.Orderstatus
        .filter(s => s.isCompleted)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (!completed.length) return 'Unknown Status';
    return completed[completed.length - 1].status;
}


const OrderCard = ({ order }) => {
    const currentStatusKey = getCurrentStatusKey(order);
    const status = statusConfig[currentStatusKey] || {
        color: '#F0A500',
        icon: Timer,
        text: 'Unknown Status',
    };
    
    const StatusIcon = status.icon;

    const getButtonText = () => {
        switch (currentStatusKey) {
            case 'ORDER_PLACED':
            case 'ORDER_CONFIRMED':
            case 'ORDER_DISPATCHED':
            case 'OUT_FOR_DELIVERY':
                return 'Track Order';
            case 'ORDER_DELIVERED':
                return 'Rate Product';
            default:
                return 'View Product';
        }
    };

    const handleButtonClick = () => {
        switch (currentStatusKey) {
            case 'ORDER_PLACED':
            case 'ORDER_CONFIRMED':
            case 'ORDER_DISPATCHED':
            case 'OUT_FOR_DELIVERY':
                console.log('Navigating to track order page...');
                break;
            case 'ORDER_DELIVERED':
                console.log('Navigating to rate product page...');
                break;
            default:
                console.log('Navigating to product details page...');
        }
    };

    return (
        <div className="rounded-2xl bg-[#1A1A1A] overflow-hidden border border-[#252525]">
            <div className="p-4">
                <div className="flex gap-4">
                    <Image
                        className="h-32 w-32 object-cover rounded-lg"
                        src={order.product.images[0]}
                        alt={order.product.name}
                        width={128}
                        height={128}
                    />

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-white">
                                    {order.product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Size {order.varient}
                                </p>
                            </div>
                            <button className="text-gray-400">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <span style={{ color: status.color }}>{status.text}</span>
                                    <StatusIcon size={16} style={{ color: status.color }} />
                                </div>
                                <button
                                    className="flex items-center gap-1 text-sm font-medium text-[#83BF6E] hover:underline"
                                    onClick={handleButtonClick}
                                >
                                    {getButtonText()}
                                    {[
                                        'ORDER_PLACED',
                                        'ORDER_CONFIRMED',
                                        'ORDER_DISPATCHED',
                                        'OUT_FOR_DELIVERY',
                                    ].includes(currentStatusKey) && (
                                            <ChevronRight size={16} />
                                        )}
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Order#: {order.id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
