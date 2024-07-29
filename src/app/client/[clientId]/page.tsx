import Title from "@/components/Title";
import { IoSearchOutline } from "react-icons/io5";
import ClientInformation from "../ClientInformation";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import NewCustomer from "@/components/Lists/NewCustomer2";
export type Order = {
  invoiceId: number;
  price: number;
  status: string;
};
type Vehicle = {
  year: number;
  make: string;
  model: string;
  plate: string;
  orders: Order[];
};
type Props = {
  params: {
    clientId: string;
  };
  searchParams: {
    vehicleId?: string;
  };
};

const Page = async (props: Props) => {
  const { params, searchParams } = props;
  const { clientId } = params;
  const { vehicleId } = searchParams;

  const client = await db.customer.findUnique({
    where: { id: Number(clientId) },
    include: {
      source: true,
      tag: true,
    },
  });

  if (!client) return notFound();

  const vehicle = vehicleId
    ? await db.vehicle.findUnique({
        where: { id: Number(vehicleId) },
      })
    : null;

  return (
    <div className="mb-2">
      <div className="h-[15vh] 2xl:h-[12vh]">
        <Title>Client</Title>

        <div className="my-4 flex items-center justify-between">
          <div className="flex items-center gap-x-8 bg-white">
            <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
              <span className="">
                <IoSearchOutline />
              </span>
              <input
                name="search"
                type="text"
                className="w-full rounded-md border border-slate-400 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
              />
            </div>
          </div>
          <NewCustomer
            buttonElement={
              <button className="rounded-md bg-[#6571FF] p-2 px-5 text-white">
                + Add New Client
              </button>
            }
          />
        </div>
      </div>

      <div className="flex h-[70vh] items-start justify-between gap-x-4 2xl:h-[78vh]">
        <div className="app-shadow h-full w-1/2 rounded-lg bg-white p-4">
          <ClientInformation client={client} />
          {/* <VehicleList
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
          /> */}
        </div>
        <div className="box-2 orderList h-full w-1/2">
          {vehicle ? (
            // <OrderList orders={selectedVehicle.orders} />
            <></>
          ) : (
            <div className="app-shadow flex h-full w-full items-center justify-center rounded-lg bg-white p-4">
              Select Vehicle to view Ordes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
