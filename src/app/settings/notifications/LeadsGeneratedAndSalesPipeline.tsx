import { Switch } from "@/components/Switch";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  leadsGeneratedOpen: boolean;
  setLeadsGeneratedOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: () => void;
};

const LeadsGeneratedAndSalesPipeline = ({
  leadsGeneratedOpen,
  setLeadsGeneratedOpen,
  handleClose,
}: Props) => {
  return (
    <div>
      <div
        className="flex w-full cursor-pointer items-center justify-between border p-8 font-semibold"
        onClick={() => {
          handleClose();
          setLeadsGeneratedOpen(!leadsGeneratedOpen);
        }}
      >
        <span className="capitalize">Leads generated and sales pipeline</span>
        <button>
          <IoIosArrowDown />
        </button>
      </div>
      {leadsGeneratedOpen && (
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
                <td>Leads Generated</td>
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
                <td>Leads Closed</td>
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
                <td>Follow-Up</td>
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
                <td>Leads Assigned</td>
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
                <td>Stage</td>
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

export default LeadsGeneratedAndSalesPipeline;
