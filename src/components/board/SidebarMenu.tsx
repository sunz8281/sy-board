import * as React from "react";

type MenuItem = {
  label: string;
  icon?: React.ReactNode;
};

type SidebarMenuProps = {
  items: MenuItem[];
};

export function SidebarMenu({ items }: SidebarMenuProps) {
  return (
    <div className="rounded-[16px] border border-gray-200 bg-white">
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
            {item.icon ?? <span className="h-6 w-6 rounded bg-gray-200" />}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
