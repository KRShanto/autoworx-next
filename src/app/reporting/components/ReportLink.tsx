'use client'
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TProps = {
  children: React.ReactNode;
  href: string;
};

export default function ReportLink({ children, href, ...props }: TProps) {
  const pathname = usePathname()
  const isActive = pathname.includes(href)
  return (
    <Link href={href} {...props} className={cn('h-12 w-40 rounded-md text-xl font-semibold text-[#6571FF] border border-[#6571FF] flex justify-center items-center', isActive && 'bg-[#6571FF] text-white' )}>
      {children}
    </Link>
  );
}
