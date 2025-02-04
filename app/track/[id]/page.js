"use client";

import Footer from "@/app/componenets/footer";
import OrderCard from "@/app/componenets/orderCard";
import { SideNav } from "@/app/componenets/sideNav";
import { TopBar } from "@/app/componenets/topbar";
import TrackingPage from "@/app/componenets/trackOrder";
import TrackOrderCard from "@/app/componenets/trackOrderCard";
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
      <div className="container mx-auto px-4 flex-1 flex mt-36 pb-0">
        <aside>
          <SideNav />
        </aside>
        <main className="flex-1 md:px-40 lg:pr-20">
          <h1 className="text-white text-4xl font-bold pb-6">Order status</h1>

          {/* Enhanced order details */}
          <div>
            {/* Existing Order Card */}
            <TrackOrderCard order={order} />

            {/* Additional Order Details */}
            {/* <div className="bg-[#222222] p-6 rounded-md space-y-4">
              <h2 className="text-xl font-semibold text-white">Order Details</h2>
              <div className="text-white text-sm flex flex-col gap-2">
                <span><strong>Order ID:</strong> {order._id || 'N/A'}</span>
                <span><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                <span><strong>Total Amount:</strong> {order.totalAmount ? `₹${order.totalAmount}` : 'N/A'}</span>
                <span><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</span>
                <span><strong>Shipping Address:</strong> {order?.shippingAddress?.addressLine || 'N/A'}</span>
              </div>
            </div> */}

            {/* Tracking Page */}
            <TrackingPage order={order} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
    )
}