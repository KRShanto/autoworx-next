import { Session } from "next-auth";

export interface AuthSession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    companyId: number;
  };
}
