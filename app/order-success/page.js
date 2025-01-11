"use client";

import { CircleCheck } from "lucide-react";
import Footer from "../componenets/footer"
import { TopBar } from "../componenets/topbar"
import { useRouter } from "next/navigation"

export default function OrderSuccessDialog() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col bg-[#191919]">
            <div>
                <TopBar />
            </div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center">
                <div className="bg-[#6F6F6F33] p-6 rounded-3xl shadow-md text-center max-w-sm">
                    <CircleCheck size={68} className="text-[#0C9409] mx-auto" />
                    <h1 className="text-2xl font-bold mb-2 pt-4">Your Order is Placed!</h1>
                    <p className="text-[#808080]">
                        Thank you for shopping with us! Your order <br/> is confirmed and will
                        be processed <br/>shortly.
                    </p>
                        <button onClick={() => router.push('/')} className="bg-[#FF3333] text-white px-4 py-3 rounded-full w-full mt-4">
                            Continue Shopping
                        </button>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}