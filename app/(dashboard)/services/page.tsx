"use client"
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { DataTable } from '@/components/ui/datatable'
import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { useServiceMutations, useServices } from '@/hooks'
import { Service } from '@/types/services'
import ServiceDetail from './components/serviceDetail'
import { serviceColumns } from './components/columns'

function Services() {

  const {
    data: services,
    isLoading: loadingService,
  } = useServices();

  const { updateService } = useServiceMutations()

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
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
                searchPlaceholder="Search categories..."
                className="w-full lg:w-1/2"
              />

              <DataTable
                columns={serviceColumns(
                  handleSelect,
                  handleActiveChange,
                  // onView
                )}
                data={services?.data ?? []}
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
