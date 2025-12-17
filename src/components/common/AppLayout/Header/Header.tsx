"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconBell, IconUser } from "@/icons";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
    { label: "게시판", href: "/board"},
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

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
          <IconUser className="h-6 w-6 cursor-pointer" onClick={() => router.push("/me")} />
        </div>
      </div>
    </header>
  );
}

export default Header;
