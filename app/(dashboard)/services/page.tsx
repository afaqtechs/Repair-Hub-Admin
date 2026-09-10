"use client"
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { DataTable } from '@/components/ui/datatable'
import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { useServiceMutations, useServices } from '@/hooks'
import { Service } from '@/types/services'
import ServiceDetail from './components/serviceDetail'
import { serviceColumns } from './components/columns'
import { toast } from '@/components/ui/toast'
import { useRouter, useSearchParams } from 'next/navigation'

function Services() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  const [search, setSearch] = useState("");

  const {
    data: services,
    isLoading: loadingService,
    refetch: refetchService,
    isRefetching: refetchingService,
  } = useServices();

  const { updateService } = useServiceMutations()

  const filterServices = (services: Service[], search: string): Service[] => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      if (!query) {
        return true;
      }

      const searchableText = [
        service.title,
        String(service.price ?? ""),
        `${service.technician?.first_name ?? ""} ${service.technician?.last_name ?? ""}`,
        service.description,
        service.category?.name,
        service.platform?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  };

  const filteredServices = filterServices(services?.data ?? [], search);

  const selectedFromList = services?.data?.find(
    (service) => service.id === serviceId
  );

  const [selectedService, setSelectedService] =
    useState<Service | null>(selectedFromList ?? null);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleTechnicianSelect = (technicianId: string) => {
    router.push(`/users?technicianId=${technicianId}`);
  };

  const handlePlatformSelect = (platformId: string) => {
    router.push(`/platforms?platformId=${platformId}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/categories?categoryId=${categoryId}`);
  };

  // Active / inactive
  const handleActiveChange = (
    service: Service,
    checked: boolean
  ) => {
    updateService.mutate({
      id: service.id,
      payload: {
        is_approved: checked,
      },
    }, {
      onSuccess: (success) => {
        if (!success) {
          toast.add({
            type: "error",
            title: "Update Failed",
            description:
              "Failed to update status.",
          });

          return;
        }

        toast.add({
          type: "success",
          title: "Status approved",
          description:
            "Status approved successfully.",
        });
      },
    });
  };

  return (
    <>
      {
        selectedService ? (
          <ServiceDetail service={selectedService} onBack={() => setSelectedService(null)} />
        ) : (
          <div className="space-y-8">
            <PageHeader
              title="Services"
              description="Manage spare services added to addis repairs."
            />

            <div className="space-y-4 rounded-lg bg-card p-6">
              <DataTableToolbar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search parts, technicians, categories..."
                className="w-full lg:w-1/2"
                showDownload={false}
                showRefresh={true}
                onRefresh={() => {
                  refetchService();
                }}
                refreshing={refetchingService}
              />

              <DataTable
                columns={serviceColumns(
                  handleSelect,
                  handleActiveChange,
                  handleTechnicianSelect,
                  handlePlatformSelect,
                  handleCategorySelect,
                )}
                data={filteredServices}
                isLoading={loadingService}
              />
            </div>
          </div>
        )
      }
    </>
  )
}

export default Services
