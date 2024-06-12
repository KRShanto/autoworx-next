"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
// @ts-ignore
import QrReader from "react-qr-scanner";

// qr code scannar page
export default function Page() {
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  async function handleScan(data: any) {
    if (data) {
      setResult(data);
      router.push(data.text);
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Scan QR Code</h1>

      {result ? (
        <h2>Redirecting to {result.text}</h2>
      ) : (
          <QrReader
          delay={300}
          style={{ width: 320, height: 240 }}
          onError={(err: any) => console.error(err)}
          onScan={handleScan}
        />
      )}
    </div>
  );
}
