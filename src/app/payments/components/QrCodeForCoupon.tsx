import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Coupon } from "@prisma/client";
import moment from "moment";

interface CouponQRCodeProps {
  showQr: boolean;
  coupon: Coupon;
}

const CouponQRCode = ({ showQr, coupon }: CouponQRCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (showQr) {
      const couponUrl = `${window.location.origin}/greetings`; // TODO Replace with your coupon URL
      QRCode.toDataURL(couponUrl)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [showQr, coupon]);
  const discountSign = coupon.discountType === "Fixed" ? "$" : "%";
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-4">
        {/* QR Code Section */}
        <div className="flex flex-col items-start">
          <div style={{ fontSize: "20px", color: "gray" }}>Coupon QR:</div>
          {showQr && qrCodeUrl && (
            <Image
              width={200}
              height={200}
              src={qrCodeUrl}
              alt="Coupon QR Code"
            />
          )}
        </div>

        {/*  coupon details or content */}
        <div>Coupon Name: {coupon ? coupon.name : ""}</div>
        <div>Coupon Code: {coupon.code}</div>
        <div>
          Discount: {Number(coupon.discount)}
          {discountSign}
        </div>
        <div>Start Date: {moment(coupon.startDate).format("DD/MM/YYYY")}</div>
        <div>End Date: {moment(coupon.endDate).format("DD/MM/YYYY")}</div>
        <div>Numer of Times Activated: {coupon.redemptions}</div>
      </div>
    </div>
  );
};

export default CouponQRCode;
