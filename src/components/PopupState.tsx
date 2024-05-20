"use client";

import { usePopupStore } from "../stores/popup";
import AddUser from "../app/task/[type]/components/user/AddUser";
import AssignTask from "@/app/task/[type]/components/task/AssignTask";
import AddNewCustomer from "../app/customer/AddCustomer";
import AddEmployee from "../app/employee/AddEmployee";
import EditCustomer from "../app/customer/EditCustomer";
import EditEmployee from "@/app/employee/EditEmployee";
import UpdateTask from "@/app/task/[type]/components/task/UpdateTask";
import { UpdateAppointment } from "@/app/task/[type]/components/appointment/UpdateAppointment";

export default function PopupState() {
  const { popup } = usePopupStore();

  if (popup === "UPDATE_TASK") return <UpdateTask />;
  if (popup === "UPDATE_APPOINTMENT") return <UpdateAppointment />;
  if (popup === "ADD_USER") return <AddUser />;
  if (popup === "ASSIGN_TASK") return <AssignTask />;
  if (popup === "ADD_EMPLOYEE") return <AddEmployee />;
  if (popup === "ADD_NEW_CUSTOMER") return <AddNewCustomer />;
  if (popup === "EDIT_CUSTOMER") return <EditCustomer />;
  if (popup === "EDIT_EMPLOYEE") return <EditEmployee />;

  return null;
}
