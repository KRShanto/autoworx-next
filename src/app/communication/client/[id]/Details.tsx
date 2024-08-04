import { tempClients } from "@/lib/tempClients";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const sharedFiles = [
  {
    url: "/icons/image.png",
  },
  {
    url: "/icons/media.png",
  },
  {
    url: "/icons/bar.png",
  },
];
export default function Details({ id }: { id: number }) {
  const user = tempClients.find((user: any) => user.id == id);

  return (
    <div className="app-shadow h-[83vh] w-[50%] rounded-lg bg-white max-[1600px]:w-[40%]">
      {/* Client Heading */}
      <div className="flex items-center justify-between bg-[#006D77]">
        <div className="h-[180px] w-[70%] rounded-lg">
          {/* Header */}
          <h2 className="p-3 text-[16px] text-white">Client Data</h2>
          {/* Content */}
          <div className="flex items-center gap-5 px-5">
            <Image src={user!.image} alt="user" width={110} height={110} />

            <div className="flex flex-col">
              <h2 className="text-[16px] text-white">{user!.name}</h2>
              <p className="text-[16px] text-white">
                Email : client@example.com
              </p>
              <p className="text-[16px] text-white">Phone : 0123456789</p>
            </div>
          </div>
        </div>
        <div className="mr-2 h-full space-y-4 rounded bg-[#63a6ac] p-4 text-white">
          <div className="flex items-center justify-between gap-x-8">
            <div>
              <span className="mr-4 text-lg font-semibold">Vehicle 1</span>
              <span className="text-sm">Year Make Model</span>
            </div>
            <div className="flex items-center gap-2">
              <FaArrowLeft />
              <FaArrowRight />
            </div>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Service Requested :</p>
            <p>Service 1, Service 2, Service 3, Service 4, Service 5</p>
          </div>
        </div>
      </div>

      {/* Client Description */}
      <div className="px-4">
        {/* client notes */}
        <div>
          <h2 className="mt-2 px-5 py-3 text-[16px] text-[#797979]">
            Client Notes
          </h2>
          <p className="rounded-md border border-emerald-600 p-4 text-[16px] text-xs text-[#797979]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
            consequuntur similique at ipsa sapiente non aspernatur dolorum.
            Quia, laboriosam autem ut corrupti officia modi cum saepe ipsam!
            Dignissimos, repudiandae repellendus. Beatae quod quas esse. Lorem
            ipsum dolor sit amet, consectetur adipisicing elit. Sed consequuntur
            similique at ipsa sapiente non aspernatur dolorum. Quia, laboriosam
            autem ut corrupti officia modi cum saepe ipsam! Dignissimos,
            repudiandae repellendus. Beatae quod quas esse.
          </p>
        </div>
        {/* shared files */}
        <div className="flex flex-wrap items-center gap-5">
          {sharedFiles.map((file: any, index: number) => (
            <div
              className="rounded-md border border-emerald-600 p-20"
              key={index}
            >
              <Image width={20} height={20} src={file.url} alt="file" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
