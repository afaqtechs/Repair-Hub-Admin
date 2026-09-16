"use client";
import {
    Check,
    X,
} from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";
import { useAnnouncements, useFeedbacks, useParts, useRequests, useServices, useTechnicians } from "@/hooks";
import { Spinner } from "@/components/ui/loader";
import { PageHeader } from "@/components/ui/page-header";
import { Profile } from "@/types/profiles";

// ============================================================
// Types
// ============================================================

type RecentActivity = {
    id: string;
    user: Profile | string;
    action: string;
    timestamp: string;
    status: "completed" | "pending" | "in-progress";
    createdAt: string;
};
export default function DashboardPage() {

    const { data: parts, isLoading: loadingParts } = useParts();
    const { data: requests, isLoading: loadingrequests } = useRequests();
    const { data: services, isLoading: loadingservices } = useServices();
    const { data: users, isLoading: loadingtechnicians } = useTechnicians();
    const { data: feedbacks, isLoading: loadingFeedbacks } = useFeedbacks();
    const { data: announcements, isLoading: loadingAnnouncements } = useAnnouncements();

    const technicians = users?.filter((tech) => tech.role === "technician");
    const verifiedTechnicians = technicians?.filter((tech) => tech?.verification_status === "verified")

    const now = new Date();
    const twentyFourHoursAgo = new Date(
        now.getTime() - 24 * 60 * 60 * 1000
    );

    const usedParts = parts?.data.filter(
        (part) => part.condition === "used"
    );
    const newParts = parts?.data.filter(
        (part) => part.condition === "new"
    );
    const approvedUsedParts = usedParts?.filter(
        (part) => part.is_approved === true
    );

    const rejectedUsedParts = usedParts?.filter(
        (part) => part.is_approved === false
    );

    const approvedNewParts = newParts?.filter(
        (part) => part.is_approved === true
    );

    const rejectedNewParts = newParts?.filter(
        (part) => part.is_approved === false
    );

    const approvedServicess = services?.data.filter(
        (service) => service.is_approved === true
    );

    const rejectedServicess = services?.data.filter(
        (service) => service.is_approved === false
    );

    const approvedRequests = requests?.data.filter(
        (request) => request.is_approved === true
    );

    const rejectedRequests = requests?.data.filter(
        (request) => request.is_approved === false
    );

    const activeUsers = technicians?.filter(
        (tech) => tech.is_active === true
    );

    const inActieUsers = technicians?.filter(
        (tech) => tech.is_active === false
    );

    const pendingApprovals =
        (parts?.data.filter((part) => part.is_approved === false).length ?? 0) +
        (services?.data.filter((service) => service.is_approved === false).length ?? 0) +
        (requests?.data.filter((request) => request.is_approved === false).length ?? 0);

    const totalListings =
        (parts?.data.length ?? 0) +
        (services?.data.length ?? 0);

    const activeTechnicians = activeUsers?.length ?? 0;

    const totalFeedback = feedbacks?.length ?? 0;

    const formatRelativeTime = (dateString: string) => {
        const diff = new Date().getTime() - new Date(dateString).getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min ago`;
        return `${hours} hr ago`;
    };

    const recentActivities: RecentActivity[] = [
        ...(users ?? [])
            .filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at) >= twentyFourHoursAgo
            )
            .map((item) => ({
                id: `user-${item.id}`,
                user:
                    `${item.first_name ?? ""} ${item.last_name ?? ""
                        }`.trim() || "Unknown user",
                action:
                    item.role === "technician"
                        ? "New technician registered"
                        : "New user registered",
                timestamp: formatRelativeTime(item.created_at!),
                status: "completed" as const,
                createdAt: item.created_at!,
            })),

        ...(parts?.data ?? [])
            .filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at) >= twentyFourHoursAgo
            )
            .map((item) => ({
                id: `part-${item.id}`,
                user: item.technician?.first_name || "Unknown user",
                action: "New spare part registered",
                timestamp: formatRelativeTime(item.created_at!),
                status: item.is_approved
                    ? ("completed" as const)
                    : ("pending" as const),
                createdAt: item.created_at!,
            })),

        ...(services?.data ?? [])
            .filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at) >= twentyFourHoursAgo
            )
            .map((item) => ({
                id: `service-${item.id}`,
                user: item.technician?.first_name || "Unknown user",
                action: "New service registered",
                timestamp: formatRelativeTime(item.created_at!),
                status: item.is_approved
                    ? ("completed" as const)
                    : ("pending" as const),
                createdAt: item.created_at!,
            })),

        ...(requests?.data ?? [])
            .filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at) >= twentyFourHoursAgo
            )
            .map((item) => ({
                id: `request-${item.id}`,
                user: item.technician?.first_name || "Unknown user",
                action: "New service request",
                timestamp: formatRelativeTime(item.created_at!),
                status: item.is_approved
                    ? ("completed" as const)
                    : ("pending" as const),
                createdAt: item.created_at!,
            })),

        ...(feedbacks ?? [])
            .filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at) >= twentyFourHoursAgo
            )
            .map((item) => ({
                id: `feedback-${item.id}`,
                user: item.technician?.first_name || "Unknown user",
                action: "New feedback submitted",
                timestamp: formatRelativeTime(item.created_at!),
                status: "completed" as const,
                createdAt: item.created_at!,
            })),

        ...(announcements ?? [])
            .filter(
                (item) =>
                    item.created_at &&
                    new Date(item.created_at) >= twentyFourHoursAgo
            )
            .map((item) => ({
                id: `announcement-${item.id}`,
                user: "Admin",
                action: "New announcement published",
                timestamp: formatRelativeTime(item.created_at!),
                status: "completed" as const,
                createdAt: item.created_at!,
            })),
    ].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    const loading = loadingParts || loadingAnnouncements || loadingFeedbacks || loadingrequests || loadingservices || loadingtechnicians;

    return (
        <div className="space-y-6">

            <PageHeader
                title="Dashboard"
                description="Welcome to the addis aepairs admin dashboard."
            />

            {/* ==================================================
                Stats Grid
            ================================================== */}

            {loading ? (
                <Spinner
                    variant="success"
                    size="default"
                    text="Loading..."
                    type="loader"
                    className=""
                />
            ) : (

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Total Users */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Technicians
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {technicians?.length}
                                </p>
                            </div>


                            {/* Status */}
                            <div className="mt-4 flex items-center gap-4 bg-green-50 px-2 py-1 rounded-full">
                                <div className="flex items-center gap-1">
                                    <Check
                                        size={12}
                                        className="text-green-600"
                                        strokeWidth={2.5}
                                    />

                                    <span className="text-[9px] font-medium text-green-600">
                                        Active ({activeUsers?.length ?? 0})
                                    </span>
                                </div>

                                {inActieUsers?.length !== 0 && (
                                    <div className="flex items-center gap-1">
                                        <X
                                            size={12}
                                            className="text-red-600"
                                            strokeWidth={2.5}
                                        />

                                        <span className="text-[9px] font-medium text-red-600">
                                            In active ({inActieUsers?.length ?? 0})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* used Parts */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        {/* Main metric */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Used Parts
                                </p>

                                <p className="mt-1 text-2xl font-bold text-foreground">
                                    {usedParts?.length ?? 0}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center gap-4 bg-green-50 px-2 py-1 rounded-full">
                                <div className="flex items-center gap-1">
                                    <Check
                                        size={12}
                                        className="text-green-600"
                                        strokeWidth={2.5}
                                    />

                                    <span className="text-[9px] font-medium text-green-600">
                                        Approved ({approvedUsedParts?.length ?? 0})
                                    </span>
                                </div>

                                {rejectedUsedParts?.length !== 0 && (
                                    <div className="flex items-center gap-1">
                                        <X
                                            size={12}
                                            className="text-red-600"
                                            strokeWidth={2.5}
                                        />

                                        <span className="text-[9px] font-medium text-red-600">
                                            Rejected ({rejectedUsedParts?.length ?? 0})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* new Parts */}
                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    New Parts
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {newParts?.length}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mt-4 flex items-center gap-4 bg-green-50 px-2 py-1 rounded-full">
                                <div className="flex items-center gap-1">
                                    <Check
                                        size={12}
                                        className="text-green-600"
                                        strokeWidth={2.5}
                                    />

                                    <span className="text-[9px] font-medium text-green-600">
                                        Approved ({approvedNewParts?.length ?? 0})
                                    </span>
                                </div>

                                {rejectedNewParts?.length !== 0 && (
                                    <div className="flex items-center gap-1">
                                        <X
                                            size={12}
                                            className="text-red-600"
                                            strokeWidth={2.5}
                                        />

                                        <span className="text-[9px] font-medium text-red-600">
                                            Rejected ({rejectedNewParts?.length ?? 0})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Services */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Services
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {services?.data.length}
                                </p>

                            </div>

                            {/* Status */}
                            <div className="mt-4 flex items-center gap-4 bg-green-50 px-2 py-1 rounded-full">
                                <div className="flex items-center gap-1">
                                    <Check
                                        size={12}
                                        className="text-green-600"
                                        strokeWidth={2.5}
                                    />

                                    <span className="text-[9px] font-medium text-green-600">
                                        Approved ({approvedServicess?.length ?? 0})
                                    </span>
                                </div>

                                {rejectedServicess?.length !== 0 && (
                                    <div className="flex items-center gap-1">
                                        <X
                                            size={12}
                                            className="text-red-600"
                                            strokeWidth={2.5}
                                        />

                                        <span className="text-[9px] font-medium text-red-600">
                                            Rejected ({rejectedServicess?.length ?? 0})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Service Requests */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Requests
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {requests?.data.length}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mt-4 flex items-center gap-4 bg-green-50 px-2 py-1 rounded-full">
                                <div className="flex items-center gap-1">
                                    <Check
                                        size={12}
                                        className="text-green-600"
                                        strokeWidth={2.5}
                                    />

                                    <span className="text-[9px] font-light text-green-600">
                                        Approved ({approvedRequests?.length ?? 0})
                                    </span>
                                </div>

                                {rejectedRequests?.length !== 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50">
                                            <X
                                                size={12}
                                                className="text-red-600"
                                                strokeWidth={2.5}
                                            />
                                        </div>

                                        <span className="text-[9px] font-medium text-red-600">
                                            Rejected ({rejectedRequests?.length ?? 0})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Verified Users */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Verified Users
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {verifiedTechnicians?.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Feedback */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Total Feedback
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {feedbacks?.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Feedback */}

                    <div className="rounded-lg bg-card p-6 transition-shadow hover:shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-light text-gray-500">
                                    Total Announcements
                                </p>

                                <p className="text-2xl font-bold text-gray-900">
                                    {announcements?.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            )
            }
            {/* ==================================================
                Additional Information
            ================================================== */}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* ==================================================
                    Quick Stats
                ================================================== */}

                <div className="h-max rounded-lg bg-card p-6">
                    <h2 className="text-sm font-semibold text-gray-900">
                        Quick Stats
                    </h2>

                    <div className="mt-5 space-y-5">

                        {/* Pending Approvals */}
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Pending Approvals
                                </span>

                                <span className="text-sm font-semibold text-yellow-600">
                                    {pendingApprovals}
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-yellow-500"
                                    style={{
                                        width: `${Math.min(
                                            pendingApprovals * 10,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Active Technicians */}
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Active Technicians
                                </span>

                                <span className="text-sm font-semibold text-green-600">
                                    {activeTechnicians}
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-green-500"
                                    style={{
                                        width: `${technicians?.length
                                            ? Math.min(
                                                (activeTechnicians /
                                                    technicians.length) *
                                                100,
                                                100
                                            )
                                            : 0
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Total Listings */}
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Total Listings
                                </span>

                                <span className="text-sm font-semibold text-blue-600">
                                    {totalListings}
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-blue-500"
                                    style={{
                                        width: `${Math.min(
                                            totalListings / 10,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Feedback */}
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Feedback Received
                                </span>

                                <span className="text-sm font-semibold text-pink-600">
                                    {totalFeedback}
                                </span>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-pink-500"
                                    style={{
                                        width: `${Math.min(
                                            totalFeedback / 10,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Recent Activity */}

                <div className="col-span-2 rounded-lg bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Recent Activity
                        </h2>
                    </div>

                    <DataTable
                        columns={columns}
                        data={recentActivities}
                    />
                </div>
            </div>
        </div >
    );
}