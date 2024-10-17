/* eslint-disable @next/next/no-img-element */
"use client";
import { getEmployees } from "@/actions/employee/get";
import { updateInvoiceStatus } from "@/actions/estimate/invoice/updateInvoiceStatus";
import {
  getWorkOrders,
  updateAssignedTo,
} from "@/actions/pipelines/getWorkOrders";
import {
  removeInvoiceTag,
  saveInvoiceTag,
} from "@/actions/pipelines/invoiceTag";
import SessionUserType from "@/types/sessionUserType";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { EmployeeType, Prisma, Tag, Task, User } from "@prisma/client";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiWechatLogoLight } from "react-icons/pi";
import { EmployeeSelector } from "./EmployeeSelector";
import { EmployeeTagSelector } from "./EmployeeTagSelector";
import ServiceSelector from "./ServiceSelector";
import TaskForm from "./TaskForm";
//dummy services

//interfaces

interface Employee {
  id: number;
  firstName: string;
  lastName: string | null;
}
interface Lead {
  invoiceId: string;
  name: string;
  email: string;
  phone: string;
  clientId: number | null;
  vehicle: string;
  services: {
    completed: string[];
    incomplete: string[];
  };
  createdAt: string;
  workOrderStatus?: string;
  tags: InvoiceTag[];

  tasks?: Task[];
  assignedTo: User | Employee | null;
}
interface InvoiceTag {
  id: number;
  tag: Tag;
}
interface PipelineData {
  title: string;
  leads: Lead[];
}

type Column = {
  id: number | null;
  title: string;
  type: string;
};

interface PipelinesProps {
  pipelinesTitle: string;
  columns?: Column[];
}
interface UserTypes {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  employeeType: EmployeeType;
  companyId: number;
}
type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    client: true;
    vehicle: true;
    invoiceItems: {
      include: {
        service: {
          include: {
            Technician: true;
          };
        };
      };
    };
    tags: {
      select: {
        id: true;
        tag: true;
      };
    };
    tasks: true;
    assignedTo: true;
  };
}>;
export default function Pipelines({
  pipelinesTitle: pipelineType,
  columns,
}: Readonly<PipelinesProps>) {
  const [pipelineData, setPipelineData] = useState<PipelineData[]>([]);
  const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);

  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
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
        const fetchedCompanyUsers = await getEmployees({
          excludeCurrentUser: true,
        });
        setCompanyUsers(fetchedCompanyUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (invoices && columns) {
      const transformedLeads: Lead[] = invoices.map((invoice) => {
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

        return {
          invoiceId: invoice.id,
          name: `${invoice.client?.firstName ?? ""} ${invoice.client?.lastName ?? ""}`.trim(),
          email: invoice.client?.email ?? "",
          phone: invoice.client?.mobile ?? "",
          clientId: invoice.clientId,
          vehicle:
            `${invoice.vehicle?.year ?? ""} ${invoice.vehicle?.make ?? ""} ${invoice.vehicle?.model ?? ""}`.trim(),
          workOrderStatus: invoice.workOrderStatus ?? "Pending",
          services: {
            completed: completedServices,
            incomplete: incompleteServices,
          },
          tags: invoice.tags.map((tag) => ({ id: tag.id, tag: tag.tag })),
          tasks: invoice.tasks,
          assignedTo: invoice.assignedTo,
          createdAt: new Date(invoice.createdAt).toDateString(),
        };
      });

      let updatedPipelineData = columns.map((column) => ({
        title: column.title,
        leads: transformedLeads.filter(
          (lead) => lead.workOrderStatus?.trim() === column.title.trim(),
        ),
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
  }, [invoices, columns, currentUser]);

  const [selectedEmployees, setSelectedEmployees] = useState<{
    [key: string]: Employee | null;
  }>({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState<{
    category: number;
    index: number;
  } | null>(null);

  const [tag, setTag] = useState<Tag>();
  const [tagDropdownStates, setTagDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [leadTags, setLeadTags] = useState<{ [key: string]: Tag[] }>({});

  const [openServiceDropdown, setOpenServiceDropdown] = useState<{
    [key: string]: boolean;
  }>({});

  const handleDropdownToggle = (categoryIndex: number, leadIndex: number) => {
    if (
      openDropdownIndex?.category === categoryIndex &&
      openDropdownIndex.index === leadIndex
    ) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex({ category: categoryIndex, index: leadIndex });
    }
  };

  const getInitials = (employee: Employee | null) => {
    if (employee) {
      const firstNameInitial = employee.firstName.charAt(0).toUpperCase();
      const lastNameInitial = employee.lastName?.charAt(0).toUpperCase();
      return `${firstNameInitial}${lastNameInitial}`;
    }
    return "";
  };

  const createEmployeeSelectHandler =
    (categoryIndex: number, leadIndex: number) =>
    async (value: SetStateAction<Employee | null>) => {
      const key = `${categoryIndex}-${leadIndex}`;
      const resolvedValue =
        typeof value === "function" ? value(selectedEmployees[key]) : value;

      // Update the selected employee in the state
      setSelectedEmployees((prevState) => ({
        ...prevState,
        [key]: resolvedValue,
      }));

      // Close the dropdown
      setOpenDropdownIndex(null);

      const invoiceId = pipelineData[categoryIndex].leads[leadIndex].invoiceId;

      if (resolvedValue && resolvedValue.id) {
        try {
          const response = await updateAssignedTo(invoiceId, resolvedValue.id);
          if (response.success) {
            // Update pipelineData to persist the selected employee in the UI
            const updatedPipelineData = [...pipelineData];
            updatedPipelineData[categoryIndex].leads[leadIndex].assignedTo =
              resolvedValue;

            setPipelineData(updatedPipelineData); // Update the state to reflect the change
          } else {
            console.error("Failed to update assigned employee");
          }
          if (!response.success) {
            console.error("Failed to update assigned employee");
          }
        } catch (error) {
          console.error("Error updating assigned employee:", error);
        }
      } else {
        console.error("No employee selected");
      }
    };

  const handleTagDropdownToggle = (
    categoryIndex: number,
    leadIndex: number,
  ) => {
    const key = `${categoryIndex}-${leadIndex}`;
    setTagDropdownStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  //for tag handling
  const handleTagSelect = async (
    categoryIndex: number,
    leadIndex: number,
    selectedTag: Tag | undefined,
  ) => {
    if (selectedTag) {
      const key = `${categoryIndex}-${leadIndex}`;
      const invoiceId = pipelineData[categoryIndex].leads[leadIndex].invoiceId;
      try {
        const result = await saveInvoiceTag(invoiceId, selectedTag.id);
        if (result) {
          const updatedPipelineData = [...pipelineData];
          updatedPipelineData[categoryIndex].leads[leadIndex].tags.push({
            id: selectedTag.id,
            tag: selectedTag,
          });
          setPipelineData(updatedPipelineData);

          // Optionally update the leadTags state (if needed)
          setLeadTags((prevState) => {
            const existingTags = prevState[key] || [];
            return {
              ...prevState,
              [key]: [...existingTags, selectedTag],
            };
          });
        }
      } catch (error) {
        console.error("Error saving tag:", error);
      }
    }
  };
  // Handle tag removal
  const handleTagRemove = async (
    categoryIndex: number,
    leadIndex: number,
    tagToRemove: Tag,
  ) => {
    const key = `${categoryIndex}-${leadIndex}`;
    const invoiceId = pipelineData[categoryIndex].leads[leadIndex].invoiceId;

    try {
      // Remove the tag from the database
      const result = await removeInvoiceTag(invoiceId, tagToRemove.id);

      if (result) {
        // Update the UI after removing the tag
        const updatedPipelineData = [...pipelineData];
        updatedPipelineData[categoryIndex].leads[leadIndex].tags =
          updatedPipelineData[categoryIndex].leads[leadIndex].tags.filter(
            (tag) => tag.id !== tagToRemove.id,
          );
        setPipelineData(updatedPipelineData);
        setLeadTags((prevState) => {
          const existingTags =
            prevState[key] || pipelineData[categoryIndex].leads[leadIndex].tags;
          return {
            ...prevState,
            [key]: existingTags.filter((tag) => tag.id !== tagToRemove.id),
          };
        });
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  //service

  const handleServiceDropdownToggle = (
    categoryIndex: number,
    leadIndex: number,
  ) => {
    const key = `${categoryIndex}-${leadIndex}`;
    setOpenServiceDropdown((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    // If the item is dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle drag-and-drop within the same column
    if (destination.droppableId === source.droppableId) {
      const columnIndex = parseInt(source.droppableId);
      const columnItems = [...pipelineData[columnIndex].leads];

      // Remove the item from the source index
      const [removed] = columnItems.splice(source.index, 1);

      // Re-insert the item at the destination index
      columnItems.splice(destination.index, 0, removed);

      // Update the state with the reordered column items
      const updatedData = pipelineData.map((column, index) => {
        if (index === columnIndex) {
          return { ...column, leads: columnItems };
        }
        return column;
      });

      setPipelineData(updatedData);
      return;
    }

    // Handle drag-and-drop between different columns
    const sourceColumn = pipelineData[source.droppableId];
    const destinationColumn = pipelineData[destination.droppableId];

    const sourceItems = [...sourceColumn.leads];
    const destinationItems = [...destinationColumn.leads];

    const [removed] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, removed);

    const updatedData = pipelineData.map((column, index) => {
      if (index === parseInt(source.droppableId)) {
        return { ...column, leads: sourceItems };
      } else if (index === parseInt(destination.droppableId)) {
        return { ...column, leads: destinationItems };
      }
      return column;
    });

    setPipelineData(updatedData);

    const invoiceId = removed.invoiceId;
    const newStatus = destinationColumn.title;

    try {
      const response = await updateInvoiceStatus(invoiceId, newStatus);
      if (response.type === "success") {
      } else {
        console.error("Failed to update invoice status:", response.message);
      }
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-hidden">
        <div className="flex justify-between">
          {pipelineData.map((item, categoryIndex) => (
            <Droppable
              droppableId={`${categoryIndex}`}
              key={categoryIndex.toString()}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mx-2 w-full flex-1 rounded-md border"
                  style={{
                    backgroundColor: "rgba(101, 113, 255, 0.15)",
                    padding: "0",
                  }}
                >
                  <h2 className="rounded-lg bg-[#6571FF] px-4 py-3 text-center text-white">
                    <p className="text-base font-bold">{item.title || ""}</p>
                  </h2>

                  <ul
                    className="mt-1 flex max-h-[70vh] min-h-[70vh] flex-col gap-1 overflow-auto p-1"
                    style={{ maxHeight: "70vh" }}
                  >
                    {item.leads.map((lead, leadIndex) => {
                      const key = `${categoryIndex}-${leadIndex}`;

                      const isDropdownOpen =
                        openDropdownIndex?.category === categoryIndex &&
                        openDropdownIndex.index === leadIndex;

                      const isTagDropdownOpen = tagDropdownStates[key];

                      const isServiceDropdownOpen =
                        openServiceDropdown[key] || false;

                      const selectedEmployee = lead.assignedTo;
                      return (
                        <Draggable
                          key={lead.invoiceId}
                          draggableId={`${categoryIndex}-${leadIndex}`}
                          index={leadIndex}
                        >
                          {(provided) => (
                            <li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              key={lead.invoiceId}
                              className="max-w-auto relative mx-1 my-1 h-fit rounded-xl border bg-white p-1"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-inter overflow-auto pb-2 font-semibold text-black">
                                  {lead.name}
                                </h3>
                                {pipelineType === "Sales Pipelines" && (
                                  <div>
                                    {!isDropdownOpen && (
                                      <div
                                        role="button"
                                        onClick={() =>
                                          handleDropdownToggle(
                                            categoryIndex,
                                            leadIndex,
                                          )
                                        }
                                      >
                                        {selectedEmployee ? (
                                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-xs text-black">
                                            {getInitials(selectedEmployee)}
                                          </div>
                                        ) : (
                                          <IoAddCircleOutline size={26} />
                                        )}
                                      </div>
                                    )}

                                    {isDropdownOpen && (
                                      <div className="absolute right-0 top-8 z-10">
                                        <EmployeeSelector
                                          name="employeeId"
                                          value={selectedEmployee}
                                          setValue={createEmployeeSelectHandler(
                                            categoryIndex,
                                            leadIndex,
                                          )}
                                          openDropdown={true}
                                          setOpenDropdown={() =>
                                            setOpenDropdownIndex(null)
                                          }
                                          companyUsers={companyUsers}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="mb-1 flex flex-wrap items-center gap-1">
                                {pipelineData[categoryIndex].leads[
                                  leadIndex
                                ].tags.map((invoiceTag) => (
                                  <span
                                    key={`tag-${invoiceTag.id}`}
                                    className="mr-2 inline-flex h-[20px] items-center rounded bg-gray-300 px-1 py-1 text-xs font-semibold text-black"
                                    style={{
                                      backgroundColor: invoiceTag.tag?.bgColor,
                                      color: invoiceTag.tag?.textColor,
                                    }}
                                  >
                                    {invoiceTag.tag.name}
                                    <div
                                      className="ml-1 text-xs text-white"
                                      onClick={() =>
                                        handleTagRemove(
                                          categoryIndex,
                                          leadIndex,
                                          invoiceTag.tag,
                                        )
                                      }
                                    >
                                      ✕
                                    </div>
                                  </span>
                                ))}

                                <button
                                  onClick={() =>
                                    handleTagDropdownToggle(
                                      categoryIndex,
                                      leadIndex,
                                    )
                                  }
                                  className="inline-flex h-[20px] items-center justify-center rounded bg-[#6571FF] px-1 py-1 text-xs font-semibold text-white"
                                >
                                  + Add
                                </button>
                              </div>
                              {isTagDropdownOpen && (
                                <div className="-left-100 absolute top-12 z-20">
                                  <EmployeeTagSelector
                                    value={tag}
                                    setValue={(selectedTag) =>
                                      handleTagSelect(
                                        categoryIndex,
                                        leadIndex,
                                        selectedTag,
                                      )
                                    }
                                    open={isTagDropdownOpen}
                                    setOpen={() =>
                                      handleTagDropdownToggle(
                                        categoryIndex,
                                        leadIndex,
                                      )
                                    }
                                  />
                                </div>
                              )}
                              <div>
                                <p className="mb-2 overflow-auto text-xs">
                                  {lead.vehicle}
                                </p>
                              </div>
                              {/* service code */}
                              <ServiceSelector
                                services={lead.services.completed.concat(
                                  lead.services.incomplete,
                                )}
                                completedServices={lead.services.completed}
                                incompleteServices={lead.services.incomplete}
                                isServiceDropdownOpen={isServiceDropdownOpen}
                                handleServiceDropdownToggle={() =>
                                  handleServiceDropdownToggle(
                                    categoryIndex,
                                    leadIndex,
                                  )
                                }
                                type={pipelineType}
                              />
                              {pipelineType === "Sales Pipelines" && (
                                <div>
                                  <p className="overflow-auto pb-2 text-xs">
                                    Lead Source
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/communication/client?clientId=${lead.clientId}`}
                                    className="group relative"
                                  >
                                    <PiWechatLogoLight size={18} />
                                    <span className="invisible absolute bottom-full left-14 mb-1 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md border-2 border-white bg-[#66738C] px-2 py-1 text-xs text-white shadow-lg transition-opacity group-hover:visible">
                                      Communications
                                    </span>
                                  </Link>
                                  <Link
                                    href={`/estimate/view/${lead.invoiceId}`}
                                    className="group relative"
                                  >
                                    <img
                                      src="/icons/invoice.png"
                                      alt=""
                                      width={12}
                                      height={12}
                                      style={{ marginBottom: "0px" }}
                                    />
                                    <span className="invisible absolute bottom-full left-14 mb-1 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md border-2 border-white bg-[#66738C] px-2 py-1 text-xs text-white shadow-lg transition-opacity group-hover:visible">
                                      View Work Order
                                    </span>
                                  </Link>
                                  <Link href="/" className="group relative">
                                    <CiCalendar size={18} />
                                    <span className="invisible absolute bottom-full left-16 mb-1 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md border-2 border-white bg-[#66738C] px-2 py-1 text-xs text-white shadow-lg transition-opacity group-hover:visible">
                                      Create Appointment
                                    </span>
                                  </Link>
                                </div>
                                <div className="group relative">
                                  <TaskForm
                                    companyUsers={companyUsers}
                                    invoiceId={lead.invoiceId}
                                    previousTasks={lead.tasks || []}
                                  />
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
