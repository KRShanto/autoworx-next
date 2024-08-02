import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface propsType {
  customTitle: string;
}
export default function CouponDateComponent({ customTitle }: propsType) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={customTitle}
          sx={{
            width: 10, // Adjust width as needed
            "& .MuiInputBase-input": {
              fontSize: "0.875rem", // Adjust font size as needed
            },
            border: "rounded",
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
