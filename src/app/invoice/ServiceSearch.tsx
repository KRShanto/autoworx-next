import { useInvoiceStore } from "../../stores/invoice";
import { ServiceType } from "@/types/db";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function ServiceSearch({
  allServices,
}: {
  allServices: ServiceType[];
}) {
  const [shouldShow, setShouldShow] = useState(false);
  const { services, addService } = useInvoiceStore();

  const [servicesToShow, setServicesToShow] = useState(allServices);

  useEffect(() => {
    setServicesToShow(allServices);
  }, [allServices]);

  return (
    <div className="app-shadow flex w-[300px] items-center rounded-md border-none px-2">
      <FaSearch />
      <input
        type="text"
        id="search"
        name="search"
        required
        placeholder="Search and Add Product/Service"
        className="w-full border-none p-1 px-3 text-sm"
        onFocus={() => setShouldShow(true)}
        onBlur={() => setTimeout(() => setShouldShow(false), 150)}
        onChange={(e) => {
          // filter the services
          const search = e.target.value;
          const filteredServices = allServices.filter((service) =>
            service.name.toLowerCase().includes(search.toLowerCase()),
          );

          setServicesToShow(filteredServices);
        }}
      />

      {shouldShow && (
        <div className="app-shadow absolute z-50 mt-20 w-[300px] rounded-md bg-white">
          {servicesToShow.map((service) => (
            <div
              key={service.id}
              className="cursor-pointer border-b border-[#EFEFEF] p-2 hover:bg-[#F4F4F4]"
              onClick={() => {
                // check if the service already exists
                const exists = services.find((s) => s.id === service.id);
                if (!exists) {
                  addService(service);
                }
              }}
            >
              <p className="text-sm">{service.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
