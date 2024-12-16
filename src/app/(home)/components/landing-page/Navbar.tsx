import Image from "next/image";
import Link from "next/link";

const links = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Solutions",
    link: "/#solutions",
  },
  {
    title: "Data Migration",
    link: "/#data",
  },
  {
    title: "pricing",
    link: "/#pricing",
  },
  {
    title: "contact us",
    link: "/#contact",
  },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border p-3 px-[15rem]">
      <Link className="flex gap-5" href="/">
        <Image src="/landing/Logo1.svg" alt="Logo1" width={40} height={50} />
        <Image src="/landing/Logo2.svg" alt="Logo2" width={200} height={50} />
      </Link>

      <div className="flex items-center gap-5">
        <div className="flex gap-5">
          {links.map((link) => (
            <Link key={link.title} href={link.link} className="uppercase">
              {link.title}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="rounded-2xl p-3 px-7 uppercase text-white"
          style={{
            background: "linear-gradient(90deg, #03A7A2 0%, #26AADF 100%)",
          }}
        >
          Request a Demo
        </Link>

        <Link
          href="/login"
          className="bg-custom-gradient-lp rounded-2xl p-[1px]"
        >
          <button className="rounded-2xl bg-white px-4 py-3 uppercase">
            <span className="bg-custom-gradient-lp bg-clip-text text-transparent">
              Login
            </span>
          </button>
        </Link>
      </div>
    </nav>
  );
}
