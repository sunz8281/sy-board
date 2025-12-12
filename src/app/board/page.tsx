import { Header } from "@comp/board/Header";
import { SidebarProfile } from "@comp/board/SidebarProfile";
import { SidebarMenu } from "@comp/board/SidebarMenu";
import { CategoryList } from "@comp/board/CategoryList";
import { PostCard } from "@comp/board/PostCard";
import { HotPostItem } from "@comp/board/HotPostItem";
import Input from "@comp/common/Input/Input";
import { Button } from "@comp/common/Button/Button";
import { IconUser } from "@/icons";

type SearchParams = {
  category?: string;
};

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}. ${m}.${d}.`;
}

export default function BoardPage({ searchParams }: { searchParams: SearchParams }) {
  const selectedCategory = searchParams?.category ?? "자유게시판";

  const quickMenus = [
    { label: "내 글 모음", icon: <IconUser className="h-5 w-5 text-gray-600" /> },
    { label: "댓글 단 글" },
    { label: "내 북마크" },
  ];

  const categories = ["전체게시판", "자유게시판", "비밀게시판", "졸업생게시판", "새내기게시판"];

  const posts = [
    {
      title: "교수님 오늘 수업 오시나요?",
      commentCount: 1,
      preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
      category: "자유게시판",
      author: "익명",
      postedAt: new Date(),
      views: 567,
      likes: 45,
      favorites: 1,
    },
    {
      title: "과제 제출 마감 공지 확인해주세요",
      commentCount: 2,
      preview: "마감 시간 착오 없도록 다시 확인 바랍니다",
      category: "자유게시판",
      author: "익명",
      postedAt: new Date(),
      views: 432,
      likes: 32,
      favorites: 3,
    },
    {
      title: "내일 스터디 모임 있을까요?",
      commentCount: 0,
      preview: "시간 맞춰서 참여 가능한 분들 댓글 남겨주세요",
      category: "자유게시판",
      author: "익명",
      postedAt: new Date(),
      views: 210,
      likes: 12,
      favorites: 0,
    },
    {
      title: "기말고사 대비 팁 공유",
      commentCount: 5,
      preview: "효율적인 공부법을 정리해봤습니다",
      category: "자유게시판",
      author: "익명",
      postedAt: new Date(),
      views: 789,
      likes: 67,
      favorites: 9,
    },
    {
      title: "동아리 모집 안내",
      commentCount: 3,
      preview: "신입 멤버를 모집합니다. 관심 있는 분들 신청해주세요",
      category: "자유게시판",
      author: "익명",
      postedAt: new Date(),
      views: 156,
      likes: 18,
      favorites: 4,
    },
  ];

  const hotPosts = [
    { title: "오늘 날씨 엄청 춥네요", comments: 12, date: new Date("2025-12-24T09:00:00+09:00") },
    { title: "중간고사 망했어요...", comments: 24, date: new Date("2025-12-23T10:00:00+09:00") },
    { title: "학식 맛집 추천해주세요", comments: 9, date: new Date("2025-12-22T12:00:00+09:00") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto flex w-full max-w-[1440px] gap-8 px-8 py-8">
        <aside className="flex w-[206px] shrink-0 flex-col gap-4">
          <SidebarProfile name="박선영" info="2학년 / 소프트웨어개발과" />

          <SidebarMenu items={quickMenus} />

          <CategoryList categories={categories} activeCategory={selectedCategory} />

          <Button variant="primary" size="big" rounded className="w-full">
            새 글쓰기
          </Button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="grayscale" size="small" rounded={false} className="px-3">
                ← 목록으로
              </Button>
              <h1 className="text-[28px] font-bold leading-[34px] text-black">{selectedCategory}</h1>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {posts.map((post, idx) => (
              <PostCard
                key={`${post.title}-${idx}`}
                title={post.title}
                commentCount={post.commentCount}
                preview={post.preview}
                category={post.category}
                author={post.author}
                postedAt={post.postedAt.toString()}
                views={post.views}
                likes={post.likes}
                favorites={post.favorites}
              />
            ))}
          </div>
        </section>

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
                  dateLabel={formatDate(hot.date)}
                />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
