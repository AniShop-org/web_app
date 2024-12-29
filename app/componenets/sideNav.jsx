import { usePathname } from "next/navigation";
import { LogOut, MapPin, PackageSearch, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export const SideNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        router.push("/login");
    };

    const linkClasses = (href) => {
        // Highlight if current path matches
        return pathname === href
            ? "flex items-center gap-3 rounded-lg bg-[#252525] py-3 pl-4 text-white"
            : "flex items-center gap-3 rounded-lg py-3 pl-4 text-gray-400 hover:bg-[#252525] hover:text-white";
    };

    return (
        <div className="w-[280px] shrink-0 hidden md:block">
            <div className="rounded-2xl bg-[#1A1A1A] p-6 border border-[#252525]">
                <h2 className="mb-6 text-xl font-bold text-white">My Account</h2>
                <nav className="space-y-1">
                    <a href="/orders" className={linkClasses("/orders")}>
                        <PackageSearch size={20} strokeWidth={1.5} />
                        Orders
                    </a>
                    <a href="/wishlist" className={linkClasses("/wishlist")}>
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        My Wishlist
                    </a>
                    <a href="/address" className={linkClasses("/address")}>
                        <MapPin size={20} strokeWidth={1.5} />
                        Delivery Address
                    </a>
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-lg py-3 pl-4 text-gray-400 hover:bg-[#252525] hover:text-white"
                    >
                        <LogOut size={20} strokeWidth={1.5} />
                        Log out
                    </button>
                </nav>
            </div>
        </div>
    );
};