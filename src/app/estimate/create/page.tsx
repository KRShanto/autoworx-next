import { auth } from "@/app/auth";
import { SelectClient } from "@/components/Lists/SelectClient";
import { SelectVehicle } from "@/components/Lists/SelectVehicle";
import { SyncLists } from "@/components/SyncLists";
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
    <>
      <Title>Estimate</Title>
      <SyncLists customers={customers} vehicles={vehicles} />
      <div className="app-shadow mt-5 flex flex-wrap items-center gap-3 rounded-md p-3">
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
        <div className="basis-full flex flex-wrap items-center gap-3">
          <SelectClient />
          <SelectVehicle />
        </div>
      </div>
    </>
  );
}
