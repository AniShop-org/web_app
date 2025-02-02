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
            const response = await fetch('https://anishop-backend-test.onrender.com/api/v1/user/auth/reset-password-verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: enteredOTP }),
            });

            const data = await response.json();
            if (response.ok) {
                router.push(`/reset-password?email=${email}`);
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
            await fetch('https://anishop-backend-test.onrender.com/api/v1/user/auth/forgot-password-resend-otp', {
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
            <div className="absolute inset-0 w-full h-full md:hidden">
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
                <div className="absolute top-8 left-8 z-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 0L29.8564 8V24L16 32L2.14355 24V8L16 0Z" fill="#FF3333" />
                        </svg>
                        <span className="text-white text-2xl font-bold tracking-wider">
                            ANISHOP
                        </span>
                    </Link>
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
            <div className="md:hidden absolute top-8 left-8 z-10">
                <Link href="/" className="flex items-center space-x-2">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 0L29.8564 8V24L16 32L2.14355 24V8L16 0Z" fill="#FF3333" />
                    </svg>
                    <span className="text-white text-2xl font-bold tracking-wider">
                        ANISHOP
                    </span>
                </Link>
            </div>

            {/* Form Container */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-10">
                <div className="w-full max-w-xl p-8 flex flex-col justify-center min-h-screen md:min-h-0 border border-[#222222] rounded-2xl">
                    <h2 className="text-4xl font-bold text-white mb-1">
                        Verify your email
                    </h2>
                    <p className="text-[#808080] mb-8">
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
                                type="text"
                                className="w-14 h-14 text-center bg-[#222222] text-white rounded-lg border border-[#222222] focus:outline-none focus:border-[#FF3333]"
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
