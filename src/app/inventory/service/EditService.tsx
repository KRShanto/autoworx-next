"use client";

import { FaTimes } from "react-icons/fa";
import Popup from "@/components/Popup";
import { usePopupStore } from "@/stores/popup";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Submit from "@/components/Submit";
import { editService } from "./edit";
import { useFormErrorStore } from "@/stores/form-error";
import { useEffect, useState } from "react";

export default function EditService() {
  const { data, close } = usePopupStore();
  const { showError } = useFormErrorStore();

  const id = data.service.id;
  const [name, setName] = useState(data.service.name);
  const [description, setDescription] = useState(data.service.description);
  const [price, setPrice] = useState(parseFloat(data.service.price));
  const [quantity, setQuantity] = useState(parseInt(data.service.quantity));
  const [discount, setDiscount] = useState(parseFloat(data.service.discount));
  const [total, setTotal] = useState(parseFloat(data.service.total));

  // calculate total
  useEffect(() => {
    if (price === null || quantity === null || discount === null) return;

    const total = price * quantity - discount;
    setTotal(total);
  }, [price, quantity, discount]);

  async function handleSubmit() {
    const error = (await editService({
      id,
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
          <h2 className="text-xl font-bold">Edit Service</h2>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>

          <div className="mt-2">
            <Input
              type="text"
              className="w-full rounded-md border p-2"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          <div className="mt-2">
            <Input
              type="number"
              className="w-full rounded-md border p-2"
              name="price"
              required
              value={price!}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Price"
            />
          </div>

          <div className="mt-2">
            <Input
              type="number"
              className="w-full rounded-md border p-2"
              name="quantity"
              required
              value={quantity!}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              placeholder="Quantity"
            />
          </div>

          <div className="mt-2">
            <Input
              type="number"
              className="w-full rounded-md border p-2"
              name="discount"
              required
              value={discount!}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              placeholder="Discount"
            />
          </div>

          <div className="mt-2">
            <Input
              type="text"
              className="w-full rounded-md border p-2"
              name="total"
              required
              value={total!}
              onChange={(e) => setTotal(parseFloat(e.target.value))}
              placeholder="Total"
            />
          </div>

          <Submit
            className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
            formAction={handleSubmit}
          >
            Update
          </Submit>
        </form>
      </div>
    </Popup>
  );
}
