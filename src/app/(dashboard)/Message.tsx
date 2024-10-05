import Image from "next/image";

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

export default Message;
