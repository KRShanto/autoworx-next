import {
  Customer,
  Labor,
  Material,
  Service,
  Status,
  Tag,
  Task,
  Vehicle,
} from "@prisma/client";
import { customAlphabet } from "nanoid";
import { create } from "zustand";

interface Item {
  id: string | number; // nanoid
  service: Service | null;
  material: Material | null;
  labor: Labor | null;
  tags: Tag[];
}

interface EstimateCreateStore {
  title: string;
  invoiceId: string;
  subtotal: number;
  discount: number;
  tax: number;
  deposit: number;
  depositNotes: string;
  depositMethod: string;
  grandTotal: number;
  due: number;
  internalNotes: string;
  terms: string;
  policy: string;
  customerNotes: string;
  customerComments: string;
  photos: File[];
  tasks: (Task | string)[];
  items: Item[];
  currentSelectedCategoryId: number | null;

  setTitle: (title: string) => void;
  setInvoiceId: (invoiceId: string) => void;

  setSubtotal: (subtotal: number) => void;
  setDiscount: (discount: number) => void;
  setTax: (tax: number) => void;
  setDeposit: (deposit: number) => void;
  setDepositNotes: (depositNotes: string) => void;
  setDepositMethod: (depositMethod: string) => void;
  setGrandTotal: (grandTotal: number) => void;
  setDue: (due: number) => void;

  setInternalNotes: (internalNotes: string) => void;
  setTerms: (terms: string) => void;
  setPolicy: (policy: string) => void;
  setCustomerNotes: (customerNotes: string) => void;
  setCustomerComments: (customerComments: string) => void;

  setPhotos: (photos: File[]) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (photo: string) => void;

  setTasks: (tasks: string[]) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;

  setCurrentSelectedCategoryId: (categoryId: number) => void;
}

export const useEstimateCreateStore = create<EstimateCreateStore>((set) => ({
  title: "",
  invoiceId: "",

  subtotal: 0,
  discount: 0,
  tax: 0,
  deposit: 0,
  depositNotes: "",
  depositMethod: "",
  grandTotal: 0,
  due: 0,

  internalNotes: "",
  terms: "",
  policy: "",
  customerNotes: "",
  customerComments: "",

  photos: [],
  tasks: [],

  items: [],

  currentSelectedCategoryId: null,

  setTitle: (title: string) => set({ title }),
  setInvoiceId: (invoiceId: string) => set({ invoiceId }),

  setSubtotal: (subtotal: number) => set({ subtotal }),
  setDiscount: (discount: number) => set({ discount }),
  setTax: (tax: number) => set({ tax }),
  setDeposit: (deposit: number) => set({ deposit }),
  setDepositNotes: (depositNotes: string) => set({ depositNotes }),
  setDepositMethod: (depositMethod: string) => set({ depositMethod }),
  setGrandTotal: (grandTotal: number) => set({ grandTotal }),
  setDue: (due: number) => set({ due }),

  setInternalNotes: (internalNotes: string) => set({ internalNotes }),
  setTerms: (terms: string) => set({ terms }),
  setPolicy: (policy: string) => set({ policy }),
  setCustomerNotes: (customerNotes: string) => set({ customerNotes }),
  setCustomerComments: (customerComments: string) => set({ customerComments }),

  setPhotos: (photos: File[]) => set({ photos }),
  addPhoto: (photo: string) =>
    set((x: any) => ({ photos: [...x.photos, photo] })),
  removePhoto: (photo: string) =>
    set((x: any) => ({ photos: x.photos.filter((p: string) => p !== photo) })),

  setTasks: (tasks: string[]) => set({ tasks }),
  addTask: (task: Task) => set((x: any) => ({ tasks: [...x.tasks, task] })),
  removeTask: (taskId: number) =>
    set((x: any) => ({ tasks: x.tasks.filter((t: Task) => t.id !== taskId) })),

  setCurrentSelectedCategoryId: (categoryId: number) =>
    set({ currentSelectedCategoryId: categoryId }),
}));
