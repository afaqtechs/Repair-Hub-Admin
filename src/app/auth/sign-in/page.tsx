"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/src/api/auth.api";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await signIn(email, password);
            if (!data?.user) {
                setError("Invalid email or password.");
                return;
            }

            console.log(data)

            router.push("/")
        } catch (error) {
            setError("Something went wrong. Please try again.");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex h-screen items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4 overflow-hidden">
            <div className="relative w-full max-w-md">
                {/* Logo / heading */}
                <div className="mb-8 text-center">
                    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                        <Shield className="h-8 w-8 text-white" />
                        <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400 animate-pulse" />
                    </div>
                </div>

                {/* Card */}
                <div className="relative rounded-2xl  bg-gray-900/80 p-8 ">
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
                                    placeholder="admin@repairhub.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="email"
                                    className="h-11 border-gray-700 bg-gray-800/50 pl-10 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                                    Password
                                </Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                                <Input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="current-password"
                                    className="h-11 border-gray-700 bg-gray-800/50 pl-10 pr-12 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/30"
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
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="relative h-11 w-full bg-gray-800 text-white cursor-pointer font-semibold transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-gray-900/80 px-3 text-gray-500 backdrop-blur-sm">
                                Secure access
                            </span>
                        </div>
                    </div>

                    {/* Signup */}
                    <div className="text-center text-sm text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/sign-up"
                            className="cursor-pointer font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                        >
                            Create one now
                        </Link>
                    </div>
                </div>

                {/* Footer text */}
                <p className="mt-6 text-center text-xs text-gray-600">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </main>
    );
}