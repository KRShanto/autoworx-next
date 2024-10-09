
type Props = {};

const EmployeeLeaveRequest = (props: Props) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-gray-400 px-4 py-4 text-xs 2xl:flex-row 2xl:items-start 2xl:justify-between">
      <div className="2xl:w-[35%]">
        <p className="font-semibold">Leave Reason</p>
        <p>Employee : John Doe</p>
        <p className="mt-4 font-semibold">Start : 23rd July 2023</p>
        <p className="font-semibold">End : 25th July 2023</p>
      </div>
      <div className="2xl:w-[45%]">
        <p className="font-semibold">Details :</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
          blanditiis rem unde pariatur harum neque ducimus molestiae aliquam
          sequi temporibus, suscipit nostrum, impedit placeat velit!
        </p>
      </div>
      <div className="flex flex-col gap-y-3 text-xs 2xl:w-[15%]">
        <button className="w-full rounded bg-[#6571FF] py-1 text-white">
          Accept
        </button>
        <button className="w-full rounded bg-red-500 py-1 text-white">
          Reject
        </button>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequest;
