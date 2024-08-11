import React, { useState } from 'react';

interface Service {
  id: number;
  name: string;
}

interface ServiceSelectorProps {
  services: Service[];
}

export default function ServiceSelector({ services }: ServiceSelectorProps) {
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowAllServices(false);
  };

  return (
    <div className="relative inline-block">
      {selectedService ? (
        <span
          className="mr-2 inline-flex h-[18px] items-center rounded bg-gray-300 px-1 py-1 text-xs font-semibold text-white"
          
        >
          {selectedService.name}
        </span>
      ) : (
        services.length > 1 && !selectedService && (
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="ml-2 text-xs font-semibold text-black border-2 rounded-md"
            >
              {services[0].name }... + {services.length - 1}
            </button>
          )
      )}

      

      {showAllServices && !selectedService && (
        <div className="absolute mt-2 bg-white shadow-lg rounded-md p-2">
          {services.slice(1).map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer text-sm rounded"
            >
              {service.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
