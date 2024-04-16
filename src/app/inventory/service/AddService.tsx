"use client";

import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { usePopupStore } from "@/stores/popup";
import FormError from "@/components/FormError";
import { useEffect, useState } from "react";
import { useFormErrorStore } from "@/stores/form-error";
import Submit from "@/components/Submit";
import { addService } from "./add";

export default function AddService() {
  const { close } = usePopupStore();
  const { showError } = useFormErrorStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // calculate total
  useEffect(() => {
    if (price === null || quantity === null || discount === null) return;
    if (!price) return;

    const total = price * (quantity ? quantity : 1) - (discount ? discount : 0);
    setTotal(total);
  }, [price, quantity, discount]);

  async function handleSubmit(data: FormData) {
    const error = (await addService({
      name,
      description,
      price,
      quantity,
      discount,
      total,
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
          <h2 className="text-xl font-bold">Add Service</h2>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>

        <form className="mt-5">
          <FormError />

          <div className="mt-2">
            <input
              type="text"
              className="w-full rounded-md border p-2"
              name="name"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <input
              type="text"
              className="w-full rounded-md border p-2"
              name="description"
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <input
              type="number"
              className="w-full rounded-md border p-2"
              name="price"
              placeholder="Price"
              required
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>

          <div className="mt-2">
            <input
              type="number"
              className="w-full rounded-md border p-2"
              name="quantity"
              placeholder="Quantity"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <div className="mt-2">
            <input
              type="number"
              className="w-full rounded-md border p-2"
              name="discount"
              placeholder="Discount"
              required
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
            />
          </div>

          <div className="mt-2">
            <input
              type="number"
              className="w-full rounded-md border p-2"
              name="total"
              placeholder="Total"
              required
              value={total}
              onChange={(e) => setTotal(parseFloat(e.target.value))}
            />
          </div>

          <Submit
            className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
            formAction={handleSubmit}
          >
            Add Service
          </Submit>
        </form>
      </div>
    </Popup>
  );
}
