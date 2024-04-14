"use client";

import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { usePopupStore } from "../../stores/popup";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { editEmployee } from "./edit";
import { EmployeeDepartment, EmployeeType } from "@prisma/client";
import { useFormErrorStore } from "@/stores/form-error";

export default function EditEmployee() {
  const { data, close } = usePopupStore();
  const { showError } = useFormErrorStore();
  const {
    id,
    name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    employeeType,
    employeeDepartment,
  } = data.employee;

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = parseInt(formData.get("phone") as string);
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zip = formData.get("zip") as string;
    const employeeType = formData.get("employeeType") as EmployeeType;
    const employeeDepartment = formData.get(
      "employeeDepartment",
    ) as EmployeeDepartment;
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const error = (await editEmployee({
      id,
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      employeeType,
      employeeDepartment,
      oldPassword,
      newPassword,
    })) as { message: string; field: string } | void;

    if (error) {
      console.log(error);
      showError(error);
    } else {
      close();
    }
  }

  return (
    <Popup>
      <div className="w-[30rem] px-2 py-3">
        <div className="flex items-center justify-between px-3 py-1">
          <h2 className="text-xl font-bold">Edit Employee</h2>
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
              defaultValue={name}
            />
          </div>
          <div className="mt-2">
            <Input
              type="email"
              className="w-full rounded-md border p-2"
              name="email"
              required
              placeholder="Email"
              defaultValue={email}
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              className="w-full rounded-md border p-2"
              name="phone"
              required
              placeholder="Mobile"
              defaultValue={phone}
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="address"
              required
              className="w-full rounded-md border p-2"
              placeholder="Address"
              defaultValue={address}
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="city"
              required
              className="w-full rounded-md border p-2"
              placeholder="City"
              defaultValue={city}
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="state"
              required
              className="w-full rounded-md border p-2"
              placeholder="State"
              defaultValue={state}
            />
          </div>
          <div className="mt-2">
            <Input
              type="text"
              name="zip"
              required
              className="w-full rounded-md border p-2"
              placeholder="Zip"
              defaultValue={zip}
            />
          </div>

          <div className="mt-2">
            <select
              className="w-full rounded-md border p-2"
              id="employeeType"
              name="employeeType"
              required
              value={employeeType}
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
              value={employeeDepartment}
            >
              <option value="">Select Employee Department</option>
              <option value="Sales">Sales</option>
              <option value="Management">Management</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>

          <div className="mt-2">
            <Input
              type="password"
              name="oldPassword"
              className="w-full rounded-md border p-2"
              placeholder="Old Password"
            />
          </div>

          <div className="mt-2">
            <Input
              type="password"
              name="newPassword"
              className="w-full rounded-md border p-2"
              placeholder="New Password"
            />
          </div>

          <Submit
            className="mx-auto mt-2 block rounded-md bg-blue-500 px-3 py-1 text-white active:scale-95"
            formAction={handleSubmit}
          >
            Update
          </Submit>
        </form>
      </div>
    </Popup>
  );
}
