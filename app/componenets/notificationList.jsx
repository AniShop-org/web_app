"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Package, CreditCard, ShoppingCart, Bell } from 'lucide-react';

const NotificationIcon = ({ type }) => {
    switch (type) {
        case 'SHIPMENT_DISPATCHED':
            return <Package className="w-5 h-5 text-[#FFFFFF]" />;
        case 'PAYMENT_SUCCESSFUL':
            return <CreditCard className="w-5 h-5 text-[#FFFFFF]" />;
        case 'ORDER_CREATED':
            return <ShoppingCart className="w-5 h-5 text-[#FFFFFF]" />;
        default:
            return <Bell className="w-5 h-5 text-[#FFFFFF]" />;
    }
};

const NotificationMessage = ({ type, data }) => {
    switch (type) {
        case 'SHIPMENT_DISPATCHED':
            return (
                <>
                    <p className="md:font-medium">Shipment Dispatched!</p>
                    <p className="text-sm text-[#808080]">
                        Your order is on its way via {data.carrier}. Track: {data.trackingNumber}
                    </p>
                </>
            );
        case 'PAYMENT_SUCCESSFUL':
            return (
                <>
                    <p className="font-medium">Payment Successful</p>
                    <p className="text-sm text-[#808080]">
                        Payment of ${data.amountPaid} received via {data.paymentMethod}
                    </p>
                </>
            );
        case 'ORDER_CREATED':
            return (
                <>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-[#808080]">
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
            <div className="p-2 rounded-lg">
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

    const [visibleNotifications, setVisibleNotifications] = useState(5);
    const NOTIFICATIONS_PER_PAGE = 5;

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

    const groupedNotifications = groupByDate(
        notifications.slice(0, visibleNotifications)
    );

    const hasMoreNotifications = visibleNotifications < notifications.length;

    const handleLoadMore = () => {
        setVisibleNotifications(prev => prev + NOTIFICATIONS_PER_PAGE);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {Object.entries(groupedNotifications).map(([date, items], index, arr) => (
                <div key={date}>
                    <h3 className="md:text-base text-white px-4 pb-2 sticky top-0">
                        {date}
                    </h3>
                    {items.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))}
                    {index < arr.length - 1 && (
                        <hr className="my-4 border-[#FFFFFF1A] sm:mx-auto" />
                    )}
                </div>
            ))}

            {hasMoreNotifications && (
                <div className="flex justify-center pt-6 pb-8">
                    <button
                        onClick={handleLoadMore}
                        className="
                            px-6 py-2.5 
                            text-sm
                            text-white 
                            bg-[#252525] 
                            rounded-full 
                            hover:bg-[#303030] 
                            transition-colors
                            flex items-center gap-2
                        "
                    >
                        View More
                    </button>
                </div>
            )}
        </div>
    );
};