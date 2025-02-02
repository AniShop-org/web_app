"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Swal from 'sweetalert2';


const validatePassword = (password) => {
    return password.length >= 6;
};

export default function Signin() {
    const email = useSearchParams().get("email");
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: email || "",
        newPassword: "",
        confirmPassword: "",
    });
    console.log(email);
    const [validations, setValidations] = useState({
        newPassword: { isValid: false, isTouched: false },
        confirmPassword: { isValid: false, isTouched: false },
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

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "https://anishop-backend-test.onrender.com/api/v1/user/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: formData.email, newPassword: formData.newPassword }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Password Reset',
                        text: 'Your password was reset successfully!',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.message || "Could not reset password. Please try again.");
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
                        Reset your password
                    </h2>
                    <p className="text-[#808080] mb-8">
                        Enter your new password to reset your account password.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-white mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className={`w-full px-4 py-3 bg-[#222222] rounded-lg text-white focus:outline-none pr-12 placeholder-[#999999]
                                        ${
                                            validations.newPassword.isTouched
                                                ? validations.newPassword.isValid
                                                    ? "border border-[#0C9409]"
                                                    : "border border-[#ED1010]"
                                                : "border border-[#222222]"
                                        }
                                    `}
                                    placeholder="Enter your password (min 6 characters)"
                                    value={formData.newPassword}
                                    onChange={(e) => {
                                        const newPassword = e.target.value;
                                        setFormData({ ...formData, newPassword });
                                        setValidations((prev) => ({
                                            ...prev,
                                            newPassword: {
                                                isTouched: true,
                                                isValid: validatePassword(newPassword),
                                            },
                                        }));
                                    }}
                                    onBlur={() =>
                                        setValidations((prev) => ({
                                            ...prev,
                                            newPassword: {
                                                ...prev.newPassword,
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
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm text-white mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className={`w-full px-4 py-3 bg-[#222222] rounded-lg text-white focus:outline-none pr-12 placeholder-[#999999]
                                        ${
                                            validations.confirmPassword.isTouched
                                                ? validations.confirmPassword.isValid
                                                    ? "border border-[#0C9409]"
                                                    : "border border-[#ED1010]"
                                                : "border border-[#222222]"
                                        }
                                    `}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                        const confirmPassword = e.target.value;
                                        setFormData({ ...formData, confirmPassword });
                                        setValidations((prev) => ({
                                            ...prev,
                                            confirmPassword: {
                                                isTouched: true,
                                                isValid: confirmPassword === formData.newPassword,
                                            },
                                        }));
                                    }}
                                    onBlur={() =>
                                        setValidations((prev) => ({
                                            ...prev,
                                            confirmPassword: {
                                                ...prev.confirmPassword,
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF3333] text-white py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}