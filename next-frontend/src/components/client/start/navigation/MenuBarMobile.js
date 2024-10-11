"use client";
import Logo from "@/components/server/ui/Logo";
import { NAVIGATION_ITEMS } from "@/utils/navigation-start";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { HiMenuAlt2 as Icon } from "react-icons/hi";


export default function MenuBarMobile({ setter, isPastAboutUs }) {
  const pathname = usePathname();

  return (
    <nav
      className={`${
        isPastAboutUs ? 'bg-background' : 'bg-[#051127]'
      } flex justify-between items-center z-20 w-full fixed top-0 left-0 h-[60px] [&>*]:my-auto px-5 transition-colors duration-300`}
    >
      <button
        className="text-4xl md:hidden top-3 flex hover:text-exalt text-white"
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
      >
        <Icon />
      </button>
      <div>
        <Logo />
      </div>

      <div className="flex-row hidden items-center justify-center md:flex gap-x-5">
        {NAVIGATION_ITEMS.map((item, index) => (
          <Link
            className={`border-2 p-2 border-transparent hover:bg-background hover:border-background_third `}
            key={index}
            href={item.link}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <Link
        href="/chat"
        className=" bg-exalt text-background_secondary p-2 border-2 border-exalt-light shadow-sm shadow-exalt-light hover:bg-exalt_second hover:border-exalt_second-light transition-colors duration-300 hover:shadow-exalt_second-light"
      >
        Try Chat
      </Link>
    </nav>
  );
}
