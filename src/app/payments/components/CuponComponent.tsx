"use client";
import React, { useState } from "react";
import NewCoupon from "./NewCoupon";
import QrCodeForCoupon from "./QrCodeForCoupon";
import { Coupon } from "@prisma/client";
import moment from "moment";
import { CiEdit } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import EditCoupon from "./EditCoupon";
import { deleteCoupon } from "@/actions/coupon/new";

// Define the props for the CouponTable component
interface CouponTableProps {
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[] | null>>;
}

// CuponComponet component
const CuponComponet = ({ coupons, setCoupons }: CouponTableProps) => {
  const [showQr, setShowQr] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCouponQr = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowQr(true);
  };
  const handleEdit = (e: React.MouseEvent, coupon: Coupon) => {
    e.stopPropagation();
    setSelectedCoupon(coupon);
    setIsEditOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, coupon: Coupon) => {
    e.stopPropagation();
    await deleteCoupon(coupon.id);
    setCoupons(
      (prevCoupons) => prevCoupons?.filter((c) => c.id !== coupon.id) || null,
    );
  };
  const handleUpdate = (updatedCoupon: Coupon) => {
    setCoupons(
      (prevCoupons) =>
        prevCoupons?.map((coupon) =>
          coupon.id === updatedCoupon.id ? updatedCoupon : coupon,
        ) || null,
    );
  };
  return (
    <div className="flex w-full gap-4">
      {/* first half */}
      <div className="flex h-[65vh] w-[75vw] flex-col rounded-lg border bg-white p-4 shadow-lg">
        {/* Button Bar */}

        <div className="mb-3 flex justify-end">
          <div>
            <NewCoupon setCoupons={setCoupons} />
          </div>
        </div>

        {/* Coupon Table */}

        <div className="overflow-y-scroll rounded-md bg-white">
          <table className="min-w-full border-collapse border border-gray-200 bg-white">
            <thead>
              <tr>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Coupon Name
                </th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Coupon Code
                </th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Discount
                </th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Start Date
                </th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Status
                </th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Redemption Count
                </th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <tr
                  key={index}
                  onClick={() => handleCouponQr(coupon)}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]"}`}
                  style={{
                    cursor: "pointer",
                    // give border to the selected coupon
                    border:
                      selectedCoupon?.id === coupon.id
                        ? "2px solid #6571FF"
                        : "",
                  }}
                >
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.name}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.code}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {Number(coupon.discount)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {moment(coupon.startDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.status}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.redemptions}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    <div className="flex gap-3">
                      <button
                        className="text-left text-2xl text-blue-600"
                        onClick={(e) => handleEdit(e, coupon)}
                      >
                        <CiEdit />
                      </button>
                      <button
                        className="text-left text-2xl text-red-400"
                        onClick={(e) => handleDelete(e, coupon)}
                      >
                        <FaTimes onClick={(e) => handleDelete(e, coupon)} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* second half */}
      <div className="flex h-[65vh] w-[20vw] flex-col rounded-lg border bg-white p-4 shadow-lg">
        <div className="mb-4 w-full text-xl font-bold">Coupon Details</div>
        <div className="flex flex-grow items-center justify-center">
          {showQr && selectedCoupon ? (
            <QrCodeForCoupon showQr={showQr} coupon={selectedCoupon} />
          ) : (
            "Select a coupon to view details"
          )}
        </div>
      </div>
      {isEditOpen && selectedCoupon && (
        <EditCoupon
          coupon={selectedCoupon}
          onUpdate={handleUpdate}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
};

export default CuponComponet;
