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
                <div className="text-sm text-gray-500">
                    Loading...
                </div>
            </main>
        );
    }

    if (user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#F8F7FC] flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Welcome to Repair Hub
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Manage your repair marketplace from one place.
                    </p>
                </div>

                <button
                    onClick={() => router.push("/auth/sign-in")}
                    className="w-full rounded-xl bg-[#5B3DF5] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4c31d4]"
                >
                    Sign In
                </button>
            </div>
        </main>
    );
}

export default HomePage;