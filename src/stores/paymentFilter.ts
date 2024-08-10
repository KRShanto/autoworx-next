import { create } from "zustand";

export type PaymentMethod = "Card" | "Cash" | "Cheque" | "Other" | "All";
export type PaymentStatus = "All" | "Paid" | "Unpaid";

interface PaymentFilterState {
  search: string;
  dateRange: [Date | null, Date | null];
  amount: [number, number];
  paidStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  setFilter({
    search,
    dateRange,
    amount,
    paidStatus,
    paymentMethod,
  }: {
    search?: string;
    dateRange?: [Date | null, Date | null];
    amount?: [number, number];
    paidStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
  }): void;
}

export const usePaymentFilterStore = create<PaymentFilterState>((set) => ({
  search: "",
  dateRange: [null, null],
  amount: [1, 30000], // TODO
  paidStatus: "All",
  paymentMethod: "All",
  setFilter: ({ search, dateRange, amount, paidStatus, paymentMethod }) =>
    set((state) => ({
      search,
      dateRange: dateRange || state.dateRange,
      amount: amount || state.amount,
      paidStatus: paidStatus || state.paidStatus,
      paymentMethod: paymentMethod || state.paymentMethod,
    })),
}));
