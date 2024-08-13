"use client";
import React from "react";

type Props = {};

const DownloadPDF = (props: Props) => {
  return (
    <button
      onClick={() => {
        window.print();
      }}
      className="print:hidden"
    >
      Download PDF
    </button>
  );
};

export default DownloadPDF;
