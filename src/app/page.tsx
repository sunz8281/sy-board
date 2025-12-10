import { Header } from "@comp/board/Header";
import { SidebarProfile } from "@comp/board/SidebarProfile";
import { SidebarMenu } from "@comp/board/SidebarMenu";
import { CategoryList } from "@comp/board/CategoryList";
import { PostCard } from "@comp/board/PostCard";
import { HotPostItem } from "@comp/board/HotPostItem";
import Input from "@comp/common/Input/Input";

export default function Home() {
  const navItems = [
    { label: "게시판", href: "#", active: true },
    { label: "시간표", href: "#", active: false },
    { label: "강의평가", href: "#", active: false },
    { label: "학점계산기", href: "#", active: false },
    { label: "친구", href: "#", active: false },
    { label: "책방", href: "#", active: false },
    { label: "캠퍼스맵", href: "#", active: false },
  ];

  const quickMenus = [
    { label: "내 글 모음" },
    { label: "댓글 단 글" },
    { label: "내 북마크" },
  ];

  const categories = [
    { label: "전체게시판" },
    { label: "자유게시판", active: true },
    { label: "비밀게시판" },
    { label: "졸업생게시판" },
    { label: "새내기게시판" },
  ];

  const posts = [
    {
      title: "교수님 오늘 수업 오시나요?  [1]",
      preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
      category: "자유게시판",
      meta: "익명    30분 전",
      stats: "👁 567   👍 45   💬 1",
    },
    {
      title: "교수님 오늘 수업 오시나요?  [1]",
      preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
      category: "자유게시판",
      meta: "익명    30분 전",
      stats: "👁 567   👍 45   💬 1",
    },
    {
      title: "교수님 오늘 수업 오시나요?  [1]",
      preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
      category: "자유게시판",
      meta: "익명    30분 전",
      stats: "👁 567   👍 45   💬 1",
    },
    {
      title: "교수님 오늘 수업 오시나요?  [1]",
      preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
      category: "자유게시판",
      meta: "익명    30분 전",
      stats: "👁 567   👍 45   💬 1",
    },
    {
      title: "교수님 오늘 수업 오시나요?  [1]",
      preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
      category: "자유게시판",
      meta: "익명    30분 전",
      stats: "👁 567   👍 45   💬 1",
    },
  ];

  const hotPosts = [
    { title: "취업이 안될것만 같다", comments: 47, date: "2025. 12.24." },
    { title: "취업이 안될것만 같다", comments: 47, date: "2025. 12.24." },
    { title: "취업이 안될것만 같다", comments: 47, date: "2025. 12.24." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header items={navItems} />

      <main className="mx-auto flex w-full max-w-[1440px] gap-8 px-8 py-8">
        <aside className="flex w-[206px] shrink-0 flex-col gap-4">
          <SidebarProfile name="박선영" info="2학년 / 소프트웨어개발과" />

          <SidebarMenu items={quickMenus} />

          <CategoryList categories={categories} />

          <button className="h-[50px] rounded-[16px] bg-primary text-base font-semibold text-white">
            새 글쓰기
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <button className="text-[14px] font-medium text-gray-600">← 목록으로</button>
              <h1 className="text-[28px] font-bold leading-[34px] text-black">자유게시판</h1>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {posts.map((post, idx) => (
              <PostCard key={`${post.title}-${idx}`} {...post} />
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
                <HotPostItem key={`${hot.title}-${hot.date}-${hot.comments}`} {...hot} />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
