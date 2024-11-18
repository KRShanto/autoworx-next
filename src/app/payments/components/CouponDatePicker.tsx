import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface propsType {
  name: string;
  customTitle: string;
  defaultValue?: Date; // Add defaultValue to the props interface
}

export default function CouponDateComponent({
  name,
  customTitle,
  defaultValue,
}: propsType) {
  // Initialize the state with defaultValue if provided
  const [value, setValue] = React.useState<Dayjs | null>(
    defaultValue ? dayjs(defaultValue) : null,
  );

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
          name={name}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
