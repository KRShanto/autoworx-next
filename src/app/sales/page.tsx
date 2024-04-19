"use client";

import Title from "@/components/Title";
import { useEffect, useState } from "react";
import { Metadata } from "next";

const hotLeads = [
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
];

const onGoing = [
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
];

const intent = [
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
];

const purchased = [
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
  {
    name: "",
    email: "",
    phone: "",
  },
];

export default function Sales() {
  const [newLeads, setNewLeads] = useState<
    { name: string; email: string; phone: number }[]
  >([]);

  // function to fetch google sheet data
  async function fetchSheet() {
    const SHEET_ID = "1rMyMol-aqx805TRNd9-_OkDdraPUCgzd1rOA_UT0Oas";
    const SHEET_NAME = "autoworx test";
    const SHEET_RANGE = "A2:Z100";

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tq?sheet=${SHEET_NAME}&range=${SHEET_RANGE}`;

    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const leads = rows
      .map((row: any) => {
        return {
          name: row.c[0].v,
          email: row.c[1].v,
          phone: row.c[2].v,
        };
      })
      .reverse();

    setNewLeads(leads);
  }

  // fetch data from google sheet
  useEffect(() => {
    // Call fetchSheet immediately after component mounts
    fetchSheet();

    // Set up interval to fetch data every n seconds
    const intervalId = setInterval(fetchSheet, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const data = [
    {
      title: "Hot Leads",
      leads: hotLeads,
    },
    {
      title: "New Leads",
      leads: newLeads,
    },
    {
      title: "Ongoing",
      leads: onGoing,
    },
    {
      title: "Intent",
      leads: intent,
    },
    {
      title: "Purchased",
      leads: purchased,
    },
  ];

  return (
    <div className="h-full overflow-hidden">
      <Title>Sales Funnel Management</Title>

      <div className="flex justify-between p-5">
        {data.map((item, index) => (
          <div key={index} className="w-[19%]">
            <h2 className="rounded-lg bg-[#006D77] px-4 py-3 text-white">
              <p className="text-bsae font-bold ">{item.title}</p>
              <p className="text-sm text-slate-200">
                {
                  // Display the number of leads in the category
                  // check if the leads empty or not
                  item.leads[0] &&
                  item.leads[0].name === "" &&
                  item.leads[0].email === "" &&
                  item.leads[0].phone === ""
                    ? 0
                    : item.leads.length
                }{" "}
                Leads
              </p>
            </h2>

            <ul className="mt-5 flex h-[21%] flex-col gap-3 overflow-auto p-1">
              {item.leads.map((lead, index) => (
                <li
                  key={index}
                  className="app-shadow max-h-[150px] min-h-[150px] rounded-2xl p-3"
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
