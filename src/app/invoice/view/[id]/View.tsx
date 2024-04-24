"use client";

import { usePDF } from "react-to-pdf";
import Header from "./Header";
import InvoiceComponent from "./Invoice";
import WorkOrderComponent from "./WorkOrder";
import { Invoice } from "@prisma/client";

export default function View({
  invoice,
  customer,
  setting,
  vehicle,
  services,
  workOrders,
}: {
  invoice: Invoice;
  customer: any;
  setting: any;
  vehicle: any;
  services: any;
  workOrders: any;
}) {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <div>
      <div>
        <Header invoice={invoice} toPDF={toPDF} />

        <div className="flex flex-row gap-7 max-[1500px]:flex-col max-[1500px]:items-center max-[1500px]:gap-0">
          <InvoiceComponent
            invoice={invoice}
            customer={customer!}
            setting={setting!}
            vehicle={vehicle!}
            services={services}
            targetRef={targetRef}
          />

          <WorkOrderComponent
            workOrders={workOrders}
            invoice={invoice}
            customer={customer!}
          />
        </div>
      </div>
    </div>
  );
}
