"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export default function ResetPasswordEmail() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
    });
    const [validations, setValidations] = useState({
        email: { isValid: false, isTouched: false },
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            router.push("/");
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();
            if (response.ok) {
                router.push(`forgot-password-verify-otp?email=${formData.email}`);
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#191919] relative">
            {/* Background Image - Now spans full width on mobile */}
            <div className="absolute inset-0 w-full h-full md:hidden">
                <Image
                    src="/auth-banner.png"
                    alt="signin banner"
                    fill
                    className="object-cover brightness-50 filter grayscale scale-125"
                    priority
                />
            </div>

            {/* Desktop Left side - Logo and Image */}
            <div className="hidden md:block md:w-1/2 relative">
                <div className="absolute top-8 left-8 z-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M16 0L29.8564 8V24L16 32L2.14355 24V8L16 0Z" fill="#FF3333" />
                        </svg>
                        <span className="text-white text-2xl font-bold tracking-wider">
                            ANISHOP
                        </span>
                    </Link>
                </div>
                <div className="absolute inset-0 left-0">
                    <Image
                        src="/auth-banner.png"
                        alt="signin banner"
                        fill
                        className="object-cover brightness-50 filter grayscale scale-125"
                        priority
                    />
                </div>
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden absolute top-8 left-8 z-10">
                <Link href="/" className="flex items-center space-x-2">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 0L29.8564 8V24L16 32L2.14355 24V8L16 0Z" fill="#FF3333" />
                    </svg>
                    <span className="text-white text-2xl font-bold tracking-wider">
                        ANISHOP
                    </span>
                </Link>
            </div>

            {/* Form Container */}
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-10">
                <div className="w-full max-w-xl p-8 flex flex-col justify-center min-h-screen md:min-h-0">
                    <h2 className="text-4xl font-bold text-white mb-1">
                        Enter your email
                    </h2>
                    <p className="text-[#808080] mb-8">
                        We will send you an OTP to verify your email
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-white mb-2">Email</label>
                            <input
                                type="email"
                                required
                                className={`w-full px-4 py-3 bg-[#222222] rounded-lg text-white focus:outline-none placeholder-[#999999]
                                    ${
                                        validations.email.isTouched
                                            ? validations.email.isValid
                                                ? "border border-[#0C9409]"
                                                : "border border-[#ED1010]"
                                            : "border border-[#222222]"
                                    }
                                `}
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={(e) => {
                                    const email = e.target.value;
                                    setFormData({ ...formData, email });
                                    setValidations((prev) => ({
                                        ...prev,
                                        email: {
                                            isTouched: true,
                                            isValid: validateEmail(email),
                                        },
                                    }));
                                }}
                                onBlur={() =>
                                    setValidations((prev) => ({
                                        ...prev,
                                        email: {
                                            ...prev.email,
                                            isTouched: true,
                                        },
                                    }))
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF3333] text-white py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}