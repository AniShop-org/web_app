"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
            const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/order/checkout/cod', {
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

    return (
        <div className="flex items-center justify-center h-screen bg-[#191919] text-white">
            <div className="bg-[#222222] p-8 rounded-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Enter 6 Digit Code</h1>
                <p className="mb-4">Enter the 6-digit code that was sent to {email}.</p>
                
                <div className="flex gap-2 mb-4">
                    {otpDigits.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            className="w-12 h-12 text-center bg-[#333333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#DE370D]"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                <button
                    className="bg-gradient-to-r from-[#781E07] to-[#DE370D] text-white px-4 py-3 rounded-md w-full mb-4"
                    onClick={handleSubmit}
                    disabled={loading || otpDigits.some(digit => !digit)}
                >
                    {loading ? 'Please wait...' : 'Continue'}
                </button>
                
                {error && <p className="text-red-500">{error}</p>}
                <p 
                    className="text-[#999999] underline cursor-pointer" 
                    onClick={() => {
                        setOtpDigits(['', '', '', '', '', '']);
                        setOTP('');
                        inputRefs[0].current.focus();
                    }}
                >
                    Resend code
                </p>
            </div>
        </div>
    );
}