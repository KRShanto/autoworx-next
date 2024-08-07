import { create } from "zustand";

export type PaymentMethod = "Card" | "Cash" | "Cheque" | "Other" | "All";
export type PaymentStatus = "All" | "Paid" | "Unpaid";

interface PaymentFilterState {
  dateRange: [Date | null, Date | null];
  amount: [number, number];
  paidStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  setFilter({
    dateRange,
    amount,
    paidStatus,
    paymentMethod,
  }: {
    dateRange?: [Date | null, Date | null];
    amount?: [number, number];
    paidStatus?: PaymentStatus;
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
