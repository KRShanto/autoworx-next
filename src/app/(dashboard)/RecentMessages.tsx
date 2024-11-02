import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

const RecentMessages = () => {
  return (
    <div className="flex h-[82vh] flex-col rounded-md p-6 shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xl font-bold">Recent Messages</span>{" "}
        <span>
          <FaExternalLinkAlt />
        </span>
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col text-sm">
        <input
          className="mb-4 w-full rounded border border-[#03A7A2] px-4 py-2"
          type="text"
          placeholder="Search messages"
        />
        <div className="custom-scrollbar flex flex-1 flex-col items-center justify-center space-y-4 self-center">
          {new Array(10).fill(0).map((_, idx) => (
            <Message key={idx} />
          ))}
          {[0].length === 0 && (
            <span className="text-center">You have no recent messages</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Message = () => {
  return (
    <div className="flex flex-col gap-x-2 rounded border p-2 px-2 xl:flex-row xl:items-start">
      <Image width={60} height={60} src="/images/default.png" alt="" />
      <div>
        <p className="font-semibold">John Doe</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          libero suscipit modi ex officia. Blanditiis.
        </p>
      </div>
    </div>
  );
};

export default RecentMessages;
