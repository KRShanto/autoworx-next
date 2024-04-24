import Link from "next/link";
import Image from "next/image";

const navList = [
  {
    title: "Dashboard",
    icon: "/icons/navbar/Dashboard.svg",
    link: "/",
  },
  {
    title: "Community Hub",
    icon: "/icons/navbar/Community.svg",
    link: "/community",
  },
  {
    title: "Sales and Funnel Management",
    icon: "/icons/navbar/Sales.svg",
    link: "/sales",
  },
  {
    title: "Task and Activity Management",
    icon: "/icons/navbar/Task.svg",
    link: "/task/day",
  },
  {
    title: "Analytics and Reporting",
    icon: "/icons/navbar/Analytics.svg",
    link: "/analytics",
  },
  {
    title: "Invoices",
    icon: "/icons/navbar/Invoices.svg",
    link: "/invoice",
  },
  {
    title: "Payments",
    icon: "/icons/navbar/Payments.svg",
    link: "/payments",
  },
];

export default function SideNavbar() {
  return (
    <nav className="fixed flex h-screen w-[5%] flex-col items-center bg-[#0C1427] px-2 py-12">
      {/* logo */}
      <Image src="/icons/Logo.png" alt="Company Logo" width={40} height={40} />

      {/* Links */}
      <div className="mt-16 flex flex-col items-center gap-8">
        {navList.map((item, index) => (
          <Link
            className="hover:opacity-50"
            key={index}
            href={item.link}
            title={item.title}
          >
            <Image src={item.icon} alt={item.title} width={20} height={20} />
          </Link>
        ))}
      </div>

      {/* Settings */}
      <Link
        href="/settings"
        className="mt-auto hover:opacity-50"
        title="Settings"
      >
        <Image
          src="/icons/navbar/Settings.svg"
          alt="Settings"
          width={20}
          height={20}
        />
      </Link>
    </nav>
  );
}
