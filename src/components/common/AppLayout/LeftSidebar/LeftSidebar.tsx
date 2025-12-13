import {Button} from "@comp/common/Button/Button";
import {IconChat} from "@icons/src/IconChat";
import * as React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { useEffect, useState } from "react";

const quickMenus = [
    { label: "내 글 모음" },
    { label: "댓글 단 글" },
    { label: "내 북마크" },
];

interface LeftSidebarProps {
    activeCategory?: number;
}

const LeftSidebar = ({activeCategory = 0}: LeftSidebarProps ) => {
    const router = useRouter();
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("사용자");
    const [userInfo, setUserInfo] = useState<string>("");
    const [userError, setUserError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchCategories = async () => {
            setError(null);
            try {
                const res = await fetch("/api/categories", { signal: controller.signal });
                if (!res.ok) throw new Error(`카테고리를 불러오지 못했습니다. (${res.status})`);
                const data = await res.json();
                setCategories(data);
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setError(err.message ?? "카테고리를 불러오지 못했습니다.");
            }
        };
        fetchCategories();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const fetchUser = async () => {
            setUserError(null);
            try {
                const stored = typeof window !== "undefined" ? window.localStorage.getItem("userId") : null;
                const resolvedUserId = stored ? Number(stored) : 1;
                if (typeof window !== "undefined" && !stored) {
                    window.localStorage.setItem("userId", String(resolvedUserId));
                }
                setUserId(resolvedUserId);

                const res = await fetch("/api/users/me", {
                    headers: { "x-user-id": String(resolvedUserId) },
                    signal: controller.signal
                });
                if (!res.ok) throw new Error(`사용자 정보를 불러오지 못했습니다. (${res.status})`);
                const data = await res.json();
                if (data) {
                    setUserName(data.name ?? data.email ?? "사용자");
                    setUserInfo(data.email ?? "");
                }
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setUserError(err.message ?? "사용자 정보를 불러오지 못했습니다.");
            }
        };
        fetchUser();
        return () => controller.abort();
    }, []);

    const isActive = (id: number) => activeCategory===id

    return (
        <aside className="flex w-[206px] shrink-0 flex-col gap-4">
            <div className="rounded-[16px] border border-gray-200 bg-white p-5">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200" />
                <div className="text-center">
                    <div className="text-sm font-bold text-black">{userName}</div>
                    <div className="mt-1 text-[12px] text-gray-600">{userInfo || "로그인 필요"}</div>
                    {userError && <div className="mt-1 text-[11px] text-primary">{userError}</div>}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="grayscale" size="small" rounded={false} className="w-full">
                        내 정보
                    </Button>
                    <Button variant="outlined" size="small" rounded={false} className="w-full">
                        로그아웃
                    </Button>
                </div>
            </div>

            <div className="rounded-[16px] border border-gray-200 bg-white">
                <ul className="divide-y divide-gray-100">
                    {quickMenus.map((item) => (
                        <li key={item.label} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
                            <IconChat className="w-5 h-5" />
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="rounded-[16px] border border-gray-200 bg-white p-4 text-sm flex flex-col gap-6">
                <Link href='/board/0' key='category-전체게시판-1' className={isActive(0) ? "font-semibold text-primary" : "text-gray-600"}>
                    전체게시판
                </Link>
                <hr className="border-gray-200" />
                {error ? (
                    <span className="text-xs text-primary">{error}</span>
                ) : (
                    categories.map((category) =>
                        <Link href={`/board/${category.id}`} key={`category-${category.name}-${category.id}`} className={isActive(category.id) ? "font-semibold text-primary" : "text-gray-600"}>
                            {category.name}
                        </Link>
                    )
                )}
            </div>

            <Button variant="primary" size="big" rounded className="w-full" onClick={() => router.push('/board/create')}>
                새 글쓰기
            </Button>
        </aside>
    );
}

export default LeftSidebar;
