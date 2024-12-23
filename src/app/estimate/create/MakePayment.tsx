import React, { useEffect, useState } from "react";
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
import { newPaymentMethod } from "../../../actions/payment/newPaymentMethod";
import { CardType, PaymentMethod, PaymentType } from "@prisma/client";
import { newPayment } from "../../../actions/payment/newPayment";
import { useEstimateCreateStore } from "@/stores/estimate-create";
import { useInvoiceCreate } from "@/hooks/useInvoiceCreate";
import { usePathname, useRouter } from "next/navigation";
import moment from "moment";
import toast from "react-hot-toast";

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
  const { paymentMethods } = useListsStore();
  const { payment, due, grandTotal } = useEstimateCreateStore();
  const createInvoice = useInvoiceCreate("Invoice");
  const router = useRouter();
  const pathaname = usePathname();
  const isEditPage = pathaname.includes("/estimate/edit/");

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("CARD");
  const [paymentMethodInput, setPaymentMethodInput] = useState("");

  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [card, setCard] = useState("");
  const [cardType, setCardType] = useState("MASTERCARD");
  const [check, setCheck] = useState("");
  const [cash, setCash] = useState<number | string>("");
  const [amount, setAmount] = useState<number | string>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );

  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);

  useEffect(() => {
    if (payment) {
      setTab(payment.type);
      setDate(payment.date || new Date());
      setNotes(payment.notes || "");

      switch (payment.type) {
        case "CARD":
          setCard(payment.card?.creditCard || "");
          setCardType(payment.card?.cardType || "MASTERCARD");
          break;
        case "CHECK":
          setCheck(payment.check?.checkNumber || "");
          break;
        case "CASH":
          setCash(payment.cash?.receivedCash || "");
          break;
        case "OTHER":
          setPaymentMethod(payment.other?.paymentMethod || null);
          break;
      }
    }
  }, [payment]);

  useEffect(() => setAmount(due), [due]);

  async function handleSubmit() {
    console.log("Start of the handleSubmit function");
    const res1 = await createInvoice();
    console.log("Invoice created");
    let res2;

    if (res1.type === "error") {
      toast.error(res1.message || "Error making payment");
      setOpen(false);
      return;
    }

    //create payment each time you make payment
    res2 = await newPayment({
      invoiceId: res1.data.id,
      type: tab as PaymentType,
      date,
      notes,
      amount: Number(amount),
      additionalData: {
        creditCard: card,
        cardType: cardType ? (cardType as CardType) : "MASTERCARD",
        checkNumber: check,
        receivedCash: Number(cash),
        paymentMethodId: paymentMethod?.id,
      },
    });

    console.log("Payment created");

    if (res2.type === "success") {
      setOpen(false);
      // Redirect to the index
      router.push("/estimate/invoices");
    } else {
      toast.error(res2.message || "Error making payment");
      setOpen(false);
    }
  }

  async function handleNewPaymentMethod() {
    const res = await newPaymentMethod(paymentMethodInput);

    if (res.type === "success") {
      setPaymentMethodInput("");
      setPaymentMethod(res.data);
      setOpenPaymentMethod(false);

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

          <Tabs.Root className="mt-5" value={tab} onValueChange={setTab as any}>
            <Tabs.List className="flex justify-between">
              <TabTrigger value="CARD" tab={tab}>
                <FaRegCreditCard />
                Card
              </TabTrigger>

              <TabTrigger value="CHECK" tab={tab}>
                <Image
                  src={
                    tab === "CHECK"
                      ? "/icons/CheckWhite.svg"
                      : "/icons/Check.svg"
                  }
                  alt="Check icon"
                  width={20}
                  height={20}
                />
                Check
              </TabTrigger>

              <TabTrigger value="CASH" tab={tab}>
                <Image
                  src={
                    tab === "CASH" ? "/icons/CashWhite.svg" : "/icons/Cash.svg"
                  }
                  alt="Cash icon"
                  width={20}
                  height={20}
                />
                Cash
              </TabTrigger>

              <TabTrigger value="OTHER" tab={tab}>
                Other
              </TabTrigger>
            </Tabs.List>

            <Tabs.Content value="CARD">
              <div className="mt-5 flex justify-between gap-3">
                <div>
                  <SlimInput
                    name="date"
                    type="date"
                    value={moment(date).format("YYYY-MM-DD")}
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </div>

                <div className="w-full">
                  <SlimInput
                    name="card"
                    type="text"
                    label="Credit Card (Last 4 digits)"
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-end gap-5">
                <SlimInput
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    id="mastercard"
                    name="cardType"
                    checked={cardType === "MASTERCARD"}
                    onChange={() => setCardType("MASTERCARD")}
                  />
                  <label htmlFor="mastercard">Mastercard</label>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    id="visa"
                    name="cardType"
                    checked={cardType === "VISA"}
                    onChange={() => setCardType("VISA")}
                  />
                  <label htmlFor="visa">Visa</label>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    id="amex"
                    name="cardType"
                    checked={cardType === "AMEX"}
                    onChange={() => setCardType("AMEX")}
                  />
                  <label htmlFor="amex">Amex</label>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    id="other"
                    name="cardType"
                    checked={cardType === "OTHER"}
                    onChange={() => setCardType("OTHER")}
                  />
                  <label htmlFor="other">Other</label>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="CHECK">
              <div className="mt-5 flex justify-between gap-3">
                <div className="w-[40%]">
                  <SlimInput
                    name="date"
                    type="date"
                    value={moment(date).format("YYYY-MM-DD")}
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </div>

                <div className="w-[60%]">
                  <SlimInput
                    name="check"
                    type="text"
                    label="Check #"
                    value={check}
                    onChange={(e) => setCheck(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-[40%]">
                <SlimInput
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="CASH">
              <div className="mt-5 flex justify-between gap-3">
                <div className="w-[40%]">
                  <SlimInput
                    name="date"
                    type="date"
                    value={moment(date).format("YYYY-MM-DD")}
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </div>

                <div className="w-[60%]">
                  <SlimInput
                    name="cash"
                    type="text"
                    label="Recieve Cash"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-[40%]">
                <SlimInput
                  name="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="OTHER">
              <div className="mt-5">
                <label>Payment Method</label>

                <Selector
                  label={(paymentMethod: PaymentMethod | null) =>
                    paymentMethod
                      ? paymentMethod.name ||
                        `Payment Method ${paymentMethod.id}`
                      : "Payment Method"
                  }
                  newButton={
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Payment Method Name"
                        value={paymentMethodInput}
                        onChange={(e) => setPaymentMethodInput(e.target.value)}
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
                  items={paymentMethods}
                  onSearch={(search: string) =>
                    paymentMethods.filter((method) =>
                      method.name.toLowerCase().includes(search.toLowerCase()),
                    )
                  }
                  displayList={(paymentMethod: PaymentMethod) => (
                    <p>{paymentMethod.name}</p>
                  )}
                  openState={[openPaymentMethod, setOpenPaymentMethod]}
                  selectedItem={paymentMethod}
                  setSelectedItem={setPaymentMethod}
                />
              </div>

              <div className="mt-5 flex justify-between gap-3">
                <div>
                  <SlimInput
                    name="date"
                    type="date"
                    value={moment(date).format("YYYY-MM-DD")}
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </div>

                <div className="w-full">
                  <SlimInput
                    name="amount"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  className="h-20 w-full rounded-md border-2 border-slate-400 p-2 outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </Tabs.Content>

            <DialogFooter className="mt-5 flex justify-center gap-5">
              <button
                type="button"
                className="rounded-md border-2 border-slate-400 p-2 px-5"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-[#6571FF] p-2 px-5 text-white"
                formAction={handleSubmit}
                type="submit"
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
