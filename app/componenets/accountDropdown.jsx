"use client"

import { useState } from 'react';
import { LogOutIcon, MapPinned, ShoppingBagIcon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = () => {
        localStorage.removeItem('authToken');
        router.push('/login')
    };

    return (
        <div className="relative" title='open menu'>
            <button
                id="dropdownUserAvatarButton"
                onClick={toggleDropdown}
                className="flex text-sm"
                type="button"
            >
                <span className="sr-only">Open user menu</span>
                <User size={24} color="white" />
            </button>

            {isOpen && (
                <div
                    id="dropdownAvatar"
                    className="absolute right-0 mt-2 w-40 rounded-lg shadow bg-[#2A2A2A]"
                >
                    <ul className="font-thin text-white">
                        <li>
                            <a
                                href="#"
                                className="flex justify-start gap-4 items-center px-4 pt-2 hover:bg-[#191919]"
                            >
                                <User size={18} fill='white'/>  Account
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#191919]"
                            >
                                Orders
                            </a>
                        </li>
                        <li>
                            <a
                                href="/wishlist"
                                className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#191919]"
                            >
                                <ShoppingBagIcon size={18} /> Wishlist
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex justify-start gap-4 items-center px-4 py-1 hover:bg-[#191919]"
                            >
                                <MapPinned size={18} /> Address
                            </a>
                        </li>
                    </ul>
                    <div className="">
                        <button
                            onClick={handleSignOut}
                            className="flex justify-start gap-4 items-center px-4 pb-2 hover:bg-[#191919] w-full"
                        >
                            <LogOutIcon size={18} fill='white' /> Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}