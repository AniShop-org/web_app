import { MoreVertical, Timer, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';

const statusConfig = {
    'PENDING': { color: '#F0A500', icon: Timer, text: 'Pending' },
    'PAYMENT_PENDING': { color: '#F0A500', icon: Timer, text: 'Payment Pending' },
    'PAYMENT_SUCCESS': { color: '#83BF6E', icon: CheckCircle, text: 'Payment Success' },
    'ORDER_CONFIRMED': { color: '#83BF6E', icon: CheckCircle, text: 'Confirmed' },
    'ORDER_DISPATCHED': { color: '#F0A500', icon: Timer, text: 'Dispatched' },
    'ORDER_DELIVERED': { color: '#83BF6E', icon: CheckCircle, text: 'Delivered' },
    'ORDER_CANCELLED': { color: '#FF3333', icon: AlertTriangle, text: 'Cancelled' }
};

const OrderCard = ({ order }) => {
    const status = statusConfig[order.status] || statusConfig.PENDING;
    const StatusIcon = status.icon;
    const isCompleted = order.isCompleted;

    return (
        <div className="rounded-2xl bg-[#1A1A1A] overflow-hidden border border-[#252525]">
            <div className="p-4">
                <div className="flex gap-4">
                    <img className='h-32 w-32 object-cover rounded-lg' 
                        src={order.product.images[0]}
                    />

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-white">{order.product.name}</h3>
                                <p className="mt-1 text-sm text-gray-400">Size {order.varient}</p>
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
                                {!isCompleted && (
                                    <button className="flex items-center gap-1 text-sm font-medium text-[#83BF6E]">
                                        Check Status
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Order#: {order.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 border-t border-[#252525] text-sm">
                <button className="p-3 text-center font-medium text-[#83BF6E] hover:bg-[#252525]">
                    Rate Product
                </button>
                <button className="border-l border-[#252525] p-3 text-center font-medium text-white hover:bg-[#252525]">
                    Share
                </button>
            </div>
        </div>
    );
};

export default OrderCard;