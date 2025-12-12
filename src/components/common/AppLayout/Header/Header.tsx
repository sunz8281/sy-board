"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBell, IconUser } from "@/icons";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
    { label: "게시판", href: "/board"},
    { label: "시간표", href: "/timetable"},
    { label: "강의평가", href: "/reviews"},
    { label: "학점계산기", href: "/calculator"},
    { label: "친구", href: "/friends"},
    { label: "책방", href: "/books"},
    { label: "캠퍼스맵", href: "/map"},
];

export const Header = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="h-[60px] bg-black">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="#" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white" />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={isActive(item.href) ? "font-semibold text-primary" : "text-gray-400"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-white">
          <button className="p-2" aria-label="Notifications">
            <IconBell className="h-5 w-5" />
          </button>
          <button className="p-2" aria-label="Profile">
            <IconUser className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;