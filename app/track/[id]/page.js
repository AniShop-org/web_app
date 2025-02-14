"use client";

import Footer from "@/app/componenets/footer";
import { SideNav } from "@/app/componenets/sideNav";
import { TopBar } from "@/app/componenets/topbar";
import TrackingPage from "@/app/componenets/trackOrder";
import TrackOrderCard from "@/app/componenets/trackOrderCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrackOrder() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState(null);
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const id = useParams().id;

  // Handle initial mount and auth check
  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  // Handle data fetching
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/order/id/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          }
        });
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [id, token]);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Auth check
  if (!token) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#191919]">
        <TopBar />
        <div className="flex flex-1 container mx-auto px-4 sm:pt-36 pt-20">
          <div>
            <SideNav />
          </div>
          <main className="flex-1 md:px-40 lg:pr-20">
            <h1 className="text-white sm:text-2xl text-xl font-bold pb-6">Order status</h1>
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
      <div className="container mx-auto px-4 flex-1 flex sm:mt-36 mt-20 pb-0">
        <aside>
          <SideNav />
        </aside>
        <main className="flex-1 md:px-40 lg:pr-20">
          <div className="flex md:gap-4 gap-2">
          <button
            onClick={() => router.back()}
            className="pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-white sm:text-3xl text-2xl font-bold">Order status</h1>
          </div>
          <div className="pt-6">
            <TrackOrderCard order={order} />
            <TrackingPage order={order} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}