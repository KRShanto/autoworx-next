import { auth } from "@/app/auth";
import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectStatus } from "@/components/Lists/SelectStatus";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { SyncLists } from "@/components/SyncLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { GoFileCode } from "react-icons/go";
import { BillSummary } from "./BillSummary";
import Create from "./Create";
import { CreateEstimateActionsButtons } from "./CreateEstimateActionButtons";
import { CreateTab } from "./tabs/CreateTab";
import { AttachmentTab } from "./tabs/AttachmentTab";

export default async function Page() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const customers = await db.customer.findMany({ where: { companyId } });
  const vehicles = await db.vehicle.findMany({ where: { companyId } });
  const categories = await db.category.findMany({ where: { companyId } });
  const services = await db.service.findMany({ where: { companyId } });
  const materials = await db.material.findMany({ where: { companyId } });
  const labors = await db.labor.findMany({ where: { companyId } });
  const tags = await db.tag.findMany({ where: { companyId } });
  const vendors = await db.vendor.findMany({ where: { companyId } });
  const statuses = await db.status.findMany({ where: { companyId } });

  return (
    <form className="-my-2 grid h-[93vh] gap-3 overflow-clip py-2 md:grid-cols-[1fr,24rem] md:grid-rows-[auto,auto,1fr]">
      <Title>Estimate</Title>

      <SyncLists
        customers={customers}
        vehicles={vehicles}
        categories={categories}
        services={services}
        materials={materials}
        labors={labors}
        tags={tags}
        vendors={vendors}
        statuses={statuses}
      />

      <div className="px-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded border border-solid border-slate-600 p-2 text-center"
        >
          <GoFileCode />
          Convert to Estimate
        </button>
      </div>

      <div className="app-shadow col-start-1 flex flex-wrap items-center gap-3 rounded-md p-3">
        <div className="mr-auto">
          {/* TODO: generate randomly */}
          434534674576:{" "}
          <input
            name="title"
            placeholder="Enter Title..."
            aria-label="title"
            className="bg-transparent"
          />
        </div>

        <CreateEstimateActionsButtons />

        <div className="flex basis-full flex-wrap items-center gap-3">
          <SelectClient />
          <SelectVehicle />
          <SelectStatus />
        </div>
      </div>

      <Tabs
        defaultValue="create"
        className="col-start-1 flex min-h-0  flex-col overflow-clip"
      >
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="attachment">Attachment</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateTab />
        </TabsContent>

        <TabsContent value="attachment">
          <AttachmentTab />
        </TabsContent>
        <TabsContent value="inspections"></TabsContent>
        <TabsContent value="payments"></TabsContent>
      </Tabs>

      <div className="app-shadow col-start-2 row-start-2 row-end-4 grid grid-rows-[1fr,auto,auto] divide-y rounded-md">
        <Create />
        <BillSummary />
      </div>
    </form>
  );
}
