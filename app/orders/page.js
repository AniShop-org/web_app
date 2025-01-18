"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from "../componenets/topbar";
import OrderCard from "../componenets/orderCard";
import { SideNav } from '../componenets/sideNav';
import Footer from '../componenets/footer';

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Orders');
    const [visibleOrders, setVisibleOrders] = useState(3);
    
    const tabs = [
        'All Orders',
        'Ongoing',
        'Completed',
        'Canceled'
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/order/all', {
                headers: { 'Authorization': `${token}` }
            });
            const data = await response.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterOrders = (orders) => {
        switch (activeTab) {
            case 'Ongoing':
                return orders.filter(order => 
                    ['PENDING', 'PAYMENT_PENDING', 'ORDER_CONFIRMED', 'ORDER_DISPATCHED'].includes(order.status)
                );
            case 'Completed':
                return orders.filter(order => 
                    order.status === 'ORDER_DELIVERED'
                );
            case 'Canceled':
                return orders.filter(order => 
                    order.status === 'ORDER_CANCELLED'
                );
            default:
                return orders;
        }
    };

    const filteredOrders = filterOrders(orders);
    const hasMoreOrders = visibleOrders < filteredOrders.length;

    const handleLoadMore = () => {
        setVisibleOrders(prev => prev + 3);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] pt-36">
            <TopBar />

            <div className="flex-grow mx-auto container px-6 pt-8">
                <div className="flex gap-8">
                    <SideNav />
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white mb-6">My Orders</h1>
                            
                            {/* Status Tabs */}
                            <div className="flex gap-4 border-b border-[#252525]">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        className={`pb-2 px-2 text-sm font-medium transition-colors relative ${
                                            activeTab === tab 
                                                ? 'text-white' 
                                                : 'text-gray-400 hover:text-gray-300'
                                        }`}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setVisibleOrders(3); // Reset visible orders when changing tabs
                                        }}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className='text-lg font-bold text-white'>Loading Orders...</div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.length === 0 ? (
                                    <div className="rounded-2xl bg-[#1A1A1A] p-8 text-center text-gray-400">
                                        No orders found.
                                    </div>
                                ) : (
                                    <>
                                        {filteredOrders.slice(0, visibleOrders).map(order => (
                                            <OrderCard key={order.id} order={order} />
                                        ))}
                                        
                                        {hasMoreOrders && (
                                            <div className="flex justify-center pt-4">
                                                <button 
                                                    onClick={handleLoadMore}
                                                    className="px-6 py-2 text-sm text-white bg-[#252525] rounded-full hover:bg-[#303030] transition-colors"
                                                >
                                                    View all
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className='pt-36'>
                <Footer />
            </div>
        </div>
    );
}