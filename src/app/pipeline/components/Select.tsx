import { CheckCircleOutlined } from "@ant-design/icons";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

type item = {
  [key: string]: any;
};
interface SelectProps {
  label: string;
  items: item[];
}

const SelectComponent = ({ label, items }: SelectProps) => (
  <div className="px-4">
    <div className="my-2">{label} : </div>
    <Select.Root>
      <Select.Trigger
        className="text-violet11 hover:bg-mauve3 data-[placeholder]:text-violet9 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        aria-label="Food"
      >
        <Select.Value placeholder={`Select ${label}`} />
        <Select.Icon className="text-violet11">
          <FaChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md bg-white p-4 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.ScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
            <FaChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              {/* <Select.Label className="text-mauve11 px-[25px] text-xs leading-[25px]">
                {label}
              </Select.Label> */}

              {items.map((item) => (
                <SelectItem key={item.id} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
            <FiChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
);

// eslint-disable-next-line react/display-name
const SelectItem = React.forwardRef(
  ({ children, className, ...props }: any, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "relative z-50 flex min-w-[200px] cursor-pointer select-none items-center rounded-[3px] border-b px-2 py-4 leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        {/* <Select.ItemIndicator className="absolute left-0 z-50 inline-flex w-[25px] items-center justify-center">
          <CheckCircleOutlined />
        </Select.ItemIndicator> */}
      </Select.Item>
    );
  },
);

export default SelectComponent;
