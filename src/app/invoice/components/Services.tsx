import { useInvoiceStore } from "../../../stores/invoice";
import { ServiceType } from "@/types/db";
import { FaTimes } from "react-icons/fa";

export default function Services() {
  const { services, removeService, setServices } = useInvoiceStore();

  function calculateTotal(service: ServiceType) {
    const price = service.price;
    const quantity = service.quantity;
    const discount = service.discount;

    if (!price) return service.total;

    const total = price * (quantity ? quantity : 1) - (discount ? discount : 0);
    return total;
  }

  function handleServiceChange(
    id: number,
    key: keyof ServiceType,
    value: string | number,
  ) {
    const updatedServices = services.map((service) => {
      if (service.id === id) {
        return {
          ...service,
          [key]: value,
        };
      }

      return service;
    });

    updatedServices.forEach((service) => {
      service.total = calculateTotal(service);
    });
    setServices(updatedServices);
  }

  return (
    <div className="services relative h-44 overflow-x-auto overflow-y-scroll">
      <table className="mt-3 w-full table-fixed">
        <thead>
          <tr className="flex gap-2 text-xs uppercase text-white">
            <th className="w-[20%] bg-[#6571FF] p-2 text-left">Services</th>
            <th className="w-[30%] bg-[#6571FF] p-2 text-left">Description</th>
            <th className="w-[10%] bg-[#6571FF] p-2 text-left">Price</th>
            <th className="w-[10%] bg-[#6571FF] p-2 text-left">Qty/hr</th>
            <th className="w-[10%] bg-[#6571FF] p-2 text-left">Discount</th>
            <th className="w-[10%] bg-[#6571FF] p-2 text-left">Total</th>
            <th className="w-[10%] bg-[#6571FF] p-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const bgColor = !isEven ? "bg-[#F4F4F4]" : "bg-[#EAEAEA]";

            return (
              <tr className="flex gap-2 text-sm text-black" key={service.id}>
                <td className={`text-left ${bgColor} w-[20%] p-2`}>
                  {service.name}
                </td>
                <td className={`text-left ${bgColor} w-[30%] p-2`}>
                  {service.description}
                </td>
                <td className={`text-left ${bgColor} w-[10%] p-2`}>
                  <input
                    type="number"
                    className="w-full border-none bg-transparent px-1 py-0"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(
                        service.id,
                        "price",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                </td>
                <td className={`text-left ${bgColor} w-[10%] p-2`}>
                  <input
                    type="number"
                    className="w-full border-none bg-transparent px-1 py-0"
                    value={service.quantity}
                    onChange={(e) =>
                      handleServiceChange(
                        service.id,
                        "quantity",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </td>
                <td className={`text-left ${bgColor} w-[10%] p-2`}>
                  <input
                    type="number"
                    className="w-full border-none bg-transparent px-1 py-0"
                    value={service.discount}
                    onChange={(e) =>
                      handleServiceChange(
                        service.id,
                        "discount",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                </td>
                <td className={`text-left ${bgColor} w-[10%] p-2 text-base`}>
                  {service.total}
                </td>

                <td className={`text-center ${bgColor} w-[10%] p-2`}>
                  <button
                    className="text-base text-red-500"
                    onClick={() => removeService(service.id)}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
