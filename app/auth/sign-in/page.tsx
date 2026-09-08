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
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import logo from "../../../public/ui/logo.webp";
import Styles from "@/constants/styles";

export default function Login() {
    const router = useRouter();

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
            router.push("/admin");
        } catch (error) {
            console.log(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-black flex h-screen overflow-hidden font-sans">
            {/* LEFT BRANDING */}
            <div
                className="hidden lg:flex flex-col relative w-1/2 items-center justify-center bg-cover bg-center"
            >
                <div className="absolute inset-0 bg-black/55"></div>
                <div className="mb-10 relative z-10 overflow-hidden">
                    <Image
                        src={logo}
                        alt="RepairHub"
                        width={220}
                        height={70}
                        className="h-48 w-48 object-contain rounded-full object-left"
                        priority
                    />
                </div>

                <div className="relative z-10 text-end px-10">
                    <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-100 xl:text-5xl font-serif">
                        Everything you need to manage{" "}
                        <span className="text-emerald-500">RepairHub.</span>
                    </h1>

                    <p className="mt-6 max-w-lg text-base leading-7 text-gray-400 font-light">
                        Manage technicians, services, spare parts,
                        reviews, users, and platform activity from one
                        simple administration panel.
                    </p>
                </div>
            </div>

            {/* RIGHT LOGIN */}
            <div className="w-full lg:w-1/2 relative flex flex-col items-center px-3 lg:px-10 py-12 gap-3 bg-gray-900/50 h-screen overflow-hidden">
                {/* Background blobs */}
                <span className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -top-40 -right-40"></span>
                <span className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -bottom-40 -left-40"></span>

                <div className="flex flex-col items-center justify-center w-full gap-2 z-10">
                    <h1 className="text-2xl text-gray-100 font-serif font-semibold tracking-wide">
                        Welcome back
                    </h1>
                    <p className="text-base text-gray-400 font-light text-center">
                        Sign in to your RepairHub admin account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 bg-gray-900/30 px-5 lg:px-10 py-10 rounded-md max-w-md z-10">

                    {error && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="relative flex items-center">
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@repairhub.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            autoComplete="current-password"
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

                    {/* Forgot password link */}
                    <div className="flex justify-end -mt-2">
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-gray-400 hover:text-emerald-400 transition-colors font-light"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer rounded-md font-medium py-2 text-white bg-emerald-500/90 hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 font-sans"
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

                {/* Secure access */}
                <div className="flex items-center justify-center gap-2 border-t border-gray-700 pt-5 text-xs text-gray-500 font-light">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Secure admin access</span>
                </div>
            </div>
        </main>
    );
}