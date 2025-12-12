import Input from "@comp/common/Input/Input";
import {HotPostItem} from "@comp/board/HotPostItem";
import { formatDateDot } from "@utils/formatDate";

const RightSidebar = () => {
    const hotPosts = [
        { title: "오늘 날씨 엄청 춥네요", comments: 12, date: new Date("2025-12-24T09:00:00+09:00") },
        { title: "중간고사 망했어요...", comments: 24, date: new Date("2025-12-23T10:00:00+09:00") },
        { title: "학식 맛집 추천해주세요", comments: 9, date: new Date("2025-12-22T12:00:00+09:00") },
    ];

    return (
        <aside className="flex w-[296px] shrink-0 flex-col gap-4">
            <Input
                className="h-[43px] py-[12px]"
                placeholder="자유 게시판의 글을 검색하세요"
                rightIcon={<span aria-hidden>🔍</span>}
            />

            <div className="rounded-[16px] border border-gray-300 bg-white p-4">
                <div className="text-[16px] font-semibold text-blue">📈 실시간 인기 글</div>
                <div className="mt-3 space-y-2 text-[14px] text-gray-800">
                    <p>오늘 날씨 엄청 춥네요</p>
                    <p>중간고사 망했어요...</p>
                    <p>학식 맛집 추천해주세요</p>
                </div>
            </div>

            <div className="rounded-[16px] border border-gray-300 bg-white p-4">
                <div className="flex items-center justify-between">
                    <div className="text-[16px] font-semibold text-primary">HOT 게시물</div>
                    <button className="text-[12px] text-gray-500">전체 &gt;</button>
                </div>
                <div className="mt-3 space-y-3">
                    {hotPosts.map((hot) => (
                        <HotPostItem
                            key={`${hot.title}-${hot.date.toISOString()}`}
                            title={hot.title}
                            comments={hot.comments}
                            dateLabel={formatDateDot(hot.date)}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default RightSidebar;