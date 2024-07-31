"use client";
import Title from "@/components/Title";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import AddNewClient from "../AddNewClient";
import ClientInformation from "../ClientInformation";
import OrderList from "../OrderList";
import VehicleList from "../VehicleList";

type Props = {};
const vehicles = [
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
const ClientPage = (props: Props) => {
  const [selectedVehicle, setSelectedVehicle] = useState<{
    id: number;
    orders: {
      id: number;
      invoiceId: number;
      price: number;
      status: string;
    }[];
    year: number;
    make: string;
    model: string;
    plate: string;
  } | null>(null);
  return (
    <div>
      <div className="heading">
        <Title>Client List</Title>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-8">
            <div className="flex w-[500px] items-center gap-x-2 rounded-md border border-gray-300 px-4 py-1 text-gray-400">
              <span className="">
                <IoSearchOutline />
              </span>
              <input
                name="search"
                type="text"
                className="w-full rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
              />
            </div>
          </div>
          <AddNewClient />
        </div>
      </div>
      <div className="content flex items-start justify-between gap-x-4">
        <div className="box-1 w-1/2">
          <ClientInformation />
          <VehicleList
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
          />
        </div>
        <div className="box-2 orderList w-1/2">
          <OrderList
            orders={
              selectedVehicle?.orders as {
                id: number;
                invoiceId: number;
                price: number;
                status: string;
              }[]
            }
          />
        </div>
      </div>
    </div>
  );
};
export default ClientPage;
