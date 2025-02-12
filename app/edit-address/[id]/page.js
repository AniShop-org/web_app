"use client";

import Footer from "@/app/componenets/footer";
import { SideNav } from "@/app/componenets/sideNav";
import { TopBar } from "@/app/componenets/topbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditaddressPage = () => {
    const id = useParams().id;
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        addressType: '',
        address: '',
        landmark: '',
        locality: '',
        pincode: '',
        district: '',
        city: '',
        state: '',
        country: 'India',
        setActive: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const fetchAddress = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://anishop-backend-test.onrender.com/api/v1/user/account/address/${id}`, {
                headers: {
                    'Authorization': typeof window !== 'undefined'
                        ? localStorage.getItem('authToken')
                        : ''
                }
            });
            const data = await response.json();
            console.log(data.address);
            setFormData({
                name: data.address.name || '',
                mobile: data.address.mobile || '',
                addressType: data.address.addressType || '',
                address: data.address.address || '',
                landmark: data.address.landmark || '',
                locality: data.address.locality || '',
                pincode: data.address.pincode || '',
                district: data.address.district || '',
                city: data.address.city || '',
                state: data.address.state || '',
                country: data.address.country || 'India',
                setActive: data.address.isDefault || false
            });
        } catch (error) {
            console.error('Error fetching address:', error);
            setError('Error fetching address. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAddress();
    }, [id]);

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`https://anishop-backend-test.onrender.com/api/v1/user/account/update-address/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': typeof window !== 'undefined'
                        ? localStorage.getItem('authToken')
                        : ''
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.status === 'Success') {
                router.push('/address');   
            }
        } catch (error) {
            console.error('Error updating address:', error);
            setError('Error updating address. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    if (loading && Object.keys(formData).every(key => !formData[key])) {
        return (
            <div className="min-h-screen flex flex-col bg-[#191919]">
                <TopBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-200" />
                </div>
                <Footer />
            </div>
        );
    }

return (
    <div className="min-h-screen flex flex-col bg-[#191919]">
        <TopBar />
        
        <div className="flex-grow mx-auto w-full px-4 md:px-6 lg:pt-36 pt-20 container">
            <div className="flex flex-col md:flex-row md:gap-8">
                <div className="hidden md:block">
                    <SideNav />
                </div>
                
                <div className="flex-1">
                    <div className="mb-6 md:mb-8">
                        <h1 className="md:text-3xl text-2xl font-bold text-white">
                            Edit address
                        </h1>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAddressUpdate} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Address Type
                                </label>
                                <select
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.addressType}
                                    onChange={(e) => setFormData({...formData, addressType: e.target.value})}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Hostel">Hostel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Landmark
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.landmark}
                                    onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Locality
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.locality}
                                    onChange={(e) => setFormData({...formData, locality: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                    maxLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    District
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.district}
                                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm md:text-md font-medium text-gray-200 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#222222] border border-[#222222] rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-[#FF3333]"
                                    value={formData.state}
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="setActive"
                                    className="w-4 h-4 bg-[#222222] border-[#222222] rounded text-[#FF3333] focus:ring-[#FF3333]"
                                    checked={formData.setActive}
                                    onChange={(e) => setFormData({...formData, setActive: e.target.checked})}
                                />
                                <label htmlFor="setActive" className="text-sm md:text-base text-gray-200">
                                    Set as default address
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto bg-[#FF3333] text-white px-6 py-2.5 md:py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                            >
                                {loading ? 'Please wait...' : 'Change address'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div className='mt-auto pt-36 md:pt-36'>
            <Footer />
        </div>
    </div>
    );
}

export default EditaddressPage;