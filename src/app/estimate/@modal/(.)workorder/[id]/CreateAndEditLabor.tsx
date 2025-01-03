"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/Dialog";
import Selector from "@/components/Selector";
import { SlimInput } from "@/components/SlimInput";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Priority, Status, Technician, User } from "@prisma/client";
import { addTechnician } from "../../../../../actions/estimate/technician/addTechnician";
import moment from "moment";
import { updateTechnician } from "../../../../../actions/estimate/technician/updateTechnician";
import { getEmployees } from "@/actions/employee/get";
import { DropdownSelection } from "@/components/DropDownSelection";
import { errorHandler } from "@/error-boundary/globalErrorHandler";

type TProps = {
  invoiceItemId: number;
  invoiceId: string;
  serviceId: number;
  technician?: Technician & { name: string };
  setTechnicians: Dispatch<SetStateAction<(Technician & { name: string })[]>>;
};

type TStatus = "Pending" | "In Progress" | "Complete" | "Cancel";

export default function CreateAndEditLabor({
  invoiceItemId,
  invoiceId,
  serviceId,
  technician,
  setTechnicians,
}: TProps) {
  const [open, setOpen] = useState(false);
  // const [statusOpenDropdown, setStatusOpenDropdown] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const [employeeList, setEmployeeList] = useState<User[]>([]);
  const [pending, startTransition] = useTransition();

  const [employee, setEmployee] = useState<User | null>(null);
  const [status, setStatus] = useState<TStatus>("Pending");
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
      const employees = await getEmployees({});
      setEmployeeList(employees);
    };
    fetchEmployees();
  }, []);

  // edit technician
  useEffect(() => {
    if (technician) {
      const {
        amount,
        date,
        due,
        note,
        priority,
        userId,
        status: technicianStatus,
      } = technician;
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
      setStatus(technicianStatus as TStatus);
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
  const handleSubmit = async () => {
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

        console.log({ updatedPayload });

        const response = await updateTechnician(technician.id, updatedPayload);

        if (response.type === "success") {
          setOpen(false);
          // @ts-ignore
          setTechnicians((prev) =>
            prev.map((tech) =>
              tech.id === technician.id ? response.data : tech,
            ),
          );
        } else if (response.type === "globalError") {
          setError(
            response?.errorSource?.length
              ? response.errorSource[0].message
              : response.message,
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
          invoiceItemId,
        };
        console.log({ payload });
        const response = await addTechnician(payload);
        if (response.type === "success") {
          setOpen(false);
          setTechnicians((prev) => [...prev, response.data]);
        } else if (response.type === "globalError") {
          setError(
            response?.errorSource?.length
              ? response.errorSource[0].message
              : response.message,
          );
        }
      }
    } catch (error) {
      const formattedError = errorHandler(error);
      setError(
        formattedError?.errorSource?.length
          ? formattedError.errorSource[0].message
          : formattedError.message,
      );
    }
  };
  const date = moment(technician?.createdAt);
  const formattedDate = date.format("h:mmA Do MMMM YYYY");

  // reset input value
  const reset = () => {
    setInputValues({
      date: new Date().toISOString().split("T")[0],
      due: "",
      amount: "",
      note: "",
    });
    setStatus("Pending");
    setPriority("Low");
    setError("");
    setEmployee(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {technician ? (
          <p className="text-white">{technician.name}</p>
        ) : (
          <button
            onClick={reset}
            className="rounded-full border border-[#6571FF] px-3 py-0.5"
          >
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
                employee?.firstName ? `${employee.firstName}` : "Employee"
              }
              newButton={<div></div>}
              items={employeeList}
              displayList={(employee: User) => (
                <p>
                  {employee.firstName} {employee.lastName}
                </p>
              )}
              onSearch={(search: string) =>
                employeeList.filter((employee) =>
                  `${employee.firstName} ${employee.lastName}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
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
          <div>
            <label htmlFor="status">Status</label>
            {/* TODO: use better UI */}
            <DropdownSelection
              dropDownValues={["Pending", "In Progress", "Complete", "Cancel"]}
              onValueChange={(value) => setStatus(value as any)}
              changesValue={status}
              buttonClassName="cursor-pointer rounded-md border-2 border-slate-400 p-2 outline-none w-full py-2"
            />
            {/* <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="cursor-pointer rounded-md border-2 border-slate-400 p-2 outline-none"
              id="status"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Cancel">Cancel</option>
            </select> */}
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
              {/* <p className="text-right text-lg font-bold">Status</p> */}
            </div>
            <div className="flex justify-between bg-blue-100 p-3">
              <div className="w-3/5 space-y-2">
                <p>Date: {formattedDate}</p>
                <p>{technician?.note || "No notes"}</p>
              </div>
              {/* TODO: This section now doesn't need */}
              {/* <div>
                <p
                  className={`rounded-full px-2 py-1 text-white`}
                  style={{
                    backgroundColor:
                      WORK_ORDER_STATUS_COLOR[technician?.status as string],
                  }}
                >
                  {technician?.status}
                </p>
              </div> */}
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <button
            disabled={pending}
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white disabled:bg-gray-400"
            onClick={() => startTransition(handleSubmit)}
          >
            {technician ? "Update" : "Add"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
