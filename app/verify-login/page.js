"use client"
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function OTPVerification() {
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            router.push('/');
        }
    }, [router]);

    const params = useSearchParams();
    const email = params.get('email') || '';
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            router.push('/login');
        }
    }, [email, router]);

    if (!email) {
        return null;
    }

    const handleSubmit = async (enteredOTP) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/auth/login-verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: enteredOTP }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                router.push('/');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred while verifying OTP. Please try again later.');
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

        const newOtpString = newOtpDigits.join('');

        if (newOtpDigits.every((digit) => digit !== '')) {
            handleSubmit(newOtpString);
        }
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
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
        } catch (error) {
            setError('An error occurred while resending OTP. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#191919] relative">
            {/* Mobile Background */}
            <div className="absolute inset-0 w-full h-full md:hidden overflow-hidden">
                <Image
                    src="/auth-banner.png"
                    alt="verify banner"
                    fill
                    className="object-cover brightness-50 filter grayscale scale-125"
                    priority
                />
            </div>

            {/* Desktop Left Side */}
            <div className="hidden md:block md:w-1/2 relative">
                <div className="flex items-center space-x-4 pl-3 absolute top-6 left-6 z-10">
                    <a
                        href="/"
                        className="flex items-center hover:opacity-90 transition-opacity"
                    >
                        <img src={"/logo.png"} alt="logo" className="h-6 w-6 lg:w-10 lg:h-10" />
                        <div className="text-white lg:text-3xl text-2xl font-extrabold tracking-wider pl-1">
                            AniShop
                        </div>
                    </a>
                </div>
                <div className="absolute inset-0">
                    <Image
                        src="/auth-banner.png"
                        alt="verify banner"
                        fill
                        className="object-cover brightness-50 filter grayscale scale-125"
                        priority
                    />
                </div>
            </div>

            {/* Mobile Logo */}
            <div className="flex items-center space-x-4 pl-3 md:hidden absolute top-6 left-6 z-10 overflow-hidden">
                <a
                    href="/"
                    className="flex items-center hover:opacity-90 transition-opacity"
                >
                    <img src={"/logo.png"} alt="logo" className="h-6 w-6 lg:w-10 lg:h-10" />
                    <div className="text-white lg:text-3xl text-2xl font-extrabold tracking-wider pl-1">
                        AniShop
                    </div>
                </a>
            </div>

            {/* Form Container */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-10">
                <div className="w-full max-w-xl p-8 flex flex-col justify-center min-h-screen md:min-h-0 border border-[#222222] rounded-2xl">
                    <h2 className="sm:text-4xl text-2xl font-bold text-white mb-1">
                        Verify your email
                    </h2>
                    <p className="text-[#808080] mb-8 text-sm sm:text-base">
                        Enter the 6-digit code that was sent to {email}
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
                                className="sm:w-14 sm:h-14 h-12 w-12 text-center bg-[#222222] text-white rounded-lg border border-[#222222] focus:outline-none focus:border-[#FF3333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                        {loading ? "Please wait..." : "Verify Email"}
                    </button>

                    <button
                        className="mt-4 text-[#808080] hover:text-white text-sm flex justify-start underline"
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}
