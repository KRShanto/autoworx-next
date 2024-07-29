"use client";
import Title from "@/components/Title";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import AddNewClient from "../AddNewClient";
import ClientInformation from "../ClientInformation";
import OrderList from "../OrderList";
import VehicleList from "../VehicleList";
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
type Props = {};

const vehicles: Vehicle[] = [
  {
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    plate: "1A-ABC-123",
    orders: [
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "due",
      },
    ],
  },
  {
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    plate: "1A-ABC-123",
    orders: [
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "due",
      },
    ],
  },
  {
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    plate: "1A-ABC-123",
    orders: [
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "due",
      },
    ],
  },
  {
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    plate: "1A-ABC-123",
    orders: [
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "due",
      },
    ],
  },
  {
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    plate: "1A-ABC-123",
    orders: [
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "pending",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "paid",
      },
      {
        invoiceId: 1234567890,
        price: 450,
        status: "due",
      },
    ],
  },
].map((vehicle, index) => ({
  ...vehicle,
  id: index + 1,
  orders: vehicle.orders.map((order, index) => ({ ...order, id: index + 1 })),
}));

const Page = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
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
          <AddNewClient />
        </div>
      </div>

      <div className="flex h-[70vh] items-start justify-between gap-x-4 2xl:h-[78vh]">
        <div className="app-shadow h-full w-1/2 rounded-lg bg-white p-4">
          <ClientInformation />
          <VehicleList
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
          />
        </div>
        <div className="box-2 orderList h-full w-1/2">
          {selectedVehicle ? (
            <OrderList orders={selectedVehicle.orders} />
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
