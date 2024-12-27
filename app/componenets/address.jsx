"use client";

import { useEffect, useState } from "react";
import { SideNav } from "./sideNav";
import { TopBar } from "./topbar";
import Footer from "./footer";
import { AddressCard } from "./addressCard";

const MyAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectingId, setSelectingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

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
                    setLoading(false);
                }
            })
            .catch(err => console.error('Error fetching addresses:', err));
    }, []);

    const handleAddressSelect = async (addressId) => {
        try {
            setSelectingId(addressId);
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
        } finally {
            setSelectingId(null);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            setDeletingId(addressId);
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
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] pt-36">
            <TopBar />
            <div className="flex-grow container mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
                <div className="pr-10">
                    <SideNav />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-4xl text-white font-bold pb-4">My Addresses</h2>
                        <button className="inline-flex items-center bg-white hover:bg-neutral-100 transition-colors text-black text-sm px-3 py-1.5 rounded-lg">
                            <span className="mr-1 text-base leading-none">+</span> Add new address
                        </button>
                    </div>
                    <div>
                        {loading ? (
                            <p className="text-white font-bold">Loading Addresses...</p>
                        ) : (
                            addresses.map((address) => (
                                <AddressCard
                                    key={address.id}
                                    address={address}
                                    isSelected={address.id === selectedAddressId}
                                    onSelect={handleAddressSelect}
                                    onRemove={handleRemoveAddress}
                                    isSelecting={selectingId === address.id}
                                    isDeleting={deletingId === address.id}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyAddresses;