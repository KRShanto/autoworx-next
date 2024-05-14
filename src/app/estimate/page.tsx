import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import FilterImage from "@/../public/icons/Filter.svg";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";

const estimates = [
  {
    id: "847563829102",
    clientName: "John Doe",
    vehicle: "Toyota Camry",
    email: "johndoe@example.com",
    phone: "555-234-112",
    price: "$15,400",
    date: "2024-05-14",
    status: "Pending",
    color: "#FF5733",
  },
  {
    id: "938475698734",
    clientName: "Jane Smith",
    vehicle: "Honda Accord",
    email: "janesmith@example.com",
    phone: "555-345-678",
    price: "$17,500",
    date: "2024-05-14",
    status: "Approved",
    color: "#B6EEE9",
  },
  {
    id: "264839102374",
    clientName: "Michael Johnson",
    vehicle: "Ford F-150",
    email: "michaelj@example.com",
    phone: "555-456-789",
    price: "$23,000",
    date: "2024-05-14",
    status: "Declined",
    color: "#3498DB",
  },
  {
    id: "583920174563",
    clientName: "Emily White",
    vehicle: "Chevrolet Impala",
    email: "emilywhite@example.com",
    phone: "555-567-890",
    price: "$19,250",
    date: "2024-05-14",
    status: "Processing",
    color: "#000000",
  },
  {
    id: "473920485673",
    clientName: "William Brown",
    vehicle: "Subaru Outback",
    email: "williamb@example.com",
    phone: "555-678-901",
    price: "$26,300",
    date: "2024-05-14",
    status: "Completed",
    color: "#C0C0C0",
  },
  {
    id: "639204857634",
    clientName: "Lisa Green",
    vehicle: "Nissan Altima",
    email: "lisagreen@example.com",
    phone: "555-789-012",
    price: "$21,150",
    date: "2024-05-14",
    status: "Pending",
    color: "#228B22",
  },
  {
    id: "120394857634",
    clientName: "Mark Evans",
    vehicle: "Volkswagen Jetta",
    email: "markevans@example.com",
    phone: "555-890-123",
    price: "$18,500",
    date: "2024-05-14",
    status: "Approved",
    color: "#FFFF00",
  },
  {
    id: "839120485760",
    clientName: "Nancy Wilson",
    vehicle: "Hyundai Sonata",
    email: "nancyw@example.com",
    phone: "555-901-234",
    price: "$20,000",
    date: "2024-05-14",
    status: "Declined",
    color: "#800080",
  },
  {
    id: "204857609384",
    clientName: "Robert King",
    vehicle: "Kia Optima",
    email: "robertk@example.com",
    phone: "555-012-345",
    price: "$22,750",
    date: "2024-05-14",
    status: "Processing",
    color: "#FF6347",
  },
  {
    id: "638295067412",
    clientName: "Sophia Davis",
    vehicle: "Ford Escape",
    email: "sophiad@example.com",
    phone: "555-123-456",
    price: "$24,900",
    date: "2024-05-14",
    status: "Completed",
    color: "#800000",
  },
  {
    id: "438756023981",
    clientName: "Oliver Martinez",
    vehicle: "Honda Civic",
    email: "oliverm@example.com",
    phone: "555-234-567",
    price: "$16,800",
    date: "2024-05-14",
    status: "Pending",
    color: "#00FFFF",
  },
  {
    id: "192837465029",
    clientName: "Emma Thompson",
    vehicle: "Chevrolet Cruze",
    email: "emmat@example.com",
    phone: "555-345-789",
    price: "$15,200",
    date: "2024-05-14",
    status: "Approved",
    color: "#FF00FF",
  },
  {
    id: "837465920384",
    clientName: "Noah Harris",
    vehicle: "Toyota Corolla",
    email: "noahh@example.com",
    phone: "555-456-012",
    price: "$18,300",
    date: "2024-05-14",
    status: "Declined",
    color: "#FFA500",
  },
  {
    id: "384756290183",
    clientName: "Ava Wilson",
    vehicle: "Ford Focus",
    email: "avaw@example.com",
    phone: "555-567-234",
    price: "$17,450",
    date: "2024-05-14",
    status: "Processing",
    color: "#008080",
  },
  {
    id: "574839201965",
    clientName: "Mason Wright",
    vehicle: "Nissan Sentra",
    email: "masonw@example.com",
    phone: "555-678-345",
    price: "$19,800",
    date: "2024-05-14",
    status: "Completed",
    color: "#808000",
  },
  {
    id: "847593028465",
    clientName: "Isabella Johnson",
    vehicle: "Mazda CX-5",
    email: "isabellaj@example.com",
    phone: "555-789-456",
    price: "$25,500",
    date: "2024-05-14",
    status: "Pending",
    color: "#EE82EE",
  },
  {
    id: "120948576302",
    clientName: "Liam Brown",
    vehicle: "Hyundai Elantra",
    email: "liamb@example.com",
    phone: "555-890-567",
    price: "$18,600",
    date: "2024-05-14",
    status: "Approved",
    color: "#FFDAB9",
  },
  {
    id: "948576230184",
    clientName: "Sophie Lee",
    vehicle: "Kia Sorento",
    email: "sophiel@example.com",
    phone: "555-901-678",
    price: "$23,000",
    date: "2024-05-14",
    status: "Declined",
    color: "#F5F5DC",
  },
  {
    id: "573920184756",
    clientName: "Ethan Taylor",
    vehicle: "Subaru Forester",
    email: "ethant@example.com",
    phone: "555-012-789",
    price: "$26,750",
    date: "2024-05-14",
    status: "Processing",
    color: "#FFACAC",
  },
  {
    id: "120948756473",
    clientName: "Mia Gonzalez",
    vehicle: "Ford Explorer",
    email: "miag@example.com",
    phone: "555-123-890",
    price: "$30,900",
    date: "2024-05-14",
    status: "Completed",
    color: "#00FF00",
  },
];

export default function Page() {
  const evenColor = "bg-white";
  const oddColor = "bg-[#F8FAFF]";

  return (
    <div>
      <Title>Estimates</Title>

      {/* Header */}
      <div className="mt-5 flex justify-between">
        <div className="app-shadow flex gap-3 rounded-md p-3 ">
          {/* Search */}
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="h-10 w-64 rounded-md border-2 border-slate-400 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filter */}
          <button className="flex h-10 items-center gap-2 rounded-md border-2 border-slate-400 p-1">
            <Image
              src={FilterImage}
              alt="Filter"
              width={20}
              height={20}
              className="cursor-pointer"
            />
            Customize
          </button>
        </div>

        {/* Create Estimate */}
        <Link
          href="/estimate/create"
          className="app-shadow flex h-10 items-center rounded-md bg-[#6571FF] px-5 text-white"
        >
          + Create Estimate
        </Link>
      </div>

      {/* Estimate Display */}
      <div className="app-shadow mt-5 h-[75vh] overflow-auto rounded-md bg-white">
        <table className="h-full w-full">
          {/* Estimate Header */}
          <thead className="sticky top-0 bg-white">
            <tr className="h-10 border-b">
              <th className="px-10 text-left">Invoice ID</th>
              <th className="px-10 text-left">Client</th>
              <th className="px-10 text-left">Vehicle</th>
              <th className="px-10 text-left">Email</th>
              <th className="px-10 text-left">Phone</th>
              <th className="px-10 text-left">Price</th>
              <th className="px-10 text-left">Date</th>
              <th className="px-10 text-left">Status</th>
              <th className="px-10 text-left">Edit</th>
            </tr>
          </thead>

          {/* Estimate List */}
          <tbody>
            {estimates.map((estimate, index) => (
              <tr
                key={estimate.id}
                className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
              >
                <td className="h-12 px-10 text-left">{estimate.id}</td>
                <td className="px-10 text-left">{estimate.clientName}</td>
                <td className="px-10 text-left">{estimate.vehicle}</td>
                <td className="px-10 text-left">{estimate.email}</td>
                <td className="px-10 text-left">{estimate.phone}</td>
                <td className="px-10 text-left text-[#006D77]">
                  {estimate.price}
                </td>
                <td className="px-10 text-left">
                  {/* format: date.month.year */}
                  {moment(estimate.date).format("DD.MM.YYYY")}
                </td>
                <td className="px-10 text-left">
                  <p
                    className="rounded-md text-center text-white"
                    style={{ backgroundColor: estimate.color }}
                  >
                    {estimate.status}
                  </p>
                </td>
                <td className="px-10 text-left">
                  <button className="text-2xl text-blue-600">
                    <CiEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
