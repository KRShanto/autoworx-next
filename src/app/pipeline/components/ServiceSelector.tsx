import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

interface Service {
  id: number;
  name: string;
  completed: boolean;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  isServiceDropdownOpen: boolean;
  handleServiceDropdownToggle: () => void;
  handleServiceSelect: (service: Service) => void;
  [key: string]: any;
}

function ServiceSelector({
  services,
  selectedService,
  isServiceDropdownOpen,
  handleServiceDropdownToggle,
  handleServiceSelect,
  ...restProps
}: ServiceSelectorProps) {
  
  const completedServices = services.filter((service) => service.completed);
  const incompleteServices = services.filter((service) => !service.completed);
  const { type } = restProps;
  return (
    <div className="relative mb-2" {...restProps}>
      <div className="flex gap-2">
        <div
          onClick={handleServiceDropdownToggle}
          className="flex w-[60%] cursor-pointer justify-between rounded-md border border-[#6571FF] px-2 py-1 text-xs"
          style={{
            visibility: isServiceDropdownOpen ? "hidden" : "visible",
          }}
        >
          {selectedService ? (
            <span className="text-[#6571FF]">{selectedService.name}</span>
          ) : (
            <span className="inline-flex w-full justify-between text-[#6571FF]">
              <span className="text-left">
                {services.length > 1
                  ? `${services[0].name}...`
                  : "Select a service"}
              </span>
              {services.length > 1 && (
                <span className="text-right">+ {services.length - 1}</span>
              )}
            </span>
          )}
        </div>

        {type === "Shop Pipelines" && (
          <div
            className="flex gap-1"
            style={{
              visibility: isServiceDropdownOpen ? "hidden" : "visible",
            }}
          >
            <div className="flex items-center gap-1 text-green-600">
              <IoIosCheckmarkCircleOutline />
              <span>{completedServices.length}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <MdErrorOutline />
              <span>{incompleteServices.length}</span>
            </div>
          </div>
        )}
      </div>
      {isServiceDropdownOpen && (
        <div className="font-Inter z-10 mr-1 ml-1 rounded-md border border-[#6571FF] text-[#6571FF]">
          {/* Completed Services */}
          {completedServices.length > 0 && (
            <>
              {type === "Shop Pipelines" && (
                <p className="flex items-center gap-1 px-2 py-1 font-bold text-[#03A7A2]">
                  Complete <IoIosCheckmarkCircleOutline />
                </p>
              )}
              {completedServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`cursor-pointer px-2 py-1 text-sm hover:bg-gray-200 ${
                    selectedService?.id === service.id ? "bg-white" : ""
                  }`}
                >
                  <span className="text-blue-600">{service.name}</span>
                </div>
              ))}
            </>
          )}

          {/* Incomplete Services */}
          {incompleteServices.length > 0 && (
            <>
              {type === "Shop Pipelines" && (
                <p className="flex items-center gap-1 px-2 py-1 font-bold text-yellow-500">
                  Incomplete <MdErrorOutline />
                </p>
              )}
              {incompleteServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`cursor-pointer px-2 py-1 text-sm hover:bg-gray-200 ${
                    selectedService?.id === service.id ? "bg-white" : ""
                  }`}
                >
                  <span className="text-blue-600">{service.name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ServiceSelector;
