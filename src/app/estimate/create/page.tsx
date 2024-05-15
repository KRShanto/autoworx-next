import { auth } from "@/app/auth";
import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { SyncLists } from "@/components/SyncLists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import Title from "@/components/Title";
import { db } from "@/lib/db";
import { AuthSession } from "@/types/auth";
import { CreateEstimateActionsButtons } from "./CreateEstimateActionButtons";

export default async function Page() {
  const session = (await auth()) as AuthSession;
  const companyId = session.user.companyId;
  const customers = await db.customer.findMany({ where: { companyId } });
  const vehicles = await db.vehicle.findMany({ where: { companyId } });

  return (
    <div className="grid gap-3 md:grid-cols-[1fr,24rem]">
      <Title>Estimate</Title>
      <SyncLists customers={customers} vehicles={vehicles} />
      <div className="app-shadow col-start-1 mt-5 flex flex-wrap items-center gap-3 rounded-md p-3">
        <div className="mr-auto">
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
        </div>
      </div>
      <Tabs defaultValue="create" className="col-start-1">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="attachment">Attachment</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
        </TabsContent>
        <TabsContent value="attachment"></TabsContent>
        <TabsContent value="inspections"></TabsContent>
        <TabsContent value="payments"></TabsContent>
      </Tabs>
    </div>
  );
}
