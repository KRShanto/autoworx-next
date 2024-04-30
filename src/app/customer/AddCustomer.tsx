"use client";

import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { usePopupStore } from "../../stores/popup";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";
import Submit from "@/components/Submit";
import { addCustomer } from "./add";
import Input from "@/components/Input";

export default function AddNewCustomer() {
  const { close } = usePopupStore();
  const { showError } = useFormErrorStore();

  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const mobile = parseInt(data.get("mobile") as string);
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;

    const error = (await addCustomer({
      firstName: name, // TODO: Change to firstName and lastName
      email,
      mobile,
      address,
      city,
      state,
      zip,
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
          <h2 className="text-xl font-bold">Add Customer</h2>
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
              type="text"
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
              name="mobile"
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

          <Submit
            formAction={handleSubmit}
            className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
          >
            Add Customer
          </Submit>
        </form>
      </div>
    </Popup>
  );
}
