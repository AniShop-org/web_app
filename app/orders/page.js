"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from "../componenets/topbar";
import OrderCard from "../componenets/orderCard";
import { SideNav } from '../componenets/sideNav';
import Footer from '../componenets/footer';
import { useRouter } from 'next/navigation';

export default function OrderPage() {

    const router = useRouter();

    if (typeof window != 'undefined') {
        if (!localStorage.getItem('authToken')) {
            router.push('/login');
        }
    }   

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
    function getOrderStatus(order) {
        if (!order?.Orderstatus?.length) return 'Unknown Status';
        const matchedStatus = order.Orderstatus.find((s) => s.id === order.statusId);
        return matchedStatus ? matchedStatus.status : 'Unknown Status';
    }

  const filterOrders = (orders) => {
    return orders.filter((order) => {
      const finalStatus = getOrderStatus(order);

      switch (activeTab) {
        case 'Ongoing':
          return [
            'PAYMENT_PENDING',
            'ORDER_PLACED',
            'ORDER_CONFIRMED',
            'ORDER_DISPATCHED',
            'OUT_FOR_DELIVERY',
            'ISSUED_REPLACEMENT',
            'REPLACEMENT_CONFIRMED',
            'ORDER_REFUND',
          ].includes(finalStatus);

        case 'Completed':
          return [
            'ORDER_DELIVERED',
            'ORDER_REPLACED',
          ].includes(finalStatus);

        case 'Canceled':
          return [
            'ORDER_CANCELLED',
            'PAYMENT_FAILED',
            'ORDER_REJECTED',
            'REPLACEMENT_REJECTED',
          ].includes(finalStatus);

        default:
          // 'All Orders' shows everything
          return true;
      }
    });
  };

    const filteredOrders = filterOrders(orders);
    const hasMoreOrders = visibleOrders < filteredOrders.length;

    const handleLoadMore = () => {
        setVisibleOrders(prev => prev + 3);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] sm:pt-36 pt-12">
            <TopBar />

            <div className="flex-grow mx-auto container px-6 pt-8">
                <div className="flex gap-8">
                    <SideNav />
                    <div className="flex-1">
                        <div className="mb-8">
                            <div className='flex md:gap-4 gap-2'>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="mb-6 pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <h1 className="sm:text-3xl text-2xl font-bold text-white mb-6">My Orders</h1>
                            </div>
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
                                            setVisibleOrders(3);
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
                            <div className="flex justify-center content-center pt-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
                            </div> 
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