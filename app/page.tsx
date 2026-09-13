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

            {/* Subtle grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative w-full max-w-md text-center">
                {/* ── Attractive Logo / Badge ─────────────────────────── */}
                <div className="relative mx-auto mb-8 h-24 w-24">
                    {/* Outer pulsing glow ring */}
                    <span className="absolute inset-0 animate-ping rounded-[4xl] bg-[#5EAE32]/20" />

                    {/* Soft blurred glow */}
                    <span className="absolute -inset-3 rounded-[2.5rem] bg-[#5EAE32]/25 blur-2xl" />

                    {/* Gradient border wrapper */}
                    <div className="relative h-full w-full rounded-[4xl] bg-linear-to-br from-[#79e636] via-[#5EAE32] to-[#3d7a1f] p-[2px] shadow-2xl shadow-[#5EAE32]/40">
                        {/* Inner tile */}
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[calc(4xl-2px)] bg-linear-to-br from-[#5EAE32] to-[#4d9a26]">
                            {/* Sheen overlay */}
                            <span className="absolute -top-1/2 left-0 h-full w-full -translate-x-full rotate-12 bg-linear-to-r from-transparent via-white/25 to-transparent animate-[shine_3.5s_ease-in-out_infinite]" />

                            {/* Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="relative h-12 w-12 text-white drop-shadow-md"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Wrench */}
                                <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.6 2.6-1.4-1.4 2.6-2.6z" />
                                {/* Sparkle accents */}
                                <path d="M18 3v3M21 4.5l-2 2M16.5 2l1.5 1.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Floating mini badge */}
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-[#5EAE32]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                </div>
                {/* ─────────────────────────────────────────────────────── */}

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

            {/* Keyframes for the shine sweep */}
            <style jsx>{`
                @keyframes shine {
                    0% {
                        transform: translateX(-100%) rotate(12deg);
                    }
                    50%,
                    100% {
                        transform: translateX(200%) rotate(12deg);
                    }
                }
            `}</style>
        </main>
    );
}

export default HomePage;