"use client";

import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { usePopupStore } from "../../stores/popup";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";
import { editCustomer } from "./edit";
import Input from "@/components/Input";
import Submit from "@/components/Submit";

export default function EditCustomer() {
  const { close, data } = usePopupStore();
  const { showError } = useFormErrorStore();

  const { id, name, email, mobile, address, city, state, zip } = data.customer;

  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const mobile = parseInt(data.get("mobile") as string);
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;

    const error = (await editCustomer({
      id,
      name,
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
          <h2 className="text-xl font-bold">Edit Customer</h2>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>

        <form>
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
              type="text"
              className="w-full rounded-md border p-2"
              name="email"
              required
              placeholder="Email"
              defaultValue={email}
            />
          </div>

          <div className="mt-2">
            <Input
              type="number"
              className="w-full rounded-md border p-2"
              name="mobile"
              required
              placeholder="Mobile"
              defaultValue={mobile.toString()}
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

          <Submit
            formAction={handleSubmit}
            className="mx-auto mt-2 block rounded-md bg-blue-500 px-3 py-1 text-white active:scale-95"
          >
            Update
          </Submit>
        </form>
      </div>
    </Popup>
  );
}
