import { Switch } from "@/components/Switch";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  inventoryOpen: boolean;
  setInventoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
};

const Inventory = ({ inventoryOpen, setInventoryOpen, handleClose }: Props) => {
  return (
    <div>
      <div
        className="flex w-full cursor-pointer items-center justify-between border p-8 font-semibold"
        onClick={() => {
          handleClose();
          setInventoryOpen(!inventoryOpen);
        }}
      >
        <span className="capitalize">Inventory</span>
        <button>
          <IoIosArrowDown />
        </button>
      </div>
      {inventoryOpen && (
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
                <td>New Inventory</td>
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
                <td>Completely Out</td>
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
                <td>Newly Added</td>
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

export default Inventory;
