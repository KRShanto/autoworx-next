import {
  CustomerType,
  ServiceType,
  VehicleType,
  Pricing,
  AdditionalInfo,
  Payment,
} from "@/types/db";
import { customAlphabet, nanoid } from "nanoid";
import { create } from "zustand";
import { Status } from "@prisma/client";

interface InvoiceStore {
  invoiceId: string;
  customer: CustomerType;
  vehicle: VehicleType;
  services: ServiceType[];
  pricing: Pricing;
  additional: AdditionalInfo;
  payments: Payment[];
  status: Status;
  sendMail: boolean;
  created_at: Date;
  issueDate: Date;
  photo: File | null;
  tags: string[];

  setInvoiceId: (id: string) => void;
  setCustomer: (customer: CustomerType) => void;
  setVehicle: (vehicle: VehicleType) => void;
  setServices: (services: ServiceType[]) => void;
  addService: (service: ServiceType) => void;
  removeService: (id: number) => void;
  setPricing: (pricing: Pricing) => void;
  setAdditional: (additional: AdditionalInfo) => void;
  setStatus: (status: Status) => void;
  setSendMail: (sendMail: boolean) => void;
  setPayments: (payment: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  removePayment: (tnx: string) => void;
  setIssueDate: (date: Date) => void;
  setPhoto: (photo: File | null) => void;
  setTags: (tags: string[]) => void;
  reset: () => void;
  calculatePricing: (dicsountType: "PERCENTAGE" | "AMOUNT") => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoiceId: "",
  customer: {
    name: "",
    email: "",
    mobile: 0,
    address: "",
    city: "",
    state: "",
    zip: "",
  },
  vehicle: {
    make: "",
    model: "",
    // current year
    year: new Date().getFullYear(),
    vin: "",
    license: "",
  },
  services: [],
  pricing: {
    subtotal: 0,
    discount: 0,
    tax: 0,
    grand_total: 0,
    deposit: 0,
    due: 0,
  },
  additional: {
    notes: "",
    terms: "",
  },
  status: "Consultations",
  sendMail: false,
  created_at: new Date(),
  payments: [],
  issueDate: new Date(),
  photo: null,
  tags: [],

  setInvoiceId: (id) => set({ invoiceId: id }),
  setCustomer: (customer) => set({ customer }),
  setVehicle: (vehicle) => set({ vehicle }),
  setServices: (services) => set({ services }),
  addService: (service) =>
    set((state) => ({ services: [...state.services, service] })),
  removeService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
  setPricing: (pricing) =>
    set({
      // cast to number
      pricing: {
        subtotal: Number(pricing.subtotal),
        discount: Number(pricing.discount),
        tax: Number(pricing.tax),
        grand_total: Number(pricing.grand_total),
        deposit: Number(pricing.deposit),
        due: Number(pricing.due),
      },
    }),
  setAdditional: (additional) => set({ additional }),
  setStatus: (status) => set({ status }),
  setSendMail: (sendMail) => set({ sendMail }),
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({
      payments: [
        ...state.payments,
        {
          ...payment,
          tnx: customAlphabet("1234567890", 10)(),
          date: new Date(),
          name: state.customer.name,
          email: state.customer.email,
          mobile: state.customer.mobile,
          address: state.customer.address,
          status: "Success",
        },
      ],
    })),
  removePayment: (tnx) =>
    set((state) => ({
      payments: state.payments.filter((payment) => payment.tnx !== tnx),
    })),
  setIssueDate: (date) => set({ issueDate: date }),
  setPhoto: (photo) => set({ photo }),
  setTags: (tags) => set({ tags }),
  reset: () =>
    set({
      invoiceId: "",
      customer: {
        name: "",
        email: "",
        mobile: 0,
        address: "",
        city: "",
        state: "",
        zip: "",
      },
      vehicle: {
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        license: "",
      },
      services: [],
      pricing: {
        subtotal: 0,
        discount: 0,
        tax: 0,
        grand_total: 0,
        deposit: 0,
        due: 0,
      },
      status: "Consultations",
      sendMail: false,
      created_at: new Date(),
      payments: [],
      issueDate: new Date(),
      photo: null,
    }),
  calculatePricing: (dicsountType: "PERCENTAGE" | "AMOUNT") => {
    const { services, pricing } = get();
    // subtotal would be the sum of all services
    // cast to number and then sum
    const subtotal = services
      .map((service) => Number(service.total))
      .reduce((acc, total) => acc + total, 0);

    // Grand total
    let gt;

    // calculate grand total with tax
    if (pricing.tax > 0) {
      gt = subtotal + subtotal * (pricing.tax / 100);
    } else {
      gt = subtotal;
    }

    // calculate grand total with discount
    if (dicsountType === "PERCENTAGE") {
      gt = gt - subtotal * ((pricing.discount ? pricing.discount : 0) / 100);
    } else {
      gt = gt - (pricing.discount ? pricing.discount : 0);
    }

    // calculate due
    const due = gt - (pricing.deposit ? pricing.deposit : 0);

    set({
      pricing: {
        ...pricing,
        subtotal,
        grand_total: gt,
        due,
      },
    });
  },
}));
