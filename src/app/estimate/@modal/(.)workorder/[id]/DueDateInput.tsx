"use client";
import { SlimInput } from "@/components/SlimInput";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type TProps = {
  invoiceDueDate: string | null;
  dueDateParams: string | null;
};

export default function DueDate({ invoiceDueDate, dueDateParams }: TProps) {
  const [dueDate, setDueDate] = useState(dueDateParams || "");

  const pathname = usePathname();

  const router = useRouter();

  const params = useSearchParams();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const searchParams = new URLSearchParams(params);
    if (date) {
      searchParams.set("dueDate", date);
    } else {
      searchParams.delete("dueDate");
    }
    router.replace(`${pathname}?${searchParams.toString()}`);
    setDueDate(date);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(params);
    if (invoiceDueDate) {
      searchParams.set("dueDate", invoiceDueDate);
      setDueDate(invoiceDueDate);
    } else {
      searchParams.delete("dueDate");
    }
    router.replace(`${pathname}?${searchParams.toString()}`);
  }, []);

  return (
    <div className="mt-1">
      <SlimInput
        name="dueDate"
        label="Due Date"
        type="date"
        rootClassName="text-base flex flex-col items-start"
        value={dueDate}
        onChange={handleDateChange}
      />
    </div>
  );
}
