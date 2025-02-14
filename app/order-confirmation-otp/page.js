"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../componenets/footer';
import { TopBar } from '../componenets/topbar';

export default function ConfrimOrderOtp() {
    const router = useRouter();
    const params = useSearchParams();
    const email = params.get('email') || '';
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOTP] = useState('')

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/order/checkout/cod`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authToken'),
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
            } else {
                router.push('/order-success');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }

        setOTP(newOtpDigits.join(''));
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleResendOtp = async () => {
        setOtpDigits(['', '', '', '', '', '']);
        inputRefs[0].current.focus();

        try {
            setLoading(true);
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/order/checkout/cod-verify-otp/resend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authToken'),
                 },
                body: JSON.stringify({ email }),
            });
        } catch (error) {
            setError('An error occurred while resending OTP. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#191919] sm:pt-28 pt-20">
            <div>
                <TopBar />
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center content-center">
                <div className="p-8 rounded-3xl max-w-xl w-full border border-[#FFFFFF1A]">
                    <h2 className="sm:text-3xl text-xl font-bold text-white mb-1">
                        Enter confirmation code
                    </h2>
                    <p className="text-[#808080] mb-8">
                        Enter the 6-digit code that you received on your email.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2 mb-6 justify-center">
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="number"
                                className="sm:w-14 sm:h-14 w-11 h-11 text-center bg-[#222222] text-white rounded-lg border border-[#222222] focus:outline-none focus:border-[#FF3333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => handleSubmit(otpDigits.join(''))}
                        disabled={loading || otpDigits.some((digit) => !digit)}
                        className="w-full bg-[#FF3333] text-white py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:cursor-not-allowed"
                    >
                        {loading ? "Please wait..." : "Verify order"}
                    </button>

                    <button
                        className="mt-4 text-[#808080] hover:text-white text-sm flex justify-start underline"
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
}