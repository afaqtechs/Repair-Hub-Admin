"use client";

import React, { useMemo } from "react";
import { useTechnicians } from "@/src/hooks/useProfiles";
import { User, userColumns } from "./component/columns";
import { DataTable } from "@/components/ui/datatable";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { PageHeader } from "@/components/ui/page-header";
import { Profile } from "@/types/profiles";

function Users() {
    const {
        data: technicians = [],
        isLoading,
    } = useTechnicians();

    const technicianUsers: User[] = useMemo(() => {
        return technicians.map((technician: Profile) => ({
            id: technician.id,

            photo: technician.profile_image_url ?? null,

            name:
                `${technician.first_name ?? ""} ${technician.last_name ?? ""
                    }`.trim() || "Unknown User",

            email: technician.email ?? "—",

            phone: technician.phone ?? null,

            role: "technician",

            status:
                technician.verification_status ?? "pending",
        }));
    }, [technicians]);

    const adminUsers: User[] = useMemo(() => {
        return technicians
            .filter((user: Profile) => user.role === "admin")
            .map((admin: Profile) => ({
                id: admin.id,

                photo: admin.profile_image_url ?? null,

                name:
                    `${admin.first_name ?? ""} ${admin.last_name ?? ""
                        }`.trim() || "Unknown User",

                email: admin.email ?? "—",

                phone: admin.phone ?? null,

                role: "admin",

                status:
                    admin.verification_status ?? "verified",
            }));
    }, [technicians]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="Users"
                description=" Manage RepairHub administrators and technicians."
            />

            {/* Admins */}
            <div className="space-y-3">
                <h2 className="font-stretch-semi-expanded text-lg font-semibold text-gray-900">
                    Administrators
                </h2>
                <div className="space-y-4 rounded-lg bg-card p-6">
                    <DataTableToolbar
                        searchPlaceholder="Search categories..."
                        // searchValue={search}
                        // onSearchChange={setSearch}
                        // onDownload={handleDownload}
                        // onFilter={handleFilter}
                        className="w-[50%]"
                    />
                    <DataTable
                        columns={userColumns}
                        data={adminUsers}
                        isLoading={isLoading}
                    />

                </div>
            </div>

            {/* Technicians */}
            <div className="space-y-3">
                <h2 className="font-stretch-semi-expanded text-lg font-semibold text-gray-900">
                    Technicians
                </h2>

                <div className="space-y-4 bg-card p-6 rounded-lg">
                    <DataTableToolbar
                        searchPlaceholder="Search technicians..."
                        // searchValue={search}
                        // onSearchChange={setSearch}
                        // onDownload={handleDownload}
                        // onFilter={handleFilter}
                        className="w-1/2"
                    />

                    <DataTable
                        columns={userColumns}
                        data={technicianUsers}
                        isLoading={isLoading}
                    />

                </div>
            </div>
        </div>
    );
}

export default Users;