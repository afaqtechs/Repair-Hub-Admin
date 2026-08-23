"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    User,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/src/api/auth.api";
import { useRouter } from "next/navigation";
import logo from "../../../../public/ui/logo.webp";
import Styles from "@/constants/styles";

export default function SignUp() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!firstName || !lastName || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            const data = await signUp(email, password, firstName, lastName);

            if (!data) {
                setError("Unable to create your account. Please try again.");
                return;
            }

            setSuccess(true);
            // Redirect after short delay to show success message
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // Placeholder for Google sign-in
        console.log("Google sign-in clicked");
        // You can add your Google OAuth logic here later
    };

    return (
        <main className="bg-black flex h-screen overflow-hidden font-sans">
            {/* LEFT BRANDING */}
            <div className="hidden lg:flex flex-col relative w-1/2 items-center justify-center bg-cover bg-center">
                <div className="absolute inset-0 bg-black/55"></div>
                <div className="mb-10 relative z-10">
                    <Image
                        src={logo}
                        alt="RepairHub"
                        width={220}
                        height={70}
                        className="h-auto w-48 object-contain object-left"
                        priority
                    />
                </div>

                <div className="relative z-10 text-end px-10">
                    <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-100 xl:text-5xl font-serif">
                        Join{" "}
                        <span className="text-emerald-500">RepairHub.</span>
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-7 text-gray-400 font-light">
                        Create your admin account and start managing
                        technicians, services, spare parts, reviews,
                        users, and platform activity from one simple
                        administration panel.
                    </p>
                </div>
            </div>

            {/* RIGHT SIGNUP */}
            <div className="w-full lg:w-1/2 relative flex flex-col items-center px-3 lg:px-10 py-12 gap-3 bg-gray-900/50 h-screen overflow-hidden">
                {/* Background blobs */}
                <span className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -top-40 -right-40"></span>
                <span className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -bottom-40 -left-40"></span>

                <div className="flex flex-col items-center justify-center w-full gap-2 z-10">
                    <h1 className="text-2xl text-gray-100 font-serif font-semibold tracking-wide">
                        Create account
                    </h1>
                    <p className="text-base text-gray-400 font-light text-center">
                        Get started with your RepairHub admin account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-gray-900/30 px-5 lg:px-10 py-8 rounded-md max-w-md z-10">
                    {success && (
                        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400 font-medium text-center">
                            Account created successfully! Redirecting to login...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative flex items-center">
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading || success}
                                className={`${Styles.input} px-14 bg-gray-800 text-gray-100 placeholder:text-gray-500 font-light`}
                            />
                            <User className="absolute left-3 text-gray-500" size={18} />
                        </div>

                        <div className="relative flex items-center">
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading || success}
                                className={`${Styles.input} px-3 bg-gray-800 text-gray-100 placeholder:text-gray-500 font-light`}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative flex items-center">
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@repairhub.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || success}
                            autoComplete="email"
                            className={`${Styles.input} px-14 bg-gray-800 text-gray-100 placeholder:text-gray-500 font-light`}
                        />
                        <Mail className="absolute left-3 text-gray-500" size={18} />
                    </div>

                    {/* Password */}
                    <div className="relative flex items-center">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || success}
                            autoComplete="new-password"
                            className={`${Styles.input} px-14 bg-gray-800 text-gray-100 placeholder:text-gray-500 font-light`}
                        />
                        <Lock className="absolute left-3 text-gray-500" size={18} />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {/* Password strength indicator */}
                    <div className="flex items-center gap-2 -mt-1">
                        <div className="h-1 flex-1 rounded-full bg-gray-700 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${password.length === 0 ? "w-0" :
                                    password.length < 3 ? "w-1/3 bg-red-500" :
                                        password.length < 6 ? "w-2/3 bg-yellow-500" :
                                            "w-full bg-green-500"
                                    }`}
                            />
                        </div>
                        <span className="text-xs text-gray-500 min-w-12 text-right">
                            {password.length === 0 ? "Weak" :
                                password.length < 3 ? "Weak" :
                                    password.length < 6 ? "Medium" :
                                        "Strong"}
                        </span>
                    </div>

                    {/* Sign Up Button */}
                    <Button
                        type="submit"
                        disabled={loading || success}
                        className="cursor-pointer rounded-md font-medium py-2 text-white bg-emerald-500/90 hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 font-sans mt-1"
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

                    {/* Divider */}
                    <div className="relative flex items-center py-1">
                        <div className="grow border-t border-gray-700"></div>
                        <span className="shrink mx-4 text-xs text-gray-500 font-light">or</span>
                        <div className="grow border-t border-gray-700"></div>
                    </div>

                    {/* Google Sign Up Button */}
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading || success}
                        className="cursor-pointer rounded-md font-medium py-2 text-white bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border border-gray-600 font-sans"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Sign up with Google
                    </Button>

                    {/* Login link */}
                    <div className="text-center text-sm text-gray-400 mt-1">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-emerald-400 hover:text-emerald-300 transition-colors hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>

                {/* Secure access */}
                <div className="flex items-center justify-center gap-2 border-t border-gray-700 pt-5 text-xs text-gray-500 font-light">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Secure admin registration</span>
                </div>
            </div>
        </main>
    );
}