"use client";

import { useState } from "react";
import { usePopupStore } from "@/stores/popup";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import { TaskType, User } from "@prisma/client";
import Image from "next/image";
import Submit from "@/components/Submit";
import { addTask } from "../../add";
import { useFormErrorStore } from "@/stores/form-error";
import Popup from "@/components/Popup";
import AddTask from "./AddTask";

export default function AddTaskPopup() {
  return (
    <Popup>
      <AddTask />
    </Popup>
  );
}
