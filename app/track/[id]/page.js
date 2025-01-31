"use client";

import Footer from "@/app/componenets/footer";
import OrderCard from "@/app/componenets/orderCard";
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
        return <div>Loading...</div>
    }
    return (
        <div className="min-h-screen flex flex-col bg-[#191919] pt-36">
            <header>
                <TopBar />
            </header>
            <main className="flex-1 flex flex-col items-center justify-center">
                <OrderCard order={order} />
                <TrackingPage order={order} />
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}