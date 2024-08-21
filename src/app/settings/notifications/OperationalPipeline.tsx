import { Switch } from "@/components/Switch";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  operationalPipelineOpen: boolean;
  setOperationalPipelineOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
};

const OperationalPipeline = ({
  operationalPipelineOpen,
  setOperationalPipelineOpen,
  handleClose,
}: Props) => {
  return (
    <div>
      <div
        className="flex w-full cursor-pointer items-center justify-between border p-8 font-semibold"
        onClick={() => {
          handleClose();
          setOperationalPipelineOpen(!operationalPipelineOpen);
        }}
      >
        <span className="capitalize">Operational Pipeline</span>
        <button>
          <IoIosArrowDown />
        </button>
      </div>
      {operationalPipelineOpen && (
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
                <td>Work Order Created</td>
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
                <td>Work Order Completed</td>
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
                <td>Due Date Proximity</td>
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

export default OperationalPipeline;
