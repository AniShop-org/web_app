"use client";

import { useRouter } from "next/navigation";
import { NotificationList } from "../componenets/notificationList";
import { useEffect, useState } from "react";
import Footer from "../componenets/footer";
import { TopBar } from "../componenets/topbar";
import { Bell } from "lucide-react";
import { SideNav } from "../componenets/sideNav";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/notifications', {
          headers: {
            'authorization': token,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
        } else {
          setNotifications(data);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  return (
    <div className="bg-[#191919] text-white min-h-screen flex flex-col">
      <TopBar />
      <main className="container mx-auto px-4 py-6 flex flex-row sm:mt-36 mt-14 flex-grow">
        {/* Side navigation on the left */}
        <div>
          <SideNav />
        </div>
        {/* Main notifications content on the right */}
        <div className="ml-4 md:pl-20 flex flex-col flex-grow">
          <div className="flex md:gap-4 gap-2">
          <button
            onClick={() => router.push('/')}
            className="pr-2 py-2 text-sm text-white rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="">
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          </div>
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No notifications yet</h3>
              <p className="text-gray-400">
                We'll notify you when something important happens
              </p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <NotificationList notifications={notifications} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}