"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";

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
            <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
                <p className="text-sm text-gray-500">Loading...</p>
            </main>
        );
    }

    if (user) {
        return null;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] px-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#5EAE32]">
                        <Wrench
                            className="h-9 w-9 text-white"
                            strokeWidth={2}
                        />
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Addis Repairs
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Manage your repair marketplace
                        <br />
                        from one simple dashboard.
                    </p>
                </div>

                {/* Sign in */}
                <button
                    type="button"
                    onClick={() => router.push("/auth/sign-in")}
                    className="mt-8 w-full cursor-pointer rounded-xl bg-[#5EAE32] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#4d9a26] focus:outline-none focus:ring-2 focus:ring-[#5EAE32]/40 focus:ring-offset-2"
                >
                    Sign In
                </button>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    Repair marketplace administration
                </p>
            </div>
        </main>
    );
}

export default HomePage;