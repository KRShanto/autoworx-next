"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { QrReader } from "react-qr-reader";

// qr code scannar page
export default function Page() {
  const [result, setResult] = useState<any>(null);
  const router = useRouter();
  const qrRef: any = useRef(null);

  const handleScan = (result: any, error: any) => {
    if (!!result) {
      setResult(result?.text);
      router.push(result?.text);
      qrRef?.current?.stop();
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Scan QR Code</h1>

      {result ? (
        <h2>Redirecting to {result.text}</h2>
      ) : (
        <>
          <QrReader
            className="h-[300px] w-[300px] lg:h-[400px] lg:w-[400px]"
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            // @ts-ignore
            style={{ width: "40%", height: "40%" }}
            ref={qrRef}
          />
        </>
      )}
    </div>
  );
}
