import Link from "next/link";
import { IconBell, IconUser } from "@/icons";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

type HeaderProps = {
  items: NavItem[];
};

export function Header({ items }: HeaderProps) {
  return (
    <header className="h-[60px] bg-black">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="#" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white" />
            <span className="text-white">sy-board</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={item.active ? "font-semibold text-primary" : "text-gray-400"}
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
