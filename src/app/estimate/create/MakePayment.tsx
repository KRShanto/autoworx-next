import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { FaRegCreditCard } from "react-icons/fa6";
import Image from "next/image";
import { SlimInput } from "@/components/SlimInput";
import Selector from "@/components/Selector";
import { useListsStore } from "@/stores/lists";
import { cn } from "@/lib/cn";
import { newPaymentMethod } from "./actions/newPaymentMethod";
import { CardType, PaymentMethod, PaymentType } from "@prisma/client";
import { newPayment } from "./actions/newPayment";

function TabTrigger({
  value,
  children,
  tab,
}: {
  value: string;
  children: React.ReactNode;
  tab: string;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="flex items-center gap-1 rounded-md bg-[#6571FF] p-1 px-5 text-white transition-all"
      style={{
        backgroundColor: tab === value ? "#6571FF" : "transparent",
        border: tab === value ? "none" : "1px solid #6571FF",
        color: tab === value ? "white" : "#6571FF",
      }}
    >
      {children}
    </Tabs.Trigger>
  );
}

export default function MakePayment() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("card");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [paymentMethodInput, setpaymentMethodInput] = useState("");
  const { paymentMethods } = useListsStore();

  async function handleSubmit(formData: FormData) {
    // common
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    // card
    const card = formData.get("card") as string;
    const cardType = formData.get("cardType") as string;

    // check
    const check = formData.get("check") as string;

    // cash
    const cash = formData.get("cash") as string;

    // other
    const amount = formData.get("amount") as string;

    const res = await newPayment({
      type: tab.toUpperCase() as PaymentType,
      date,
      notes,
      additionalData: {
        creditCard: card,
        cardType: cardType
          ? (cardType.toUpperCase() as CardType)
          : "MASTERCARD",
        checkNumber: check,
        receivedCash: Number(cash),
        paymentMethodId: paymentMethod?.id,
        amount: Number(amount),
      },
    });

    if (res.type === "success") {
      setOpen(false);
    }
  }

  async function handleNewPaymentMethod() {
    const res = await newPaymentMethod(paymentMethodInput);

    if (res.type === "success") {
      setpaymentMethodInput("");

      useListsStore.setState({
        paymentMethods: [...paymentMethods, res.data],
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-md bg-white p-2 text-[#006d77]"
        >
          Make Payment
        </button>
      </DialogTrigger>

      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <Tabs.Root className="mt-5" value={tab} onValueChange={setTab}>
            <Tabs.List className="flex justify-between">
              <TabTrigger value="card" tab={tab}>
                <FaRegCreditCard />
                Card
              </TabTrigger>

              <TabTrigger value="check" tab={tab}>
                <Image
                  src={
                    tab === "check"
                      ? "/icons/CheckWhite.svg"
                      : "/icons/Check.svg"
                  }
                  alt="Check icon"
                  width={20}
                  height={20}
                />
                Check
              </TabTrigger>

              <TabTrigger value="cash" tab={tab}>
                <Image
                  src={
                    tab === "cash" ? "/icons/CashWhite.svg" : "/icons/Cash.svg"
                  }
                  alt="Cash icon"
                  width={20}
                  height={20}
                />
                Cash
              </TabTrigger>

              <TabTrigger value="other" tab={tab}>
                Other
              </TabTrigger>
            </Tabs.List>

            <Tabs.Content value="card">
              <div className="mt-5 flex justify-between gap-3">
                <div>
                  <SlimInput name="date" type="date" />
                </div>

                <div className="w-full">
                  <SlimInput
                    name="card"
                    type="text"
                    label="Credit Card (Last 4 digits)"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-5">
                <div className="flex items-center gap-1">
                  <input type="radio" id="mastercard" name="cardType" />
                  <label htmlFor="mastercard">Mastercard</label>
                </div>

                <div className="flex items-center gap-1">
                  <input type="radio" id="visa" name="cardType" />
                  <label htmlFor="visa">Visa</label>
                </div>

                <div className="flex items-center gap-1">
                  <input type="radio" id="amex" name="cardType" />
                  <label htmlFor="amex">Amex</label>
                </div>

                <div className="flex items-center gap-1">
                  <input type="radio" id="other" name="cardType" />
                  <label htmlFor="other">Other</label>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="check">
              <div className="mt-5 flex justify-between gap-3">
                <div>
                  <SlimInput name="date" type="date" />
                </div>

                <div className="w-full">
                  <SlimInput name="check" type="text" label="Check #" />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="cash">
              <div className="mt-5 flex justify-between gap-3">
                <div>
                  <SlimInput name="date" type="date" />
                </div>

                <div className="w-full">
                  <SlimInput name="cash" type="text" label="Recieve Cash" />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="other">
              <div className="mt-5">
                <label>Payment Method</label>
                <Selector
                  label={paymentMethod?.name || ""}
                  newButton={
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paymentMethodInput}
                        onChange={(e) => setpaymentMethodInput(e.target.value)}
                        className="w-full rounded-md border-2 border-slate-400 p-1"
                      />
                      <button
                        onClick={handleNewPaymentMethod}
                        className={cn(
                          "text-nowrap rounded-md px-2 text-white",
                          paymentMethodInput ? "bg-slate-700" : "bg-slate-400",
                        )}
                        type="button"
                        disabled={!paymentMethodInput}
                      >
                        Quick Add
                      </button>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-2">
                    {/* <button
                      className="mx-auto w-[95%] rounded-md border-2 border-slate-400 p-1 px-2 text-left"
                      onClick={() => setPaymentMethod("Cash")}
                    >
                      Cash
                    </button>

                    <button
                      className="mx-auto w-[95%] rounded-md border-2 border-slate-400 p-1 px-2 text-left"
                      onClick={() => setPaymentMethod("Check")}
                    >
                      Check
                    </button>
                    <button
                      className="mx-auto w-[95%] rounded-md border-2 border-slate-400 p-1 px-2 text-left"
                      onClick={() => setPaymentMethod("Credit Card")}
                    >
                      Card
                    </button> */}
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        className="mx-auto w-[95%] rounded-md border-2 border-slate-400 p-1 px-2 text-left"
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </Selector>
              </div>

              <div className="mt-5 flex justify-between gap-3">
                <div>
                  <SlimInput name="date" type="date" />
                </div>

                <div className="w-full">
                  <SlimInput name="amount" type="text" />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                />
              </div>
            </Tabs.Content>

            <DialogFooter className="mt-5 flex justify-center gap-5">
              <button
                className="rounded-md border-2 border-slate-400 p-2 px-5"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-[#6571FF] p-2 px-5 text-white"
                formAction={handleSubmit}
              >
                Record
              </button>
            </DialogFooter>
          </Tabs.Root>
        </form>
      </DialogContent>
    </Dialog>
  );
}
