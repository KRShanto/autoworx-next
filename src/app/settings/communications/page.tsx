import { SlimInput } from "@/components/SlimInput";
import ConnectGoogle from "./ConnectGoogle";

export default function CommunicationPage() {
  return (
    <div className="grid w-full grid-cols-2 items-start gap-4 px-5">
      <div className="space-y-4">
        {/* Email Settings */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Email Settings</h2>
          <div className="space-y-8 rounded-sm border p-5">
            <div className="grid grid-cols-2 items-start space-x-3">
              <SlimInput name="outReachEmail" label="Outreach Email" />
            </div>
            <div className="mt-8">
              <ConnectGoogle />
            </div>
          </div>
        </div>
        {/* Contact Number Settings */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            Contact Number Settings
          </h2>
          <div className="space-y-3 rounded-sm border p-5">
            <div className="grid grid-cols-2 items-start space-x-3">
              <SlimInput name="outReachEmail" label="Outreach Email" />
            </div>
            {/* draft email */}
            <div className="grid grid-cols-1 items-start space-x-3">
              <label className="block">
                <div className="mb-1 px-2 font-medium">Draft SMS/Text</div>
                <textarea
                  value='"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
'
                  className="h-[153px] w-full resize-none rounded-sm border border-primary-foreground bg-white px-2 py-0.5 text-sm leading-6 outline-none"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div className="space-y-4">
        {/* SMS Gateway Settings */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">SMS Gateway Settings</h2>
          <div className="space-y-3 rounded-sm border p-5">
            {/* TODO: future added */}
          </div>
        </div>
      </div>
    </div>
  );
}
