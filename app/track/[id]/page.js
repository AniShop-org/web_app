"use client";

import Footer from "@/app/componenets/footer";
import OrderCard from "@/app/componenets/orderCard";
import { SideNav } from "@/app/componenets/sideNav";
import { TopBar } from "@/app/componenets/topbar";
import TrackingPage from "@/app/componenets/trackOrder";
import { useParams } from "next/navigation"
import { use, useEffect, useState } from "react";

export default function() {

    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('authToken');
    if (!token) {
        router.push('/login');
    }
    const [order, setOrder] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const id = useParams().id;

    const fetchOrders = async () => {

        try {
            const res = await fetch(`https://anishop-backend-test.onrender.com/api/v1/order/id/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            });
            console.log(res);
            const data = await res.json();
            console.log(data.order)
            setOrder(data.order);
        } catch(error) {
            console.error('Error fetching order:', error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchOrders();
    }, []);

    if (isLoading) {
        return (       
        <div className="min-h-screen flex flex-col bg-[#191919]">
            <TopBar />
            <div className="flex flex-1 container mx-auto px-4 pt-36">
                <aside>
                    <SideNav />
                </aside>
                <main className="flex-1 md:px-40 lg:pr-20">
                    <h1 className="text-white text-4xl font-bold pb-6">Order status</h1>
                    <div className="flex justify-center content-center pt-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
                    </div>    
                </main>
            </div>
            <Footer />
        </div>
        );    
    }
    return (
        <div className="min-h-screen flex flex-col bg-[#191919]">
            <TopBar />
            <div className="flex flex-1 container mx-auto px-4 pt-36">
                <aside>
                    <SideNav />
                </aside>
                <main className="flex-1 md:px-40 lg:pr-20">
                    <h1 className="text-white text-4xl font-bold pb-6">Order status</h1>
                    <div className="mx-auto">
                        <OrderCard order={order} />
                        <TrackingPage order={order} />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}