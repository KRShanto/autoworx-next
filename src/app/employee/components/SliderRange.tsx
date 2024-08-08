import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

interface SliderRangeProps {
  value: [number, number];
  onChange: (newValue: [number, number]) => void;
}

// Custom styled Slider
const CustomSlider = styled(Slider)(({ theme }) => ({
  color: "#4f4f4f", // Default track color (for selected range)
  height: 8,
  "& .MuiSlider-track": {
    background:
      "linear-gradient(to right, #4f4f4f 23%, #4f4f4f 253%, #e0e0e0 253%, #e0e0e0 100%)",
  },
  "& .MuiSlider-thumb": {
    backgroundColor: "#ffffff", // Thumb color
    borderRadius: "50%",
    width: 24,
    height: 24,
    border: "2px solid currentColor",
    "&:hover": {
      boxShadow: "0px 0px 0px 2px ",
    },
  },
  "& .MuiSlider-rail": {
    color: "#909090", // Rail color (for unselected portion)
    height: 8,
  },
}));

export default function SliderRange({ value, onChange }: SliderRangeProps) {
  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange(newValue as [number, number]);
    }
  };

  return (
    <Box sx={{ width: 350 }}>
      <CustomSlider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={1}
        max={3000}
        step={1}
      />
    </Box>
  );
}
