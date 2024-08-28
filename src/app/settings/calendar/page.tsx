import MenuDropDown from "./MenuDropDown";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export default function CalendarPage() {
  return (
    <div className="space-y-6 px-5">
      {/* Calender Integration */}
      <div>
        <h2 className="mb-2 text-xl font-semibold">Calendar Integrations</h2>
        <div className="flex items-center justify-between space-x-3 rounded-sm border p-5">
          <div className="space-y-2">
            <p>Google</p>
            <button className="w-[260px] rounded-sm border py-3">Logo</button>
          </div>
          <div className="space-y-2">
            <p>Apple</p>
            <button className="w-[260px] rounded-sm border py-3">Logo</button>
          </div>
        </div>
      </div>
      {/* Preferences */}
      <div>
        <h2 className="mb-2 text-xl font-semibold">Preferences</h2>
        <div className="space-y-3 rounded-sm border px-5 py-8">
          <div className="flex justify-between">
            <p className="font-semibold">View Options</p>
            <div className="flex items-center space-x-2">
              <p>Week start on</p>
              {/* drop down */}
              <MenuDropDown
                dropDownItems={days}
                selected={"Sunday"}
                height={40}
                width={239}
              />
            </div>
          </div>
          {/* region */}
          <div className="flex justify-between">
            <p className="font-semibold">Region</p>
            <MenuDropDown
              selected="UTC +6:00 Dhaka 03:00AM"
              height={40}
              width={389}
              dropDownItems={[]}
            />
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
  );
}
