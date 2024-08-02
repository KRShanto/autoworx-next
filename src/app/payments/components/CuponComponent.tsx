"use client";
import React, { useState } from "react";
import NewCoupon from "./NewCoupon";
import QrCodeForCoupon from "./QrCodeForCoupon";

// Define the structure of a coupon

interface Coupon {
  couponName: string;
  code: string;
  discount: string;
  startDate: string;
  status: string;
  redemptionCount: string;
}

// Define the props for the CouponTable component
interface CouponTableProps {
  coupons: Coupon[];
}

// CuponComponet component
const CuponComponet = ({ coupons }: CouponTableProps) => {
  const [showQr, setShowQr] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const handleCouponQr=(coupon:Coupon)=>{
    setSelectedCoupon(coupon);
    setShowQr(true);
  }

  return (
    <div className="flex w-full gap-4">
      {/* first half */}
      <div className="flex h-[65vh] w-[75vw] flex-col rounded-lg border bg-white p-4 shadow-lg">
        {/* Button Bar */}

        <div className="flex justify-between">
          <div className="mb-4 flex gap-2">
            <button className="rounded-lg border-2 border-[#6571FF] px-4 py-2 text-blue-600 hover:bg-blue-100">
              All
            </button>
            <button className="rounded-lg border-2 border-[#6571FF] px-4 py-2 text-blue-600 hover:bg-blue-100">
              Active
            </button>
            <button className="rounded-lg border-2 border-[#6571FF] px-4 py-2 text-blue-600 hover:bg-blue-100">
              Scheduled
            </button>
            <button className="rounded-lg border-2 border-[#6571FF] px-4 py-2 text-blue-600 hover:bg-blue-100">
              Expired
            </button>
          </div>

          <div>
            <NewCoupon/>
            
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
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <tr
                  key={index}
                  onClick={()=>handleCouponQr(coupon)}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#EEF4FF]"}`}
                  style={{ cursor: "pointer" }}
                >
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.couponName}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.code}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.discount}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.startDate}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.status}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {coupon.redemptionCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* second half */}
      <div className="flex h-[65vh] w-[20vw] flex-col rounded-lg border bg-white p-4 shadow-lg">
        <div className="mb-4 w-full font-bold text-xl">Coupon Details</div>
        <div className="flex flex-grow items-center justify-center">
          {showQr && selectedCoupon  ? <QrCodeForCoupon showQr={showQr} coupon={selectedCoupon} /> : "Select a coupon to view details"}
        </div>
      </div>
    </div>
  );
};

export default CuponComponet;
