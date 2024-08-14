"use client";
import React from "react";
import "./test.css";
type Props = {};

const DownloadPDF = (props: Props) => {
  return (
    <button
      onClick={() => {
        setTimeout(() => {
          window.print();
        }, 500); // Delays printing to ensure styles are applied
      }}
      className="print:hidden"
    >
      Download PDF
    </button>
  );
};

export default DownloadPDF;
