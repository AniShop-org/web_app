"use client"

import { useState } from 'react';
import { LogOutIcon, LucideLogIn, MapPinned, PackageSearch, ShoppingBagIcon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import AlertModal from './logout-aleet';

export default function AccountDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const router = useRouter();
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = () => {
        setShowSignOutModal(true);
    };

    const confirmSignOut = () => {
        localStorage.removeItem('authToken');
        router.push('/login');
        setShowSignOutModal(false);
    };

    const isLoggedIn = Boolean(typeof window !== "undefined" ? localStorage.getItem("authToken") : null);
    return (
        <div className="relative" title="open menu">
            <button
                id="dropdownUserAvatarButton"
                onClick={toggleDropdown}
                className="flex text-sm"
                type="button"
            >
                <span className="sr-only">Open user menu</span>
                <User className="h-5 w-5 lg:h-6 lg:w-6" color="white" />
            </button>

            {isOpen && (
                isLoggedIn ? (
                    <div
                        id="dropdownAvatar"
                        className="absolute right-0 mt-2 w-40 rounded-lg shadow bg-[#1A1A1A] border border-[#252525]"
                    >
                        <ul className="font-thin text-white">
                            <li>
                                <h2 className="mb-2 text-xl font-bold text-white flex justify-start gap-4 items-center px-4 pt-2">
                                    My Account
                                </h2>
                            </li>
                            <li>
                                <a
                                    href="/orders"
                                    className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#252525]"
                                >
                                    <PackageSearch size={18} /> Orders
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/wishlist"
                                    className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#252525]"
                                >
                                    <ShoppingBagIcon size={18} /> Wishlist
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/address"
                                    className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#252525]"
                                >
                                    <MapPinned size={18} /> Address
                                </a>
                            </li>
                        </ul>
                        <div>
                            <button
                                onClick={handleSignOut}
                                className="flex justify-start gap-4 items-center px-4 pb-2 hover:bg-[#252525] w-full text-white"
                            >
                                <LogOutIcon size={18} fill="white" /> Log out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="absolute right-0 mt-2 w-40 rounded-lg shadow bg-[#1A1A1A] border border-[#252525]">
                        <ul className="font-thin text-white">
                            <li>
                                <a
                                    href="/login"
                                    className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#252525]"
                                >
                                    <LucideLogIn size={18}/>Login
                                </a>
                            </li>
                        </ul>
                    </div>
                )
            )}
            <AlertModal
                isOpen={showSignOutModal}
                onClose={() => setShowSignOutModal(false)}
                onConfirm={confirmSignOut}
            />
        </div>
    );
}