"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
export default function Signin() {
    const router = useRouter();
    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            router.push("/");
        }
    }, [router]);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
                setError(data.message || 'login failed');
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-[#191919] min-h-screen relative">
            {/* Logo */}
            <div className="absolute top-8 left-8 z-10">
                <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl font-bold">ANISHOP</span>
                </div>
            </div>
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/auth-banner.png"
                    alt="signin banner"
                    fill
                    className="object-cover brightness-25 filter grayscale"
                    priority
                />
            </div>
            {/* Form Container */}
            <div className="relative z-10 min-h-screen flex justify-end items-center px-16">
                <div className="bg-[#191919] p-8 rounded-lg w-full max-w-md">
                    <h2 className="text-4xl font-bold text-white mb-1">Login to your account</h2>
                    <p className="text-[#808080] mb-6">it's great to see you again.</p>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-md font-medium text-gray-200 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full px-4 py-3 bg-[#222222] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-red-500 placeholder-[#999999]"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-md font-medium text-gray-200 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    required
                                    className="w-full px-4 py-3 bg-[#222222] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-red-500 placeholder-[#999999] pr-12"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-right mt-2 text-sm text-white hover:text-gray-300 cursor-pointer">
                                Forgot password?
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r to-[#DE370D] from-[#781E07] text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Logging in..." : "Login In"}
                        </button>
                    </form>
                    <p className="mt-6 text-left text-gray-400">
                        New User?{" "}
                        <Link
                            href="/signup"
                            className="text-blue-500 hover:text-blue-700 underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
