"use client";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  InterceptedDialog,
} from "@/components/Dialog";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { SelectStatus } from "../../components/Lists/SelectStatus";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Status, Technician, User } from "@prisma/client";
import { addTechnician } from "./@modal/(.)view/[id]/actions/addTechnician";
import { useRouter } from "next/navigation";
import moment from "moment";
import { updateTechnician } from "./@modal/(.)view/[id]/actions/updateTechnician";
type TPriority = string;
type TEmployee = Partial<User>;
const priorities: TPriority[] = ["Low", "Medium", "High"];
type TechnicianPayload = {
  serviceId: number;
  date: string;
  due: string;
  amount: number;
  note: string;
  userId: number | undefined;
  priority: string;
  status: string | undefined;
  statusColor: string | undefined;
  materialId: number | undefined;
  workOrderId: number | undefined;
};
export default function CreateAndEditLabor({
  employees,
  serviceId,
  technician,
  materialId: materialId,
  workOrderId,
}: {
  employees: {
    id: number;
    name: string;
  }[];
  serviceId: string;
  materialId?: string;
  workOrderId?: string;
  technician?: Technician;
}) {
  const router = useRouter();
  const [statusOpenDropdown, setStatusOpenDropdown] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employee, setEmployee] = useState<TEmployee | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({
    date: "",
    due: "",
    amount: "",
    note: "",
  });
  const [priority, setPriority]: [
    TPriority,
    Dispatch<SetStateAction<TPriority>>,
  ] = useState<TPriority>(priorities[0]);
  // edit technician
  useEffect(() => {
    if (technician) {
      const { amount, date, due, note, priority, status, statusColor, userId } =
        technician;
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const formattedDue = moment(due).format("YYYY-MM-DD");
      setInputValues({
        date: formattedDate,
        due: formattedDue,
        amount: amount?.toString() as string,
        note: note as string,
      });
      setPriority(priority as string);
      setEmployee(employees.find((e) => e.id === userId) as TEmployee);
    }
  }, [technician]);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    if (name === "amount" && parseInt(value) <= 0) {
      setError("Amount must be greater than zero");
      return;
    } else if (
      name === "amount" &&
      value !== "" &&
      Number.isNaN(parseInt(value))
    ) {
      setError("Amount must be a number");
      return;
    } else {
      setError(null);
      setInputValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  console.log(status);
  // form submit
  const handleSubmit: (
    event: MouseEvent<HTMLButtonElement>,
  ) => Promise<void> = async (event) => {
    setError(null);
    try {
      // await (laborId ? updateLabor(laborId, payload) : createLabor(payload));
      if (technician) {
        const updatedPayload = {
          ...technician,
          date: new Date(inputValues.date).toISOString(),
          due: new Date(inputValues.due).toISOString(),
          amount: Number(inputValues.amount),
          note: inputValues.note,
          userId: employee?.id,
          status: status?.name || technician.status,
          statusColor: status?.bgColor || technician.statusColor,
          priority,
        };
        const response = await updateTechnician(
          technician.id,
          updatedPayload as Technician & TechnicianPayload,
        );
        if (response.type === "success") {
          router.back();
        }
      } else {
        const payload = {
          serviceId: Number(serviceId),
          date: new Date(inputValues.date).toISOString(),
          due: new Date(inputValues.due).toISOString(),
          amount: Number(inputValues.amount),
          note: inputValues.note,
          userId: employee?.id,
          priority,
          status: status?.name,
          statusColor: status?.bgColor,
          materialId: Number(materialId),
          workOrderId: Number(workOrderId),
        };
        const response = await addTechnician(
          payload as Technician & TechnicianPayload,
        );
        if (response.type === "success") {
          router.back();
        }
      }
    } catch (error) {
      setError("Failed to update labor");
    }
  };
  const date = moment(technician?.createdAt);
  const formattedDate = date.format("h:mmA Do MMMM YYYY");
  return (
    <InterceptedDialog>
      <DialogContent>
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          {/* Assigned by */}
          <div>
            <label>Assigned by</label>
            <Selector
              label={(employee) =>
                employee?.name ? employee.name : "Employee"
              }
              newButton={<div></div>}
              items={employees}
              displayList={(employee: TEmployee) => <p>{employee.name}</p>}
              onSearch={(search: string) =>
                employees.filter((employee) =>
                  employee.name.toLowerCase().includes(search.toLowerCase()),
                )
              }
              openState={[employeeOpen, setEmployeeOpen]}
              selectedItem={employee}
              //@ts-ignore
              setSelectedItem={setEmployee}
            />
          </div>
          <SlimInput
            value={inputValues.date}
            onChange={handleChange}
            label="Assigned Date"
            name="date"
            type="date"
          />
          <SlimInput
            onChange={handleChange}
            value={inputValues.due}
            label="Due Date"
            name="due"
            type="date"
          />
          <SlimInput
            onChange={handleChange}
            value={inputValues.amount}
            label="Amount"
            name="amount"
          />
          <div>
            <label>Priority</label>

            <Selector
              label={(priority) => (priority ? priority : "Priority")}
              items={priorities}
              displayList={(priority: TPriority) => <p>{priority}</p>}
              onSearch={(search: string) =>
                priorities.filter((priority) =>
                  priority.toLowerCase().includes(search.toLowerCase()),
                )
              }
              openState={[priorityOpen, setPriorityOpen]}
              selectedItem={priority}
              //@ts-ignore
              setSelectedItem={setPriority}
            />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <SelectStatus
              value={status}
              //@ts-ignore
              setValue={setStatus}
              open={statusOpenDropdown}
              setOpen={setStatusOpenDropdown}
            />
          </div>
        </div>
        <div>
          <label htmlFor="note">New Note</label>
          <textarea
            onChange={handleChange}
            value={inputValues.note}
            name="note"
            className="h-32 w-full resize-none rounded-md border-2 border-slate-400 p-2 outline-none"
          />
        </div>
        {technician && (
          <div>
            <div className="flex justify-between">
              <p className="text-left text-lg font-bold">Work Note</p>
              <p className="text-right text-lg font-bold">Status</p>
            </div>
            <div className="flex justify-between bg-blue-100 p-3">
              <div className="w-3/5 space-y-2">
                <p>Date: {formattedDate}</p>
                <p>{technician?.note || "No notes"}</p>
              </div>
              <div>
                <p
                  className={`rounded-full px-2 py-1 text-black`}
                  style={{ backgroundColor: technician?.statusColor as string }}
                >
                  {technician?.status}
                </p>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          {technician ? (
            <button
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              onClick={handleSubmit}
            >
              Update
            </button>
          ) : (
            <button
              className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
              onClick={handleSubmit}
            >
              Add
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </InterceptedDialog>
  );
}
