"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/src/context/AuthContext";
import { useTechnician } from "@/src/hooks/useProfiles";

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({
    children,
}: DashboardShellProps) {
    const router = useRouter();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const { user, loading: authLoading } = useAuth();

    const {
        data: technician,
        isLoading: technicianLoading,
    } = useTechnician(String(user?.id));

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/auth/sign-in");
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-400">
                Loading...
            </div>
        );
    }

    if (technicianLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-400">
                Loading dashboard...
            </div>
        );
    }

    if (!technician) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-400">
                Profile not found.
            </div>
        );
    }

    if (technician.role !== "admin") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                Unauthorized
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                user={technician}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`
                    min-h-screen
                    transition-[margin]
                    duration-300
                    ease-in-out
                    ${collapsed ? "lg:ml-20" : "lg:ml-64"}
                `}
            >
                <Navbar
                    user={technician}
                    onToggleSidebar={() => setSidebarOpen(true)}
                />

                <main className="p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}