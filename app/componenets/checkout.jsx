"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Razorpay from 'razorpay';
import { MapPin } from 'lucide-react';

const Checkout = ({ cartSummery, totalDiscount, totalBasePrice, activeAddress }) => {
    const [paymentMethod, setPaymentMethod] = useState('prepaid');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
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
                console.log(order);
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
            <div className="space-y-6 rounded-2xl border border-[#FFFFFF1A] p-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Delivery Address</h3>
                    <div className="flex items-start space-x-2">
                        <MapPin className="w-5 h-5 mt-1" />
                        <div>
                            <h4 className="font-medium">{activeAddress.addressType}</h4>
                            <p className="text-sm text-gray-400">{activeAddress.landmark}, {activeAddress.address}, {activeAddress.city}, {activeAddress.pincode}</p>
                        </div>
                    </div>
                    <button className="text-blue-500 text-sm">See more</button>
                </div>

                <div className="space-y-4 border-t border-[#32323280] pt-4">
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setPaymentMethod('prepaid')}
                            className={`w-full p-4 rounded-lg border flex items-center justify-between ${paymentMethod === 'prepaid'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <img src="/razorpay-logo.png" alt="Razorpay" className="h-6" />
                                <span>Razorpay</span>
                            </div>
                            <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                                {paymentMethod === 'prepaid' && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </div>
                        </button>

                        <button
                            onClick={() => setPaymentMethod('cod')}
                            className={`w-full p-4 rounded-lg border flex items-center justify-between ${paymentMethod === 'cod'
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700'
                                }`}
                        >
                            <span>Cash On Delivery</span>
                            <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                                {paymentMethod === 'cod' && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="space-y-4 border-t border-[#32323280] pt-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-[#808080]">Sub-total</span>
                            <span>₹{totalBasePrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#808080]">Total discount</span>
                            <span>₹{totalDiscount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#808080]">Shipping fee</span>
                            <span>₹{shippingFee}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-[#434343] text-xl">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='pt-6'>
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