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

const validatePassword = (password) => {
    return password.length >= 6;
};

export default function Signin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [validations, setValidations] = useState({
        email: { isValid: false, isTouched: false },
        password: { isValid: false, isTouched: false },
    });
    const [showPassword, setShowPassword] = useState(false);
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
                "https://anishop-backend-test.onrender.com/api/v1/user/auth/login",
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
                router.push(`verify-login?email=${formData.email}`);
            } else {
                setError(data.message || "login failed");
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
            <div className="absolute inset-0 w-full h-full md:hidden overflow-hidden">
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
                <div className="absolute inset-0 left-0 overflow-hidden">
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
            <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 overflow-hidden">
                <div className="w-full max-w-xl p-8 flex flex-col justify-center min-h-screen md:min-h-0">
                    <h2 className="sm:text-4xl text-2xl font-bold text-white mb-1">
                        Login to your account
                    </h2>
                    <p className="text-[#808080] mb-8 text-sm sm:text-base">
                        It's great to see you again.
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-white mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className={`w-full px-4 py-3 bg-[#222222] rounded-lg text-white focus:outline-none pr-12 placeholder-[#999999]
                                        ${
                                            validations.password.isTouched
                                                ? validations.password.isValid
                                                    ? "border border-[#0C9409]"
                                                    : "border border-[#ED1010]"
                                                : "border border-[#222222]"
                                        }
                                    `}
                                    placeholder="Enter your password (min 6 characters)"
                                    value={formData.password}
                                    onChange={(e) => {
                                        const password = e.target.value;
                                        setFormData({ ...formData, password });
                                        setValidations((prev) => ({
                                            ...prev,
                                            password: {
                                                isTouched: true,
                                                isValid: validatePassword(password),
                                            },
                                        }));
                                    }}
                                    onBlur={() =>
                                        setValidations((prev) => ({
                                            ...prev,
                                            password: {
                                                ...prev.password,
                                                isTouched: true,
                                            },
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#808080] hover:text-white"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF3333] text-white py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : "Log In"}
                        </button>
                    </form>

                    <p className="mt-6 text-[#808080] text-sm">
                        New User?{" "}
                        <Link href="/signup" className="text-[#FF3333] hover:text-[#E62E2E] underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}