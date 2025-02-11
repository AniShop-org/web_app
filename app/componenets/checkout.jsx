"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Razorpay from 'razorpay';
import { Banknote, MapPin } from 'lucide-react';

const Checkout = ({ cartSummery, totalDiscount, totalBasePrice, activeAddress }) => {
    const [paymentMethod, setPaymentMethod] = useState('prepaid');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const shippingFee = cartSummery?.deliveryCharge || 0;
    const total = cartSummery.totalPrice;

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            if (paymentMethod === 'prepaid') {
                const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/order/checkout/prepaid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": localStorage.getItem('authToken'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to create order');
                }

                const order = await response.json();
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: order.razorpayResponse.amount,
                    currency: order.razorpayResponse.currency,
                    description: 'Order Payment',
                    order_id: order.razorpayResponse.id,
                    prefill: {
                        name: order.name,
                        email: order.email,
                        contact: order.mobileNumber,
                    },
                    handler: async (response) => {
                        try {
                            const verifyResponse = await fetch('https://anishop-backend-test.onrender.com/api/v1/order/verify-payment-signature', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": localStorage.getItem('authToken'),
                                },
                                body: JSON.stringify({
                                    isWeb: true,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });
                            if (!verifyResponse.ok) {
                                throw new Error('Payment verification failed');
                            }

                            router.push('/order-success');
                        } catch (error) {
                            console.error('Payment verification failed', error);
                            alert('Payment verification failed. Please try again.');
                        }
                    },
                    theme: {
                        color: '#F37254',
                    },
                };

                if (typeof window !== 'undefined' && window.Razorpay) {
                    const paymentObject = new window.Razorpay(options);
                    paymentObject.open();
                }
            } else {
                const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/order/checkout/cod-verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": localStorage.getItem('authToken'),
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to send OTP');
                }
                router.push('/order-confirmation-otp');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="space-y-6 rounded-3xl border border-[#FFFFFF1A] p-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Delivery Address</h3>
                        <button className="text-blue-500 text-sm underline" onClick={() => router.push("/change-address")}>Change</button>
                    </div>
                    <div className="flex items-start space-x-2">
                        <MapPin className="w-5 h-5 mt-1" />
                        <div>
                            <h4 className="font-medium">{activeAddress.addressType}</h4>
                            <p className="text-sm text-gray-400">{activeAddress.landmark}, {activeAddress.address}, {activeAddress.city}, {activeAddress.pincode}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-[#32323280] pt-4">
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPaymentMethod('prepaid')}
                            className={`w-full p-2 rounded-2xl border flex flex-col items-center space-y-2 ${paymentMethod === 'prepaid'
                                ? ' bg-white text-black border-white'
                                : 'border-[#32323280]'
                            }`}
                        >
                            <img src="/razorpay-logo.png" alt="Razorpay" className="lg:h-6 h-3" />
                        </button>

                        <button
                            onClick={() => setPaymentMethod('cod')}
                            className={`w-full rounded-2xl border flex items-center justify-center ${paymentMethod === 'cod'
                                ? 'border-white bg-white text-black'
                                : 'text-[#898989] border-[#32323280]'
                                }`}
                        >
                            <Banknote className='h-4 lg:h-6'/>
                            <span className="lg:text-lg text-md text-sm lg:pl-2">Cash</span>
                        </button>
                    </div>
                </div>


                <div className="space-y-4 border-t border-[#32323280] pt-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-[#808080] text-sm sm:text-lg">Sub-total</span>
                            <span className='text-sm sm:text-lg'>₹{totalBasePrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#808080] text-sm sm:text-lg">Total discount</span>
                            <span className='text-sm sm:text-lg'>₹{totalDiscount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#808080] text-sm sm:text-lg">Shipping fee</span>
                            <span className='text-sm sm:text-lg'>₹{shippingFee}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-[#434343] text-xl">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='pt-4'>
            <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-4 bg-red-500 text-white rounded-full font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
                <span>{isLoading ? 'Processing...' : 'Place Order'}</span>
                {!isLoading && <span>→</span>}
            </button>
            </div>
        </div>
    );
};

export default Checkout;