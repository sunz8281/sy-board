'use client';

import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { useParams } from "next/navigation";
import { formatDateDot } from "@utils/formatDate";

type Comment = {
  id: string;
  author: string;
  message: string;
  createdAt: Date;
};

export default function BoardDetailPage() {
  const params = useParams<{ id: string; pageId: string }>();

  const activeCategory = Number.isNaN(Number(params.id)) ? 0 : Number(params.id);

  const post = {
    title: "교수님 오늘 수업 오시나요?",
    commentCount: 47,
    preview: "1교시 수업인데 교수님 안 오시면 알려주세요",
    category: "자유게시판",
    author: "익명",
    postedAt: new Date(),
    views: 567,
    likes: 45,
    favorites: 1,
  };

  const comments: Comment[] = [
    { id: "c1", author: "익명", message: "방금 오셨어요", createdAt: new Date() },
    { id: "c2", author: "익명", message: "과제 미리 알려주시면 좋겠어요", createdAt: new Date() },
    { id: "c3", author: "익명", message: "출석만 하신대요", createdAt: new Date() },
  ];

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={activeCategory}>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <button className="text-sm font-medium text-gray-600">← 목록으로</button>
        </div>

        <article className="rounded-[16px] border border-gray-200 bg-white p-6">
          <header className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <span className="text-gray-500">👤</span>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{post.author}</div>
              <div className="text-xs text-gray-500">
                {formatDateDot(post.postedAt)} {post.category}
              </div>
            </div>
          </header>

          <div className="mt-4 space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">{post.title}</h1>
            <div className="text-sm text-gray-600">{post.preview}</div>
            <div className="text-sm text-gray-500">💬 {post.commentCount} · ⭐️ {post.favorites} · 👍 {post.likes}</div>
          </div>
        </article>

        <form className="flex items-center gap-2 rounded-[16px] border border-gray-200 bg-white px-4 py-3">
          <input
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            placeholder="댓글을 입력하세요..."
            aria-label="댓글 입력"
          />
          <button type="submit" className="rounded-[12px] bg-primary px-4 py-2 text-sm font-semibold text-white">
            등록
          </button>
        </form>

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-[16px] border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-gray-500 text-sm">👤</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{comment.author}</div>
                    <div className="text-xs text-gray-500">{formatDateDot(comment.createdAt)}</div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-800">{comment.message}</p>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
