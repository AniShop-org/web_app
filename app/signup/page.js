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

const getPasswordStrength = (password) => {
  if (!password) return "";
  if (password.length < 6) return "Too short";

  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
      return "Weak";
    case 1:
      return "Moderate";
    case 2:
      return "Strong";
    default:
      return "Very Strong";
  }
};
export default function Signup() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            router.push("/");
        }
    }, [router]);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [validations, setValidations] = useState({
        username: { isValid: false, isTouched: false },
        email: { isValid: false, isTouched: false },
        password: { isValid: false, isTouched: false },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState("");
    
    const handlePasswordChange = (value) => {
        setFormData((prev) => ({ ...prev, password: value }));
        setPasswordStrength(getPasswordStrength(value));
        setValidations((prev) => ({
        ...prev,
        password: { ...prev.password, isValid: validatePassword(value) },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};

        if (!validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (formData.password.length < 6) {
            errors.password = "Please enter a password with a minimum of 6 characters.";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        setLoading(true);

        try {
            const response = await fetch(
                "https://anishop-backend-test.onrender.com/api/v1/user/auth/signup",
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
                router.push(`/verify-signup?email=${formData.email}`);
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#191919] relative">
            <div className="absolute inset-0 w-full h-full md:hidden">
                <Image
                    src="/auth-banner.png"
                    alt="signup banner"
                    fill
                    className="object-cover brightness-50 filter grayscale scale-125"
                    priority
                />
            </div>

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
                <div className="absolute inset-0">
                    <Image
                        src="/auth-banner.png"
                        alt="signup banner"
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
                <div className="w-full max-w-xl p-8 flex flex-col min-h-screen md:min-h-0">
                    <h2 className="text-4xl font-bold text-white mb-1">Create an Account</h2>
                    <p className="text-[#808080] mb-6">Let's create your account</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 w-full">
                        {/* Username */}
                        <div>
                            <label className="block text-md font-medium text-gray-200 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#222222] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#FF3333] placeholder-[#999999]"
                                placeholder="Enter your full name"
                                value={formData.username}
                                onChange={(e) => {
                                    setFormData({ ...formData, username: e.target.value });
                                    setValidations((prev) => ({
                                        ...prev,
                                        username: {
                                            ...prev.username,
                                            isTouched: true,
                                            isValid: e.target.value.trim().length > 0,
                                        },
                                    }));
                                }}
                                onBlur={() =>
                                    setValidations((prev) => ({
                                        ...prev,
                                        username: {
                                            ...prev.username,
                                            isTouched: true,
                                        },
                                    }))
                                }
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-md font-medium text-gray-200 mb-2">
                                Email
                            </label>
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
                            {formErrors.email && (
                                <p className="text-red-500 text-sm">{formErrors.email}</p>
                            )}

                        {/* Password */}
                        <div>
                            <label className="block text-md font-medium text-gray-200 mb-2">
                                Password
                            </label>
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
                                    placeholder="Create a password (min 6 characters)"
                                    value={formData.password}
                                    onChange={(e) => {
                                        handlePasswordChange(e.target.value);
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.password && (
                                <p className="text-xs mt-1 text-gray-400">
                                    Password Strength: <span className="font-semibold">{passwordStrength}</span>
                                    <p className="text-red-500 text-sm">{formErrors.password}</p>
                                </p>
                            )}
                        </div>

                        <p className="text-[#808080] text-sm">
                            By signing up, you agree to our Terms, Privacy Policy, and Cookie Use
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#FF3333] text-white py-3 rounded-lg hover:bg-[#E62E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? "Please wait..." : "Create an Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-[#808080] text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#FF3333] hover:text-[#E62E2E] underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}