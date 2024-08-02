import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image'; // Assuming you're using Next.js


interface Coupon {
  couponName: string;
  code: string;
  discount: string;
  startDate: string;
  status: string;
  redemptionCount: string;
}
interface CouponQRCodeProps {
  showQr: boolean;
  coupon: Coupon; 
}

const CouponQRCode = ({ showQr, coupon}: CouponQRCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (showQr) {
      const couponUrl = 'https://github.com/Md-AbdullahAl-Noman'; // Replace with your coupon URL
      QRCode.toDataURL(couponUrl)
        .then(url => {
          setQrCodeUrl(url);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [showQr, coupon]);

  return (
    <div className="flex flex-col h-full">
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
        <div>Coupon Name:
         {coupon?coupon.couponName:""}
        </div>
        <div>Coupon Code:
         {coupon.code}
        </div>
        <div>Discount:
         {coupon?coupon.discount:""}
        </div>
        <div>Start Date:
         {coupon?coupon.startDate:""}
        </div>
        <div>End Date:
         {coupon?coupon.startDate:""}
        </div>
        <div>Numer of Times Activated:
         {coupon?coupon.redemptionCount:""}
        </div>
      </div>
    </div>
  );
};

export default CouponQRCode;
