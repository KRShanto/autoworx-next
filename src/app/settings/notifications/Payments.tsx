import { Switch } from "@/components/Switch";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  paymentsOpen: boolean;
  setPaymentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
};

const Payments = ({ paymentsOpen, setPaymentsOpen, handleClose }: Props) => {
  return (
    <div>
      <div
        className="flex w-full cursor-pointer items-center justify-between border p-8 font-semibold"
        onClick={() => {
          handleClose();
          setPaymentsOpen(!paymentsOpen);
        }}
      >
        <span className="capitalize">Payments</span>
        <button>
          <IoIosArrowDown />
        </button>
      </div>
      {paymentsOpen && (
        <div className="w-full border p-8">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <td></td>
                <td className="text-sm font-semibold">Email</td>
                <td className="text-sm font-semibold">Push</td>
                <td className="text-sm font-semibold">Silence</td>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td>Payment Received</td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
              </tr>
              <tr className="">
                <td>Payment Due</td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
              </tr>
              <tr className="">
                <td>Deposit</td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
                <td>
                  <Switch checked={true} setChecked={() => {}} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
