import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { SalesPipelineData } from "@/types/invoiceLead";
import Link from "next/link";
import { IoAddCircleOutline } from "react-icons/io5";
import { PiWechatLogoLight } from "react-icons/pi";
import { TbInvoice } from "react-icons/tb";
import { NewAppointment_Pipeline } from "./NewAppointment_Pipeline";

interface SalesPipelineProps {
  pipelinesTitle: string;

  salesPipelineDataProp: SalesPipelineData[];
}

export default function SalesPipeline({
  pipelinesTitle,
  salesPipelineDataProp,
}: SalesPipelineProps) {
  const [pipelineData, setPipelineData] = useState<SalesPipelineData[]>(
    salesPipelineDataProp,
  );

  useEffect(() => {
    setPipelineData(salesPipelineDataProp);
  }, [salesPipelineDataProp]);
  const handleDragEnd = () => {
    // Placeholder for drag-and-drop logic
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-hidden">
        <div className="flex justify-between">
          {pipelineData.map((item, categoryIndex) => (
            <Droppable droppableId={`${categoryIndex}`} key={item.id}>
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
                    {item.leads.map((lead, leadIndex) => (
                      <Draggable
                        key={lead.leadId}
                        draggableId={`${categoryIndex}-${leadIndex}`}
                        index={leadIndex}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            key={lead.leadId}
                            className="max-w-auto relative mx-1 my-1 h-fit animate-none rounded-xl border bg-white p-1 duration-300"
                          >
                            <h3 className="font-inter pb-2 font-semibold text-black">
                              {lead.name}
                            </h3>
                            <p className="text-xs">{lead.vehicle}</p>
                            <p className="text-xs"> {lead.services}</p>
                            <p className="text-xs">{lead.source}</p>

                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/communication/client?clientId=${lead.leadId}`}
                                  className="group relative"
                                >
                                  <PiWechatLogoLight size={18} />
                                  <span className="invisible absolute bottom-full left-14 mb-1 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md border-2 border-white bg-[#66738C] px-2 py-1 text-xs text-white shadow-lg transition-opacity group-hover:visible">
                                    Communications
                                  </span>
                                </Link>
                                <Link
                                  href={`/estimate/view/${lead.leadId}`}
                                  className="group relative"
                                >
                                  <TbInvoice size={18} color="#94a3b8 " />
                                  <span className="invisible absolute bottom-full left-14 mb-1 w-max -translate-x-1/2 transform whitespace-nowrap rounded-md border-2 border-white bg-[#66738C] px-2 py-1 text-xs text-white shadow-lg transition-opacity group-hover:visible">
                                    View Work Order
                                  </span>
                                </Link>
                                {lead?.leadId && lead?.vehicle && (
                                  <NewAppointment_Pipeline
                                    clientId={undefined}
                                    vehicleId={undefined}
                                  />
                                )}
                              </div>
                              <div className="group relative">
                                <button className="group rounded-md border-2 border-[#66738C] bg-white px-2 text-center text-xs text-gray-500">
                                  Add Task
                                </button>
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
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
