import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

const RecentMessages = ({ fullHeight = false }: { fullHeight?: boolean }) => {
  return (
    <div
      className={`"flex ${fullHeight ? "h-full" : "h-[82vh]"} shadow-lg" flex-col rounded-md p-6`}
    >
      <div className="mb-4 flex h-[15%] items-center justify-between">
        <span className="text-xl font-bold">Recent Messages</span>{" "}
        <span>
          <FaExternalLinkAlt />
        </span>
      </div>
      <div className="#custom-scrollbar flex h-[85%] flex-1 flex-col text-sm">
        <input
          className="mb-4 h-[10%] w-full rounded border border-[#03A7A2] px-4 py-2"
          type="text"
          placeholder="Search messages"
        />
        <div className="custom-scrollbar #justify-center flex h-[90%] flex-1 flex-col items-center space-y-4 self-center">
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
