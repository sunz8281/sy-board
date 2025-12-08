import Link from "next/link";
import {IconBell, IconUser} from "@/icons";

export function Header() {
    const menuItems = [
        { label: '게시판', href: '/', active: true },
        { label: '시간표', href: '/timetable' },
    ];

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-500 rounded-full" />
                            <span className="text-gray-900">sy-board</span>
                        </Link>
                        <nav className="flex gap-6">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={item.active ? 'text-red-500' : 'text-gray-700 hover:text-gray-900'}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <IconBell className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <IconUser className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
