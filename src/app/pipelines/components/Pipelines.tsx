"use client";

import Title from "@/components/Title";

const newLeads = [
  { name: "", email: "", phone: "" },
  
 
];

const leadsGenerated = [
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
];

const followUp = [
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
];

const estimatesCreated = [
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
];

const archived = [
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
];

const converted = [
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
  { name: "", email: "", phone: "" },
];

const data = [
  { title: "New Leads", leads: newLeads },
  { title: "Leads Generated", leads: leadsGenerated },
  { title: "Follow-up", leads: followUp },
  { title: "Estimates Created", leads: estimatesCreated },
  { title: "Archived", leads: archived },
  { title: "Converted", leads: converted },
];

export default function Pipelines() {
  return (
    <div className="h-full overflow-hidden">
      

      <div className="flex justify-between p-5">
        {data.map((item, index) => (
          <div
            key={index} 
            className="w-[16%] border rounded-md"
            style={{ backgroundColor: "rgba(101, 113, 255, 0.15) " }}
          >
            <h2 className="rounded-lg bg-[#6571FF] px-4 py-3 text-white text-center">
              <p className="text-base font-bold">{item.title}</p>
            </h2>

            <ul className="mt-5 flex flex-col gap-3 overflow-auto p-1 " style={{ maxHeight: '70vh' }}>
              {item.leads.map((lead, index) => (
                <li
                  key={index}
                  className="max-h-[150px] min-h-[150px] border rounded-xl bg-white p-8 mx-2"
                >
                  <div>
                    <h3 className="overflow-auto pb-2 text-base font-semibold">
                      {lead.name}
                    </h3>
                    <p className="overflow-auto pb-2 text-sm">{lead.email}</p>
                    <p className="overflow-auto pb-2 text-sm">{lead.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
