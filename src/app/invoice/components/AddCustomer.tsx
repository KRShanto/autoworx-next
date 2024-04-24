import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { useState } from "react";
import { usePopupStore } from "../../../stores/popup";
import { ThreeDots } from "react-loader-spinner";
import { CustomerType } from "@/types/db";
import { useInvoiceStore } from "../../../stores/invoice";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { addCustomer as newCustomer } from "../../customer/add";
import { useFormErrorStore } from "@/stores/form-error";

export default function AddInvoice() {
  const [option, setOption] = useState<"EXISTING_CUSTOMER" | "NEW_CUSTOMER">(
    "EXISTING_CUSTOMER",
  );
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType>();
  const { close, data } = usePopupStore();
  const { setCustomer } = useInvoiceStore();
  const { showError } = useFormErrorStore();
  const customers = data.customers as CustomerType[];

  async function handleSubmit(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const mobile = data.get("mobile") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const state = data.get("state") as string;
    const zip = data.get("zip") as string;

    const error = await newCustomer({
      name,
      email,
      mobile: parseInt(mobile),
      address,
      city,
      state,
      zip,
    });

    if (error && error.field) {
      showError({ field: error.field as string, message: error.message });
    } else {
      setCustomer({
        name,
        email,
        mobile: parseInt(mobile),
        address,
        city,
        state,
        zip,
      });
      close();
    }
  }

  const addCustomer = (customer: any) => {
    if (!customer) return;

    setCustomer(customer);
    close();
  };

  return (
    <Popup>
      <div className="w-[30rem] px-2 py-3">
        <div className="flex items-center justify-between px-3 py-1">
          <h2 className="text-xl font-bold">Add Invoice</h2>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>

        <div className="mt-2 px-3 py-1">
          <div className="flex items-center">
            <button
              className={`w-1/2 rounded-md px-2 py-1 ${
                option === "EXISTING_CUSTOMER"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-gray-500"
              }`}
              onClick={() => setOption("EXISTING_CUSTOMER")}
            >
              Existing Customer
            </button>
            <button
              className={`w-1/2 rounded-md px-2 py-1 ${
                option === "NEW_CUSTOMER"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-gray-500"
              }`}
              onClick={() => setOption("NEW_CUSTOMER")}
            >
              New Customer
            </button>
          </div>

          {option === "EXISTING_CUSTOMER" && (
            <div>
              <div className="mt-2">
                <label className="block text-sm">Customer</label>
                <select
                  className="w-full"
                  onChange={(e) =>
                    setSelectedCustomer(
                      customers.find(
                        (customer) => customer.id === parseInt(e.target.value),
                      ),
                    )
                  }
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                      {` - ${customer.email}`}
                    </option>
                  ))}
                </select>
                <button
                  className="mx-auto mt-2 block rounded-md bg-blue-500 px-3 py-1 text-white active:scale-95"
                  onClick={() => addCustomer(selectedCustomer)}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {option === "NEW_CUSTOMER" && (
            <form>
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
                  type="text"
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
                className="mx-auto mt-2 block rounded-md bg-blue-500 px-3 py-1 text-white active:scale-95"
                formAction={handleSubmit}
              >
                Save
              </Submit>
            </form>
          )}
        </div>
      </div>
    </Popup>
  );
}
