import { User } from "@/types";
import { create } from "zustand";

interface UsersStore {
  users: User[];
  current: User | null;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
  current: null,
  setUsers: (users) => set({ users }),
  setCurrentUser: (current) => set({ current }),
}));
