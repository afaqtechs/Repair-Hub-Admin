"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useTechnician } from "@/hooks/useProfiles";
import { Spinner } from "../ui/loader";

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
        isLoading,
    } = useTechnician(String(user?.id));

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/auth/sign-in");
        }
    }, [user, authLoading, router]);

    if (isLoading) {
        return (
            <Spinner
                variant="success"
                size="default"
                fullScreen
                text="Loading..."
                type="spinner"
                className=""
            />
        );
    }

    if (!technician) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-400">
                Profile not found.
            </div>
        );
    }

    if (!technician || technician.role !== "admin") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                Unauthorized
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
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