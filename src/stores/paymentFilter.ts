import { create } from "zustand";

interface PaymentFilterState {
  dateRange: [Date | null, Date | null];
  amount: [number, number];
  paidStatus: "All" | "Paid" | "Unpaid";
  paymentMethod: string;
  setFilter({
    dateRange,
    amount,
    paidStatus,
    paymentMethod,
  }: {
    dateRange?: [Date, Date];
    amount?: [number, number];
    paidStatus?: "All" | "Paid" | "Unpaid";
    paymentMethod?: string;
  }): void;
}

export const usePaymentFilterStore = create<PaymentFilterState>((set) => ({
  dateRange: [null, null],
  amount: [1, 30000], // TODO
  paidStatus: "All",
  paymentMethod: "Method 1",
  setFilter: ({ dateRange, amount, paidStatus, paymentMethod }) =>
    set((state) => ({
      dateRange: dateRange || state.dateRange,
      amount: amount || state.amount,
      paidStatus: paidStatus || state.paidStatus,
      paymentMethod: paymentMethod || state.paymentMethod,
    })),
}));
