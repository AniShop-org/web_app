import React from 'react';
import { format } from 'date-fns';
import { Package, CreditCard, ShoppingCart, Bell } from 'lucide-react';

const NotificationIcon = ({ type }) => {
    switch (type) {
        case 'SHIPMENT_DISPATCHED':
            return <Package className="w-5 h-5 text-blue-500" />;
        case 'PAYMENT_SUCCESSFUL':
            return <CreditCard className="w-5 h-5 text-green-500" />;
        case 'ORDER_CREATED':
            return <ShoppingCart className="w-5 h-5 text-purple-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

const NotificationMessage = ({ type, data }) => {
    switch (type) {
        case 'SHIPMENT_DISPATCHED':
            return (
                <>
                    <p className="font-medium">Shipment Dispatched!</p>
                    <p className="text-sm text-[#808080]">
                        Your order is on its way via {data.carrier}. Track: {data.trackingNumber}
                    </p>
                </>
            );
        case 'PAYMENT_SUCCESSFUL':
            return (
                <>
                    <p className="font-medium">Payment Successful</p>
                    <p className="text-sm text-gray-400">
                        Payment of ${data.amountPaid} received via {data.paymentMethod}
                    </p>
                </>
            );
        case 'ORDER_CREATED':
            return (
                <>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-400">
                        Order placed for ${data.subtotal} with {data.shippingMethod} shipping
                    </p>
                </>
            );
        default:
            return <p className="font-medium">New Notification</p>;
    }
};

const NotificationItem = ({ notification }) => {
    return (
        <div className="flex items-start gap-4 p-4">
            <div className="p-2 bg-gray-100 rounded-lg">
                <NotificationIcon type={notification.type} />
            </div>
            <div className="flex-1">
                <NotificationMessage type={notification.type} data={notification.data} />
                <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                </p>
            </div>
            {/* {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            )} */}
        </div>
    );
};

export const NotificationList = ({ notifications }) => {
    const groupByDate = (notifications) => {
        const groups = {};
        notifications.forEach(notification => {
            const date = format(new Date(notification.createdAt), 'MMM d, yyyy');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(notification);
        });
        return groups;
    };

    const groupedNotifications = groupByDate(notifications);

    return (
        <div className="max-w-2xl mx-auto">
            {Object.entries(groupedNotifications).map(([date, items], index) => (
                <div key={date}>
                    <h3 className="text-lg font-bold text-white px-4 pb-2 sticky top-0">
                        {date}
                    </h3>
                    <div className={index < Object.entries(groupedNotifications).length - 1 ? "divide-y divide-[#3C3C3C]" : ""}>
                        {items.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};