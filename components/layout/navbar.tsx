"use client";

import {
    Bell,
    LogOut,
    Menu,
    Settings,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Profile } from "@/types/profiles";
import { signOut } from "@/api/auth.api";
import { useRouter } from "next/navigation";

interface NavbarProps {
    onToggleSidebar: () => void;
    user?: Profile;
}

export function Navbar({ onToggleSidebar, user }: NavbarProps) {
    const router = useRouter();
    const handleSignOut = async () => {
        try {
            await signOut();
            // showSuccess("Signed out", "Signed out successfully");
            router.push("/(auth)/sign-in")
        } catch (error) {
            console.log(error)
            // showError("Failed to logout")
        }
    };

    return (
        <nav className="sticky top-0 z-40 flex h-18 w-full items-center justify-between border-b border-gray-200 bg-gray-100/50 backdrop-blur px-4 lg:px-6">
            {/* Left */}
            <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <Button
                    variant="default"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" color="#102112" />
                </Button>

                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                        Admin Dashboard
                    </h1>

                    <p className="text-xs text-gray-500 sm:block">
                        RepairHub management
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <Button
                    variant="default"
                    size="icon"
                    className="relative text-gray-900 hover:text-gray-700 hover:bg-gray-200"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />

                    <span className="absolute right-1 top-0 h-2 w-2 rounded-full bg-amber-500" />
                </Button>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="default"
                                className="flex h-10 items-center gap-2 rounded-full px-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900">
                                    <User className="h-4 w-4" />
                                </div>

                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.first_name || "Administrator"}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {user?.role || "Admin"}
                                    </p>
                                </div>
                            </Button>
                        }
                    />

                    <DropdownMenuContent
                        align="end"
                        className="w-52 bg-gray-100 text-gray-900 border-none ring-0"
                    >
                        <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:text-gray-900 focus:bg-gray-200">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:text-gray-900 focus:bg-gray-200">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-gray-200" />

                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="cursor-pointer text-red-500 hover:text-white hover:bg-red-500 focus:text-white focus:bg-red-500"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}