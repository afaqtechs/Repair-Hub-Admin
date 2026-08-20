"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    User,
    Sparkles,
    Shield,
    CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/src/api/auth.api";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            // Simulate API call - replace with actual signUp
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = await signUp(
                email,
                password,
                firstName,
                lastName
            );

            if (!data) {
                setError(
                    "Unable to create your account. Please try again."
                );
                return;
            }

            setSuccess(true);
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-8 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Heading */}
                <div className="mb-8 text-center">
                    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                        <Shield className="h-8 w-8 text-white" />
                        <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-pulse" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Create account
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Get started with RepairHub admin dashboard
                    </p>
                </div>

                {/* Card */}
                <div className="relative rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
                    {/* Decorative linear border */}
                    <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />

                    {success ? (
                        <div className="relative space-y-6 text-center">
                            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                                <CheckCircle className="h-10 w-10 text-green-400" />
                                <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    Account created!
                                </h2>

                                <p className="mt-2 text-sm text-gray-400">
                                    Your account has been created successfully.
                                    You can now sign in to your dashboard.
                                </p>
                            </div>

                            <Link
                                href="/auth/login"
                                className="inline-flex h-11 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-6 font-medium text-white shadow-lg shadow-blue-600/30 transition-all hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-600/40"
                            >
                                Go to login
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="relative space-y-5"
                        >
                            {/* Error */}
                            {error && (
                                <div className="animate-shake rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                                    {error}
                                </div>
                            )}

                            {/* Names */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                                        First name
                                    </Label>

                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                        <Input
                                            id="firstName"
                                            placeholder="Juhar"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(
                                                    e.target.value
                                                )
                                            }
                                            disabled={loading}
                                            className="h-11 border-gray-700 bg-gray-800/50 pl-10 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                                        Last name
                                    </Label>

                                    <Input
                                        id="lastName"
                                        placeholder="Endris"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                        className="h-11 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                                    Email Address
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@repairhub.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                        autoComplete="email"
                                        className="h-11 border-gray-700 bg-gray-800/50 pl-10 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                                    Password
                                </Label>

                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                    <Input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                        autoComplete="new-password"
                                        className="h-11 border-gray-700 bg-gray-800/50 pl-10 pr-12 text-gray-100 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 rounded-full bg-gray-800 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${password.length === 0 ? 'w-0' :
                                                password.length < 3 ? 'w-1/3 bg-red-500' :
                                                    password.length < 6 ? 'w-2/3 bg-yellow-500' :
                                                        'w-full bg-green-500'
                                                }`}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 min-w-15 text-right">
                                        {password.length === 0 ? 'Weak' :
                                            password.length < 3 ? 'Weak' :
                                                password.length < 6 ? 'Medium' :
                                                    'Strong'}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500">
                                    Minimum 6 characters
                                </p>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="relative h-11 w-full bg-linear-to-r from-purple-600 to-purple-700 font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-600/40 disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <>
                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-800" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-gray-900/80 px-3 text-gray-500 backdrop-blur-sm">
                                        Secure registration
                                    </span>
                                </div>
                            </div>

                            {/* Login link */}
                            <div className="text-center text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    href="/auth/sign-in"
                                    className="font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer text */}
                <p className="mt-6 text-center text-xs text-gray-600">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </main>
    );
}