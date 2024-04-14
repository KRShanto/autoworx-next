"use client";

import { usePopupStore } from "../stores/popup";
// import AddTask from "./Task/calendar/AddTask";
// import AddUser from "./AddUser";
// import AssignTask from "./Task/users/AssignTask";
// import EditTask from "./Task/calendar/EditTask";
// import AddNewCustomer from "./Customer/AddNewCustomer";
// import AddCustomer from "./Invoice/AddCustomer";
// import AddVehicle from "./Invoice/AddVehicle";
import AddEmployee from "../app/employee/AddEmployee";
// import AddService from "./Service/AddService";
// import AddPayment from "./Invoice/AddPayment";
// import AddWorkOrder from "./Invoice/AddWorkOrder";
// import ChooseEmployee from "./Invoice/ChooseEmployee";
// import EditCustomer from "./Customer/EditCustomer";
import EditEmployee from "@/app/employee/EditEmployee";
// import EditService from "./Service/EditService";

export default function PopupState() {
  const { popup } = usePopupStore();

  // if (popup === "ADD_TASK") return <AddTask />;
  // if (popup === "EDIT_TASK") return <EditTask />;
  // if (popup === "ADD_USER") return <AddUser />;
  // if (popup === "ASSIGN_TASK") return <AssignTask />;
  // if (popup === "ADD_CUSTOMER") return <AddCustomer />;
  // if (popup === "ADD_VEHICLE") return <AddVehicle />;
  if (popup === "ADD_EMPLOYEE") return <AddEmployee />;
  // if (popup === "ADD_NEW_CUSTOMER") return <AddNewCustomer />;
  // if (popup === "ADD_SERVICE") return <AddService />;
  // if (popup === "ADD_PAYMENT") return <AddPayment />;
  // if (popup === "CHOOSE_EMPLOYEE") return <ChooseEmployee />;
  // if (popup === "ADD_WORK_ORDER") return <AddWorkOrder />;
  // if (popup === "EDIT_CUSTOMER") return <EditCustomer />;
  if (popup === "EDIT_EMPLOYEE") return <EditEmployee />;
  // if (popup === "EDIT_SERVICE") return <EditService />;

  return null;
}
