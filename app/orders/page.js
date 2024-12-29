"use client";

import React, { useEffect, useState } from 'react';
import { TopBar } from "../componenets/topbar";
import OrderCard from "../componenets/orderCard";
import { SideNav } from '../componenets/sideNav';
import Footer from '../componenets/footer';

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] pt-36">
            <TopBar />

            <div className="flex-grow mx-auto container px-6 pt-8">
                <div className="flex gap-8">
                    <SideNav />
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-white">Orders</h1>
                        </div>
                        {isLoading ? <div className='text-lg font-bold'>Loading Orders...</div> : (<div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="rounded-2xl bg-[#1A1A1A] p-8 text-center text-gray-400">
                                    No orders found.
                                </div>
                            ) : (
                                orders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </div>)}
                        
                    </div>
                </div>
            </div>
            <div className='pt-36'>
                <Footer />
            </div>
        </div>
    );
}