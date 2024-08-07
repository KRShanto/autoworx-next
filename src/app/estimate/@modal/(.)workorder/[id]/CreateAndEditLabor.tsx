"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  InterceptedDialog,
} from "@/components/Dialog";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { SelectStatus } from "../../../../../components/Lists/SelectStatus";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Priority, Status, Technician, User } from "@prisma/client";
import { addTechnician } from "../../../../../actions/estimate/technician/addTechnician";
import { useRouter } from "next/navigation";
import moment from "moment";
import { updateTechnician } from "../../../../../actions/estimate/technician/updateTechnician";
import { getEmployees } from "@/actions/employee/get";
import { getTechnician } from "@/actions/estimate/technician/getTechnician";
import { WORK_ORDER_STATUS_COLOR } from "@/lib/consts";

export default function CreateAndEditLabor({
  invoiceId,
  serviceId,
  technician,
  setTechnicians,
}: {
  invoiceId: string;
  serviceId: number;
  technician?: Technician & { name: string };
  setTechnicians: Dispatch<SetStateAction<(Technician & { name: string })[]>>;
}) {
  const [open, setOpen] = useState(false);
  // const [statusOpenDropdown, setStatusOpenDropdown] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const [employeeList, setEmployeeList] = useState<User[]>([]);

  const [employee, setEmployee] = useState<User | null>(null);
  const [status, setStatus] = useState<
    "Pending" | "In Progress" | "Complete" | "Cancel"
  >("Pending");
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({
    date: new Date().toISOString().split("T")[0],
    due: "",
    amount: "",
    note: "",
  });
  const [priority, setPriority] = useState<Priority>("Low");

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getEmployees();
      setEmployeeList(employees);
    };
    fetchEmployees();
  }, []);

  // edit technician
  useEffect(() => {
    if (technician) {
      const { amount, date, due, note, priority, userId } = technician;
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const formattedDue = moment(due).format("YYYY-MM-DD");
      setInputValues({
        date: formattedDate,
        due: formattedDue,
        amount: amount?.toString() as string,
        note: note as string,
      });
      setPriority(priority as Priority);
      // TODO: set status
      setEmployee(employeeList.find((e) => e.id === userId) || null);
    }
  }, [technician, employeeList]);

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

  // form submit
  const handleSubmit = async (event: MouseEvent) => {
    setError(null);

    if (!employee) {
      setError("Employee is required");
      return;
    }

    try {
      if (technician) {
        const updatedPayload = {
          date: new Date(inputValues.date),
          due: new Date(inputValues.due),
          amount: Number(inputValues.amount),
          note: inputValues.note,
          userId: employee?.id,
          status,
          priority,
          invoiceId,
          serviceId,
        };

        const response = await updateTechnician(technician.id, updatedPayload);

        if (response.type === "success") {
          setOpen(false);
          // @ts-ignore
          setTechnicians((prev) =>
            prev.map((tech) =>
              tech.id === technician.id ? response.data : tech,
            ),
          );
        }
      } else {
        const payload = {
          serviceId: Number(serviceId),
          date: new Date(inputValues.date),
          due: new Date(inputValues.due),
          amount: Number(inputValues.amount),
          note: inputValues.note,
          userId: employee?.id,
          priority,
          status,
          invoiceId,
        };
        const response = await addTechnician(payload);
        if (response.type === "success") {
          setOpen(false);
          setTechnicians((prev) => [...prev, response.data]);
        }
      }
    } catch (error) {
      setError("Failed to update labor");
    }
  };
  const date = moment(technician?.createdAt);
  const formattedDate = date.format("h:mmA Do MMMM YYYY");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {technician ? (
          <p className="text-white">{technician.name}</p>
        ) : (
          <button className="rounded-full border border-[#6571FF] px-3 py-0.5">
            + Add Labor
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-bold">
          {technician ? "Edit Technician" : "Assign Technician"}
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          {/* Assigned by */}
          <div>
            <label>Assign To</label>
            <Selector
              label={(employee) =>
                employee?.name ? employee.name : "Employee"
              }
              newButton={<div></div>}
              items={employeeList}
              displayList={(employee: User) => <p>{employee.name}</p>}
              onSearch={(search: string) =>
                employeeList.filter((employee) =>
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
              items={["Low", "Medium", "High"]}
              displayList={(priority: Priority) => <p>{priority}</p>}
              openState={[priorityOpen, setPriorityOpen]}
              selectedItem={priority}
              //@ts-ignore
              setSelectedItem={setPriority}
            />
          </div>
          {/* <div>
            <label htmlFor="status">Status</label>
            <SelectStatus
              value={status}
              //@ts-ignore
              setValue={setStatus}
              open={statusOpenDropdown}
              setOpen={setStatusOpenDropdown}
            />
          </div> */}
          <div>
            <label htmlFor="status">Status</label>
            {/* TODO: use better UI */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="cursor-pointer rounded-md border-2 border-slate-400 p-2 outline-none"
              id="status"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Cancel">Cancel</option>
            </select>
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
                  className={`rounded-full px-2 py-1 text-white`}
                  style={{
                    backgroundColor:
                      WORK_ORDER_STATUS_COLOR[technician?.status as string],
                  }}
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
    </Dialog>
  );
}
