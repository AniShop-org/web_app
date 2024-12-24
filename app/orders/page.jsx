import Footer from "../componenets/footer";
import OrderCard from "../componenets/orderCard";
import { TopBar } from "../componenets/topbar";

export default function OrderPage() {
    return (
        <div className="bg-[#191919] text-white min-h-screen p-8">
            <div className="pb-28">
                <TopBar />
            </div>
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8">Your Wishlist</h1>

                    <div>Your wishlist is empty.</div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-2">
                            <OrderCard/>
                        </div>
                    </div>
            </div>
        </div>
    );
}