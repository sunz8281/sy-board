import {Button} from "@comp/common/Button/Button";
import {IconChat} from "@icons/src/IconChat";
import * as React from "react";
import Link from "next/link";

const quickMenus = [
    { label: "내 글 모음" },
    { label: "댓글 단 글" },
    { label: "내 북마크" },
];

interface LeftSidebarProps {
    activeCategory?: number;
}

const LeftSidebar = ({activeCategory = 0}: LeftSidebarProps ) => {
    const categories = [{ id: 1, label: "자유 게시판" }, { id: 2, label: "질문 게시판"}];

    const isActive = (id: number) => activeCategory===id

    return (
        <aside className="flex w-[206px] shrink-0 flex-col gap-4">
            <div className="rounded-[16px] border border-gray-200 bg-white p-5">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200" />
                <div className="text-center">
                    <div className="text-sm font-bold text-black">박선영</div>
                    <div className="mt-1 text-[12px] text-gray-600">2학년 / 소프트웨어개발과</div>
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
                {categories.map((category) =>
                    <Link href={`/board/${category.id}`} key={`category-${category.label}-${category.id}`} className={isActive(category.id) ? "font-semibold text-primary" : "text-gray-600"}>
                        {category.label}
                    </Link>
                )}
            </div>

            <Button variant="primary" size="big" rounded className="w-full">
                새 글쓰기
            </Button>
        </aside>
    );
}

export default LeftSidebar;