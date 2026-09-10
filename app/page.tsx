"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function HomePage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/admin");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#F8F7FC]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5EAE32] border-t-transparent" />
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </main>
        );
    }

    if (user) {
        return null;
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#F8F7FC] via-white to-[#EAF6E2] flex items-center justify-center px-6">
            {/* Decorative blurred blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#5EAE32]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#5EAE32]/10 blur-3xl" />

            <div className="relative w-full max-w-md text-center">
                {/* Logo / Badge */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5EAE32] shadow-lg shadow-[#5EAE32]/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5a3 3 0 100 6 3 3 0 000-6zM5 19a6 6 0 0112 0M19 8l-3 3m0 0l-3-3m3 3V3"
                        />
                    </svg>
                </div>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Welcome to{" "}
                        <span className="bg-linear-to-r from-[#5EAE32] to-[#79e636] bg-clip-text text-transparent">
                            Addis Repairs
                        </span>
                    </h1>

                    <p className="mt-4 text-base text-gray-500 leading-relaxed">
                        Manage your repair marketplace from one place.
                    </p>
                </div>

                <button
                    onClick={() => router.push("/auth/sign-in")}
                    className="group cursor-pointer w-full rounded-xl bg-[#5EAE32] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#5EAE32]/25 transition-all duration-200 hover:bg-[#4d9a26] hover:shadow-lg hover:shadow-[#5EAE32]/40 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#5EAE32]/50 focus:ring-offset-2"
                >
                    <span className="inline-flex items-center justify-center gap-2">
                        Sign In
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </span>
                </button>

                <p className="mt-6 text-xs text-gray-400">
                    Trusted by repair shops across Addis Ababa
                </p>
            </div>
        </main>
    );
}

export default HomePage;