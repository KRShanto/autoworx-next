import EditVendor from "@/components/Lists/EditVendor";
import Title from "@/components/Title";
import { cn } from "@/lib/cn";
import { db } from "@/lib/db";
import moment from "moment";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const evenColor = "bg-white";
const oddColor = "bg-[#F8FAFF]";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const histories = await db.inventoryProductHistory.findMany({
    where: {
      vendorId: parseInt(id),
      type: "Purchase",
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const vendor = await db.vendor.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  const totalPurchaseAmount = histories.reduce((acc, history) => {
    return acc + (history.product.price as any) * history.quantity;
  }, 0);

  const totalAmountSpent = 0;

  return (
    <div className="h-full">
      <Link href="/inventory/vendor">
        <Title className="flex items-center">
          <IoIosArrowBack />
          Vendor - Purchase History
        </Title>
      </Link>

      <div className="mt-5 flex h-full gap-5">
        <div className="h-[90%] w-[65%] overflow-scroll">
          {/* TODO: fix height issue */}
          <table className="w-full">
            <thead className="bg-white">
              <tr className="h-10 border-b">
                <th className="px-10 text-left">#</th>
                <th className="px-10 text-left">Name</th>
                <th className="px-10 text-left">Price</th>
                <th className="px-10 text-left">Quantity</th>
                <th className="px-10 text-left">Total</th>
                <th className="px-10 text-left">Date</th>
                <th className="px-5 text-left">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {histories.map((history, index) => (
                <tr
                  key={history.id}
                  className={cn("py-3", index % 2 === 0 ? evenColor : oddColor)}
                >
                  <td className="h-12 px-10 text-left">
                    <p>{history.id}</p>
                  </td>
                  <td className="text-nowrap px-10 text-left">
                    {history.product.name}
                  </td>
                  <td className="text-nowrap px-10 text-left">
                    {Number(history.price)}
                  </td>
                  <td className="px-10 text-left">{history.quantity}</td>
                  <td className="px-10 text-left">
                    {Number(history.price) * history.quantity}
                  </td>
                  <td className="px-10 text-left">
                    {moment.utc(history.createdAt).format("DD.MM.YYYY")}
                  </td>
                  <td className="mt-2 flex gap-3 px-5">
                    {history.product.receipt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-[30%]">
          <div className="flex w-full gap-5">
            <div className="app-shadow w-full rounded-lg bg-white p-6 px-6">
              <div className="h-16">
                <h3 className="text-nowrap text-center font-semibold">
                  Total Purchase Amount
                </h3>
                <p className="mt-2 text-center text-4xl font-bold">
                  ${totalPurchaseAmount}
                </p>
              </div>
            </div>
            <div className="app-shadow w-full rounded-lg bg-white p-6 px-6">
              <div className="h-16 w-full">
                <h3 className="text-nowrap text-center font-semibold">
                  Total Amount Spent
                </h3>
                <p className="mt-2 text-center text-4xl font-bold">
                  ${totalAmountSpent}
                </p>
              </div>
            </div>
          </div>

          <div className="app-shadow mt-5 w-full rounded-lg bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Vendor Details</h3>
              <EditVendor
                button={
                  <button className="rounded-sm border-2 px-4 py-1">Edit</button>
                }
                vendor={vendor!}
              />
            </div>
            <div className="flex flex-col gap-1 p-3">
              <p>Contact Name: {vendor?.name}</p>
              <p>Company Name: {vendor?.companyName}</p>
              <p>Phone: {vendor?.phone}</p>
              <p>Email: {vendor?.email}</p>
              <p>Address: {vendor?.address}</p>
              <p>City: {vendor?.city}</p>
              <p>State: {vendor?.state}</p>
              <p>Zip: {vendor?.zip}</p>
              <p>Website: {vendor?.website}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
