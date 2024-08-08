import { create } from "zustand";

export type PaymentMethod = "Card" | "Cash" | "Cheque" | "Other" | "All";

interface PaymentFilterState {
  dateRange: [Date | null, Date | null];
  amount: [number, number];
  paidStatus: "All" | "Paid" | "Unpaid";
  paymentMethod: PaymentMethod;
  setFilter({
    dateRange,
    amount,
    paidStatus,
    paymentMethod,
  }: {
    dateRange?: [Date, Date];
    amount?: [number, number];
    paidStatus?: "All" | "Paid" | "Unpaid";
    paymentMethod?: PaymentMethod;
  }): void;
}

export const usePaymentFilterStore = create<PaymentFilterState>((set) => ({
  dateRange: [null, null],
  amount: [1, 30000], // TODO
  paidStatus: "All",
  paymentMethod: "All",
  setFilter: ({ dateRange, amount, paidStatus, paymentMethod }) =>
    set((state) => ({
      dateRange: dateRange || state.dateRange,
      amount: amount || state.amount,
      paidStatus: paidStatus || state.paidStatus,
      paymentMethod: paymentMethod || state.paymentMethod,
    })),
}));
