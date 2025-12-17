"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@comp/common/Input/Input";
import { HotPostItem } from "@comp/board/HotPostItem";
import { formatDateDot } from "@utils/formatDate";

type SimplePost = {
    id: number;
    title: string;
    commentsCount: number;
    createdAt: string;
};

const RightSidebar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [popular, setPopular] = useState<SimplePost[]>([]);
    const [hot, setHot] = useState<SimplePost[]>([]);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await fetch("/api/articles/popular");
                if (res.ok) setPopular(await res.json());
            } catch {
                // ignore
            }
        };
        const fetchHot = async () => {
            try {
                const res = await fetch("/api/articles/hot");
                if (res.ok) setHot(await res.json());
            } catch {
                // ignore
            }
        };
        fetchPopular();
        fetchHot();
    }, []);

    useEffect(() => {
        const current = searchParams.get("q") ?? "";
        setSearch(current);
    }, [searchParams]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/search?q=${encodeURIComponent(search)}`);
    };

    return (
        <aside className="flex w-[296px] shrink-0 flex-col gap-4">
            <form onSubmit={handleSearchSubmit}>
                <Input
                    className="h-[43px] py-[12px]"
                    placeholder="게시글을 검색해요"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    rightIcon={<span aria-hidden>🔍</span>}
                />
            </form>

            <div className="rounded-[16px] border border-gray-300 bg-white p-4">
                <div className="text-[16px] font-semibold text-blue">📈 실시간 인기 글</div>
                <div className="mt-3 space-y-2 text-[14px] text-gray-800">
                    {popular.length === 0 && <p className="text-sm text-gray-500">불러오는 중...</p>}
                    {popular.slice(0, 3).map((item) => (
                        <button
                            key={item.id}
                            className="block text-left hover:text-primary"
                            onClick={() => router.push(`/board/article/${item.id}`)}
                        >
                            {item.title} <span className="text-xs text-gray-500">({item.commentsCount}댓글)</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-[16px] border border-gray-300 bg-white p-4">
                <div className="flex items-center justify-between">
                    <div className="text-[16px] font-semibold text-primary">HOT 게시물</div>
                    <button className="text-[12px] text-gray-500" onClick={() => router.push("/search?q=hot")}>전체 &gt;</button>
                </div>
                <div className="mt-3 space-y-3">
                    {hot.length === 0 && <p className="text-sm text-gray-500">불러오는 중...</p>}
                    {hot.slice(0, 3).map((hotItem) => (
                        <HotPostItem
                            key={`${hotItem.id}`}
                            title={hotItem.title}
                            comments={hotItem.commentsCount}
                            dateLabel={formatDateDot(new Date(hotItem.createdAt))}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
