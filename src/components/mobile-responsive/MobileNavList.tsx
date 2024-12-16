import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

type TProps = {
  item: {
    title: string;
    icon: string;
    link?: string | null;
    subnav?:
      | {
          title: string;
          link: string;
        }[]
      | null;
  };
  setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileNavList({ item, setOpenNav }: TProps) {
  const [isOpenSubNav, setIsOpenSubNav] = useState(false);
  return (
    <li>
      <div className="flex items-center space-x-2">
        <Image src={item.icon} alt={item.title} width={20} height={20} />
        {item.link && !item.subnav ? (
          <Link
            onClick={() => setOpenNav(false)}
            href={item.link}
            className="flex-shrink-0 text-base text-white"
          >
            {item.title}
          </Link>
        ) : (
          <>
            <p
              onClick={() => setIsOpenSubNav((prev) => !prev)}
              className="flex flex-shrink-0 items-center space-x-2 text-base text-white"
            >
              <span>{item.title}</span>

              {isOpenSubNav ? (
                <MdOutlineKeyboardArrowDown size={25} className="text-white" />
              ) : (
                <MdOutlineKeyboardArrowRight size={25} className="text-white" />
              )}
            </p>
          </>
        )}
      </div>
      {isOpenSubNav && item?.subnav && (
        <ul className="mt-3 flex flex-col items-center justify-center gap-y-4">
          {item.subnav?.map((subItem, index) => (
            <Link
              onClick={() => setOpenNav(false)}
              key={index}
              href={subItem.link}
              className="text-lg text-gray-200"
            >
              {subItem.title}
            </Link>
          ))}
        </ul>
      )}
    </li>
  );
}
