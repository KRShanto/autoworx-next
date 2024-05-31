"use client";

import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { usePopupStore } from "../../stores/popup";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";
import Submit from "@/components/Submit";
import { addEmployee } from "./add";
import { EmployeeDepartment, EmployeeType } from "@prisma/client";
import Input from "@/components/Input";

export default function AddEmployee() {
  const { close } = usePopupStore();
  const { showError } = useFormErrorStore();

  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;
    const password = data.get("password") as string;
    const employeeType = data.get("employeeType") as EmployeeType;
    const employeeDepartment = data.get(
      "employeeDepartment",
    ) as EmployeeDepartment;

    const error = (await addEmployee({
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      password,
      employeeType,
      employeeDepartment,
    })) as { message: string; field: string } | void;

    if (error) {
      showError(error);
    } else {
      close();
    }
  }

  return (
    <Popup>
      <div className="w-[30rem] px-2 py-3">
        <div className="flex items-center justify-between px-3 py-1">
          <h2 className="text-xl font-bold">Add Employee</h2>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>

        <form className="mt-5">
          <FormError />

          <div className="mt-2">
            <Input
              type="text"
              className="w-full rounded-md border p-2"
              name="name"
              required
              placeholder="Name"
            />
          </div>
          <div className="mt-2">
            <Input
              type="email"
              className="w-full rounded-md border p-2"
              name="email"
              required
              placeholder="Email"
            />
          </div>
          <div className="mt-2">
            <Input
              type="number"
              className="w-full rounded-md border p-2"
              name="phone"
              required
              placeholder="Mobile"
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="address"
              required
              className="w-full rounded-md border p-2"
              placeholder="Address"
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="city"
              required
              className="w-full rounded-md border p-2"
              placeholder="City"
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="state"
              required
              className="w-full rounded-md border p-2"
              placeholder="State"
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="zip"
              required
              className="w-full rounded-md border p-2"
              placeholder="Zip"
            />
          </div>
          <div className="mt-2">
            <Input
              type="password"
              name="password"
              required
              className="w-full rounded-md border p-2"
              placeholder="Password"
            />
          </div>
          <div className="mt-2">
            <select
              className="w-full rounded-md border p-2"
              id="employeeType"
              name="employeeType"
              required
            >
              <option value="">Select Employee Type</option>
              <option value="Salary">Salary</option>
              <option value="Hourly">Hourly</option>
              <option value="Contract Based">Contract Based</option>
            </select>
          </div>
          <div className="mt-2">
            <select
              className="w-full rounded-md border p-2"
              id="employeeDepartment"
              name="employeeDepartment"
              required
            >
              <option value="">Select Employee Department</option>
              <option value="Sales">Sales</option>
              <option value="Management">Management</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>

          <Submit
            formAction={handleSubmit}
            className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
          >
            Add Employee
          </Submit>
        </form>
      </div>
    </Popup>
  );
}
