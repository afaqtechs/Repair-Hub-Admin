"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    LayoutDashboard,
    Users,
    Wrench,
    Package,
    Settings,
    Tags,
    ClipboardList,
    Cog,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Profile } from "@/types/profiles";
import Image from "next/image";
import logo from "../../public/ui/logo.webp";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    user?: Profile;
}

type MenuItem = {
    title: string;
    path?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    submenu?: {
        title: string;
        path: string;
    }[];
};

const menus: MenuItem[] = [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "Users", path: "/users", icon: Users },
    { title: "Technicians", path: "/technicians", icon: Wrench },
    { title: "Parts", path: "/parts", icon: Package },
    { title: "Services", path: "/services", icon: Cog },
    { title: "Requests", path: "/requests", icon: ClipboardList },
    {
        title: "Catalog",
        icon: Tags,
        submenu: [
            { title: "Categories", path: "/categories" },
            { title: "Platforms", path: "/platforms" },
            { title: "Conditions", path: "/conditions" },
        ],
    },
    { title: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed, user }: SidebarProps) {
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    useEffect(() => {
        menus.forEach((menu, index) => {
            if (menu.submenu?.some((sub) => pathname.startsWith(sub.path))) {
                setOpenMenu(index);
            }
        });
    }, [pathname]);

    const isActive = (path?: string) => {
        if (!path) return false;
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const toggleMenu = (index: number) => {
        setOpenMenu((prev) => (prev === index ? null : index));
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-800 bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"} ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Header */}
                <div className="flex h-18 items-center justify-between border-b border-gray-800 px-4">
                    <div className="flex min-w-0 items-center gap-3">
                        {!collapsed && (
                            <>
                                <div className="relative z-10 overflow-hidden">
                                    <Image
                                        src={logo}
                                        alt="RepairHub"
                                        className="h-12 w-12 object-contain rounded-full object-left"
                                        priority
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-white">
                                        {user?.first_name || "Administrator"}
                                    </h3>
                                    <p className="truncate text-xs text-gray-400">
                                        {user?.role || "Admin"} Account
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden rounded-full p-1.5 text-gray-400 transition bg-gray-800 hover:bg-gray-900 hover:text-gray-200 lg:flex"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Search */}
                {!collapsed && (
                    <div className="border-b border-gray-800 p-4">
                        <Input
                            placeholder="Search..."
                            className="h-9 border-gray-700 bg-gray-800/50 text-gray-100 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-transparent"
                        />
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-1">
                        {menus.map((item, index) => {
                            const Icon = item.icon;

                            if (!item.submenu) {
                                return (
                                    <Link
                                        key={item.title}
                                        href={item.path!}
                                        onClick={handleLinkClick}
                                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive(item.path) ? "bg-blue-500/10 text-blue-400" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"} ${collapsed ? "justify-center" : ""}`}
                                    >
                                        {Icon && <Icon size={18} className="shrink-0" />}
                                        {!collapsed && <span>{item.title}</span>}
                                    </Link>
                                );
                            }

                            const submenuActive = item.submenu.some((sub) => isActive(sub.path));

                            return (
                                <div key={item.title}>
                                    <button
                                        type="button"
                                        aria-expanded={openMenu === index}
                                        onClick={() => toggleMenu(index)}
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${submenuActive ? "text-blue-400" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"} ${collapsed ? "justify-center" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon size={18} className="shrink-0" />}
                                            {!collapsed && <span>{item.title}</span>}
                                        </div>
                                        {!collapsed && (openMenu === index ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />)}
                                    </button>

                                    {!collapsed && openMenu === index && (
                                        <div className="ml-7 mt-1 space-y-1 border-l border-gray-800 pl-2">
                                            {item.submenu.map((sub) => (
                                                <Link
                                                    key={sub.title}
                                                    href={sub.path}
                                                    onClick={handleLinkClick}
                                                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${isActive(sub.path) ? "bg-blue-500/10 text-blue-400" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
                                                >
                                                    {sub.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-800 p-4">
                    <div className={`flex items-center text-gray-500 ${collapsed ? "justify-center" : "justify-center"}`}>
                        <span className="text-base">©</span>
                        {!collapsed && <span className="ml-2 text-xs">{new Date().getFullYear()} RepairHub</span>}
                    </div>
                </div>
            </aside>
        </>
    );
}