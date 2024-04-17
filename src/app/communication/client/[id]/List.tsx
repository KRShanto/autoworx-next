import Link from "next/link";
import { cn } from "@/lib/cn";
import { tempClients } from "@/lib/tempClients";
import Image from "next/image";

// TODO: use layout for this component
export default function List({ id }: { id: number }) {
  return (
    <div className="app-shadow h-[83vh] w-[20%] rounded-lg bg-white p-3">
      {/* Header */}
      <h2 className="text-[14px] text-[#797979]">Client List</h2>

      {/* Search */}
      <form>
        <input
          type="text"
          placeholder="Search here..."
          className="my-3 mr-2 rounded-md border-none p-2 text-[12px] text-[#797979] max-[1822px]:w-full"
        />
        <button
          type="submit"
          className="h-[26px] w-[62px] rounded-md bg-[#797979] text-[12px] text-white"
        >
          Filter
        </button>
      </form>

      {/* List */}
      <div className="mt-2 flex h-[87%] flex-col gap-2 overflow-y-auto max-[1835px]:h-[82%]">
        {tempClients.map((user: any) => {
          const selected = id == user.id;

          return (
            <Link
              key={user.id}
              className={cn(
                "flex items-center gap-2 rounded-md p-3",
                selected ? "bg-[#006D77]" : "bg-[#F2F2F2]",
              )}
              href={`/communication/client/${user.id}`}
            >
              <Image
                src={user.image}
                alt={user.name}
                width={60}
                height={60}
                className="rounded-full max-[1400px]:h-[40px] max-[1400px]:w-[40px]"
              />
              <div className="flex flex-col">
                <p
                  className={cn(
                    "text-[14px] font-bold",
                    selected ? "text-white" : "text-[#797979]",
                  )}
                >
                  {user.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
