"use client";
import { getColumnsByType } from "@/actions/pipelines/pipelinesColumn";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Pipelines from "../components/Pipelines";
import WorkOrders from "../components/WorkOrders";

import { useServerGet } from "@/hooks/useServerGet";
import SessionUserType from "@/types/sessionUserType";
import { useSearchParams } from "next/navigation";
import getDataForNewAppointment from "@/actions/pipelines/getDataForNewAppointment";
import { User } from "@prisma/client";
import {
  InvoiceWithRelations,
  
  ShopLead,
  ShopPipelineData,
} from "@/types/invoiceLead";
import { getWorkOrders } from "@/actions/pipelines/getWorkOrders";
import { getEmployees } from "@/actions/employee/get";

type Props = {
  searchParams?: { view?: string };
};

interface Column {
  id: number | null;
  title: string;
  type: string;
  order: number;
}

const Page = (props: Props) => {
  const searchParam = useSearchParams();
  const initialView = searchParam.get("view") ?? "workOrders";
  const [activeView, setActiveView] = useState(initialView);
  const [pipelineColumns, setPipelineColumns] = useState<Column[]>([]);

  //leads start
  const [pipelineData, setPipelineData] = useState<ShopPipelineData[]>([]);
  const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);

  const [currentUser, setCurrentUser] = useState<SessionUserType>();
  const servicesOfCurrentUser: any = [];

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/getUser");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedInvoices = await getWorkOrders();
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (invoices && pipelineColumns) {
      const transformedLeads: ShopLead[] = invoices.map((invoice) => {
        const completedServices: string[] = [];
        const incompleteServices: string[] = [];

        invoice.invoiceItems.forEach((item) => {
          const technicians = item.service?.Technician || [];

          const statuses = technicians.map((tech) =>
            tech.status?.toLowerCase(),
          );
          servicesOfCurrentUser.push(
            ...technicians.filter(
              (tech) => tech.userId === Number(currentUser?.id),
            ),
          );
          console.log("The services of currentUser:", servicesOfCurrentUser);
          const isServiceComplete = statuses.every(
            (status) => status === "complete",
          );

          if (isServiceComplete) {
            completedServices.push(item.service?.name ?? "");
          } else {
            incompleteServices.push(item.service?.name ?? "");
          }
        });
        const columnStatusId = invoice.columnId;

        return {
          invoiceId: invoice.id,
          name: `${invoice.client?.firstName ?? ""} ${invoice.client?.lastName ?? ""}`.trim(),
          email: invoice.client?.email ?? "",
          phone: invoice.client?.mobile ?? "",
          clientId: invoice.clientId,
          vehicle:
            `${invoice.vehicle?.year ?? ""} ${invoice.vehicle?.make ?? ""} ${invoice.vehicle?.model ?? ""}`.trim(),
          vehicleId: invoice.vehicleId,
          workOrderStatus: invoice.workOrderStatus ?? "Pending",
          services: {
            completed: completedServices,
            incomplete: incompleteServices,
          },
          tags: invoice.tags.map((tag) => ({ id: tag.id, tag: tag.tag })),
          tasks: invoice.tasks,
          assignedTo: invoice.assignedTo,
          createdAt: new Date(invoice.createdAt).toDateString(),
          columnId: columnStatusId,
        };
      });

      let updatedPipelineData = pipelineColumns.map((column) => ({
        id: column.id,
        title: column.title,
        leads: transformedLeads.filter((lead) => lead.columnId === column.id),
      }));

      console.log("Current user:", currentUser);

      // Only filter for technicians
      if (currentUser?.employeeType === "Technician") {
        updatedPipelineData = updatedPipelineData.map((column) => ({
          ...column,
          leads: column.leads.filter((lead) =>
            servicesOfCurrentUser.some(
              (service: any) => lead.invoiceId === service.invoiceId,
            ),
          ),
        }));
      }

      setPipelineData(updatedPipelineData);
    }
  }, [invoices, pipelineColumns, currentUser]);
  //leads end
  const columnType = "shop";

  useEffect(() => {
    const fetchShopColumns = async () => {
      const columns = await getColumnsByType(columnType);
      setPipelineColumns(columns);
    };

    fetchShopColumns();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/getUser");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const newView = searchParam.get("view") ?? "workOrders";
    setActiveView(newView);
  }, [searchParam]);

  const handleColumnsUpdate = async ({ columns }: { columns: Column[] }) => {
    setPipelineColumns(columns);
  };
  const type = "Shop Pipelines";

  return (
    <div className="space-y-8">
      <Header
        activeView={activeView}
        pipelinesTitle={type}
        columns={pipelineColumns}
        onColumnsUpdate={handleColumnsUpdate}
        type={columnType}
        currentUser={currentUser}
      />
      {activeView === "pipelines" ? (
        <Pipelines
          pipelinesTitle={type}
          columns={pipelineColumns}
          shopPipelineDataProp={pipelineData}
        />
      ) : (
        <WorkOrders type={columnType} />
      )}
    </div>
  );
};

export default Page;
