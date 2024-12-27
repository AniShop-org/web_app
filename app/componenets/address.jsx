"use client";

import { useEffect, useState } from "react";
import { SideNav } from "./sideNav";
import { TopBar } from "./topbar";
import Footer from "./footer";

const AddressCard = ({ address, isSelected, onSelect, onRemove, onEdit }) => (
    <div className="bg-neutral-900/50 rounded-lg p-4 mb-3">
        <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => onSelect(address.id)}
        >
            <input
                type="radio"
                checked={isSelected}
                className="mt-2 h-3 w-3 accent-green-500 focus:ring-0"
                readOnly
            />
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="text-white text-sm font-medium">{address.name}</h3>
                    <span className="px-3 py-0.5 bg-white text-black rounded-full text-xs">
                        {address.addressType}
                    </span>
                </div>
                <p className="text-neutral-400 text-sm mt-1 leading-relaxed">
                    {address.address}, {address.locality}<br />
                    {address.district}<br />
                    {address.city} - {address.pincode}
                </p>
            </div>
        </div>
        <div className="flex justify-end mt-3 space-x-4 text-sm">
            <button
                onClick={() => {
                    if (window.confirm('Are you sure you want to remove this address?')) {
                        onRemove(address.id);
                    }
                }}
                className="text-neutral-400 hover:text-white transition-colors"
            >
                Remove
            </button>
            <button
                onClick={() => onEdit(address)}
                className="text-white"
            >
                Edit
            </button>
        </div>
    </div>
);

const MyAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        // Fetch active address first
        fetch('https://anishop-backend-test.onrender.com/api/v1/user/account/active-address', {
            headers: {
                'Authorization': typeof window !== 'undefined'
                    ? localStorage.getItem('authToken')
                    : ''
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success' && data.address) {
                    setSelectedAddressId(data.address.id);
                }
            })
            .catch(err => console.error('Error fetching active address:', err));

        // Fetch all addresses
        fetch('https://anishop-backend-test.onrender.com/api/v1/user/account/address', {
            headers: {
                'Authorization': typeof window !== 'undefined'
                    ? localStorage.getItem('authToken')
                    : ''
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    setAddresses(data.addresses);
                }
            })
            .catch(err => console.error('Error fetching addresses:', err));
    }, []);

    const handleAddressSelect = async (addressId) => {
        try {
            const response = await fetch(
                `https://anishop-backend-test.onrender.com/api/v1/user/account/active-address/${addressId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': typeof window !== 'undefined'
                            ? localStorage.getItem('authToken')
                            : ''
                    }
                }
            );
            const data = await response.json();
            if (data.status === 'Success') {
                setSelectedAddressId(addressId);
            }
        } catch (error) {
            console.error('Error setting active address:', error);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            const response = await fetch(
                `https://anishop-backend-test.onrender.com/api/v1/user/account/delete-address/${addressId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': typeof window !== 'undefined'
                            ? localStorage.getItem('authToken')
                            : ''
                    }
                }
            );
            const data = await response.json();
            if (data.status === 'Success') {
                setAddresses((prev) => prev.filter((address) => address.id !== addressId));
            }
        } catch (error) {
            console.error('Error removing address:', error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] pt-36">
            <TopBar />
            <div className="flex-grow container mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
                <div className="lg:w-72">
                    <SideNav />
                </div>
                <div className="flex-grow max-w-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg text-white font-medium">My Addresses</h2>
                        <button className="inline-flex items-center bg-white hover:bg-neutral-100 transition-colors text-black text-sm px-3 py-1.5 rounded-lg">
                            <span className="mr-1 text-base leading-none">+</span> Add new address
                        </button>
                    </div>
                    <div>
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                isSelected={address.id === selectedAddressId}
                                onSelect={handleAddressSelect}
                                onRemove={handleRemoveAddress}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyAddresses;