"use client";

import { useEffect, useState } from "react";
import { SideNav } from "./sideNav";
import { TopBar } from "./topbar";
import Footer from "./footer";
import { AddressCard } from "./addressCard";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ChangeAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectingId, setSelectingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const router = useRouter();

    if (typeof window != 'undefined') {
        if (!localStorage.getItem('authToken')) {
            router.push('/login');
        }
    }

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
        <div className="min-h-screen flex flex-col bg-[#191919] md:pt-36 pt-16">
            <TopBar />
            <div className="flex-grow container mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
                <div className="pr-10">
                    <SideNav />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="md:text-3xl text-2xl text-white font-bold pb-4">Select Address</h2>
                    </div>
                    <div>
                        <div className="pb-4">Saved Addresses</div>
                        {loading ? (
                            <div className="flex justify-center content-center pt-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
                            </div>
                        ) : (addresses.length === 0 ? (
                            <div className="text-center py-12">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No addresses found</h3>
                                <p className="text-gray-400">
                                    Add an address to see it here.
                                </p>
                            </div>
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
                        ))}
                    </div>
                    <div className="md:pt-8 pt-3 flex justify-between sm:gap-4 gap-2">
                        <button className="border border-[#FFFFFF] rounded-full text-xs md:text-sm lg:p-2 p-2 lg:px-20 px-4" 
                        onClick={() => 
                            router.push('/new-address')}
                        >
                            <span className="flex items-center text-white"><Plus size={18} className="md:mr-2"/>Add new address</span>
                        </button>
                        <button className="bg-[#FF3333] rounded-full lg:p-3 lg:px-20 md:px-8 px-4 sm:p-2 p-2 text-xs md:text-sm" onClick={() => {
                            router.push("/cart")
                        }}>
                            <span className="flex items-center text-white">Continue to checkout <ArrowRight className="md:ml-2" size={18}/></span>
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChangeAddress;