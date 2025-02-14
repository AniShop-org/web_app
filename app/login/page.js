"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";

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
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/auth/login`,
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

    const logInWithGoogle = useGoogleLogin({
        scope: 'openid email profile',
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true)
                const userInfo = await fetch(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            'Authorization': `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const userData = await userInfo.json();

                const googleUser = {
                    email: userData.email,
                    username: userData.name,
                    profilePhoto: userData.picture,
                };
               // Call your backend API with the user data
                try {
                    
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/auth/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: googleUser.email,
                                method: "google"
                            }),
                        }
                    );

                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem('authToken', data.token);
                        setTimeout(() => {
                            Swal.fire({
                                title: 'Login Successful',
                                text: 'You have successfully logged in',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            router.push('/');
                        
                        }, 2000)
                    } else {
                        setError(data.message || "Signup failed");
                    }
                } catch (err) {
                    setError("Something went wrong. Please try again.");
                } finally {
                    setLoading(false);
                }

            } catch (error) {
                console.error('Error fetching user info:', error);
                setError('Failed to get user information');
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            setError('Google login failed');
        }
    });

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
                    <div className="flex justify-center">
                        <button className="bg-white text-black rounded-lg p-2.5 px-20 md:px-28 flex" onClick={logInWithGoogle}>
                            <div className="pr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google">
                                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                </svg>
                            </div>
                            Login with Google</button>
                    </div>
                    <div className="flex items-center justify-center mb-6 mt-1 sm:gap-1.5 gap-1">
                        <div className=" h-0.5 w-full bg-[#999999]" /> or <div className=" h-0.5 w-full bg-[#999999]" />
                    </div>
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