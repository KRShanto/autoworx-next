"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const LINKS = [
    {
      title: "Invoice List",
      link: "/invoice",
    },
    {
      title: "Create Invoice",
      link: "/invoice/create",
    },
    {
      title: "Create Estimate",
      link: "/invoice/estimate",
    },
    {
      title: "Digital Inspection",
      link: "/invoice/inspection",
    },
  ];
  const pathname = usePathname();
  const activeLink = LINKS.find((link) => link.link === pathname);

  return (
    <div className="relative ml-5 mt-5 flex gap-5">
      {LINKS.map((link) => (
        <Link
          href={link.link}
          key={link.title}
          className="invoice-link rounded-md rounded-br-none px-5 py-1 text-base max-[1450px]:text-sm max-[1250px]:px-3 max-[1250px]:text-xs"
          style={{
            backgroundColor:
              activeLink?.link === link.link ? "white" : "#6571FF",
            color: activeLink?.link === link.link ? "#66738C" : "white",
            zIndex: LINKS.length - LINKS.indexOf(link),
          }}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}
