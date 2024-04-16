import Image from "next/image";
import { tempClients } from "@/lib/tempClients";

export default function Details({ id }: { id: number }) {
  const user = tempClients.find((user: any) => user.id == id);

  return (
    <div className="app-shadow h-[83vh] w-[50%] rounded-lg bg-white max-[1400px]:w-[40%]">
      {/* Client Heading */}
      <div className="h-[180px] w-full rounded-lg bg-[#006D77]">
        {/* Header */}
        <h2 className="p-3 text-[14px] text-white">Client Data</h2>
        {/* Content */}
        <div className="flex items-center gap-5 px-5">
          <Image src={user!.image} alt="user" width={110} height={110} />

          <div className="flex flex-col">
            <h2 className="text-[14px] text-white">{user!.name}</h2>
            <p className="text-[14px] text-white">{user!.company}</p>
          </div>
        </div>
      </div>

      {/* Client Description */}
      <div>
        <h2 className="mt-2 px-5 py-3 text-[14px] text-[#797979]">
          Client Details
        </h2>
        <p className="px-7 text-[14px] text-[#797979]">
          {user ? user.description : ""}
        </p>
      </div>
    </div>
  );
}
