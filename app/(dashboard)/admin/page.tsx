"use client";
import {
    Users,
    Wrench,
    Package,
    Cog,
    ClipboardList,
    ShieldCheck,
    Star,
    Search,
    Filter,
    Download,
} from "lucide-react";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";

// ============================================================
// Types
// ============================================================

type RecentActivity = {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    status: "completed" | "pending" | "in-progress";
};

// ============================================================
// Mock Data
// ============================================================

const recentActivities: RecentActivity[] = [
    {
        id: "1",
        user: "John Doe",
        action: "New user registered",
        timestamp: "2 minutes ago",
        status: "completed",
    },
    {
        id: "2",
        user: "Sarah Smith",
        action: "New technician added",
        timestamp: "15 minutes ago",
        status: "completed",
    },
    {
        id: "3",
        user: "Mike Johnson",
        action: "New service request",
        timestamp: "1 hour ago",
        status: "pending",
    },
    {
        id: "4",
        user: "Emily Brown",
        action: "Spare part restocked",
        timestamp: "2 hours ago",
        status: "completed",
    },
    {
        id: "5",
        user: "David Wilson",
        action: "Service completed",
        timestamp: "3 hours ago",
        status: "in-progress",
    },
    {
        id: "6",
        user: "Lisa Anderson",
        action: "New review posted",
        timestamp: "4 hours ago",
        status: "completed",
    },
    {
        id: "7",
        user: "Robert Taylor",
        action: "Payment processed",
        timestamp: "5 hours ago",
        status: "completed",
    },
    {
        id: "8",
        user: "Maria Garcia",
        action: "Technician assigned",
        timestamp: "6 hours ago",
        status: "in-progress",
    },
];

export default function DashboardPage() {


    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    Welcome to the addis aepairs admin dashboard.
                </p>
            </div>

            {/* ==================================================
                Stats Grid
            ================================================== */}

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Total Users */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Users
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                1,284
                            </p>
                        </div>

                        <div className="rounded-full bg-blue-50 p-3">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 12%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Technicians */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Technicians
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                342
                            </p>
                        </div>

                        <div className="rounded-full bg-emerald-50 p-3">
                            <Wrench className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 8%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Spare Parts */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Spare Parts
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                5,671
                            </p>
                        </div>

                        <div className="rounded-full bg-purple-50 p-3">
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 23%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Services */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Services
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                89
                            </p>
                        </div>

                        <div className="rounded-full bg-orange-50 p-3">
                            <Cog className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 5%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Service Requests */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Service Requests
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                1,847
                            </p>
                        </div>

                        <div className="rounded-full bg-yellow-50 p-3">
                            <ClipboardList className="h-5 w-5 text-yellow-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-red-600">
                            ↓ 3%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Verified Users */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Verified Users
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                892
                            </p>
                        </div>

                        <div className="rounded-full bg-green-50 p-3">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 18%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Total Feedback */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Feedback
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                1,203
                            </p>
                        </div>

                        <div className="rounded-full bg-pink-50 p-3">
                            <Star className="h-5 w-5 text-pink-600" />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 15%
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>

                {/* Average Rating */}

                <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Average Rating
                            </p>

                            <p className="text-2xl font-bold text-gray-900">
                                4.8
                            </p>
                        </div>

                        <div className="rounded-full bg-indigo-50 p-3">
                            <Star
                                className="h-5 w-5 text-indigo-600"
                                fill="currentColor"
                            />
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs">
                        <span className="text-green-600">
                            ↑ 0.2
                        </span>

                        <span className="text-gray-500">
                            from last month
                        </span>
                    </div>
                </div>
            </div>

            {/* ==================================================
                Additional Information
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* ==================================================
                    Quick Stats
                ================================================== */}

                <div className="rounded-lg bg-card p-6">
                    <h2 className="text-sm font-semibold text-gray-900">
                        Quick Stats
                    </h2>

                    <div className="mt-4 space-y-4">
                        {/* Pending Requests */}

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Pending Requests
                                </span>

                                <span className="text-sm font-semibold text-yellow-600">
                                    23
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div className="h-2 w-1/4 rounded-full bg-yellow-500" />
                            </div>
                        </div>

                        {/* In Progress */}

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    In Progress
                                </span>

                                <span className="text-sm font-semibold text-blue-600">
                                    45
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div className="h-2 w-1/2 rounded-full bg-blue-500" />
                            </div>
                        </div>

                        {/* Completed */}

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Completed
                                </span>

                                <span className="text-sm font-semibold text-green-600">
                                    1,779
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div className="h-2 w-3/4 rounded-full bg-green-500" />
                            </div>
                        </div>

                        {/* Revenue */}

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Total Revenue
                                </span>

                                <span className="text-sm font-semibold text-emerald-600">
                                    $84,293
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div className="h-2 w-2/3 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    Recent Activity
                ================================================== */}


                {/* Recent Activity */}

                <div className="rounded-lg bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Recent Activity
                        </h2>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Download activities"
                                className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            >
                                <Download className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                aria-label="Filter activities"
                                className="rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                            >
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search activities..."
                            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={recentActivities}
                    />
                </div>
            </div>
        </div>
    );
}