'use client';

import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import { useParams } from "next/navigation";
import { formatDateDot } from "@utils/formatDate";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@comp/common/Button/Button";
import Input from "@comp/common/Input/Input";

type Comment = {
  id: number;
  content: string | null;
  author: string | null;
  createdAt: string;
  updatedAt: string;
  modified: boolean;
  deleted: boolean;
  children: Comment[];
};

export default function BoardDetailPage() {
  const params = useParams<{ pageId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<{
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    category: { id: number; name: string };
    author: string | null;
    comments: Comment[];
    commentsCount: number;
    likesCount: number;
    bookmarksCount: number;
  } | null>(null);

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [commentActionError, setCommentActionError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  const loadArticle = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${params.pageId}`, { signal });
      if (!res.ok) {
        throw new Error(`게시글을 불러오지 못했습니다. (${res.status})`);
      }
      const data = await res.json();
      setArticle(data);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError(err.message ?? "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadArticle(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.pageId]);

  const flattenedComments = useMemo(() => article?.comments ?? [], [article]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setCommentActionError(null);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          articleId: article?.id,
          authorId: 1, // TODO: 실제 로그인 사용자 ID로 대체
        }),
      });
      if (!res.ok) throw new Error("댓글 등록에 실패했습니다.");
      setCommentText("");
      // refetch comments
      await loadArticle();
    } catch (err: any) {
      setCommentActionError(err.message ?? "댓글 등록에 실패했습니다.");
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content ?? "");
    setCommentActionError(null);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommentId) return;
    if (!editingText.trim()) return;
    try {
      const res = await fetch(`/api/comments/${editingCommentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingText }),
      });
      if (!res.ok) throw new Error("댓글 수정에 실패했습니다.");
      setEditingCommentId(null);
      setEditingText("");
      await loadArticle();
    } catch (err: any) {
      setCommentActionError(err.message ?? "댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId);
    setCommentActionError(null);
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("댓글 삭제에 실패했습니다.");
      await loadArticle();
    } catch (err: any) {
      setCommentActionError(err.message ?? "댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeleteArticle = async () => {
    if (!article) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("게시글 삭제에 실패했습니다.");
      router.push(`/board/${article.category?.id ?? 0}`);
    } catch (err: any) {
      setDeleteError(err.message ?? "게시글 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const renderComments = (nodes: Comment[]) => {
    return nodes.map((comment) => (
      <div key={comment.id} className="rounded-[16px] border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <span className="text-gray-500 text-sm">👤</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{comment.author ?? "익명"}</div>
              <div className="text-xs text-gray-500">
                {formatDateDot(new Date(comment.createdAt))}
                {comment.modified ? " · 수정됨" : ""}
              </div>
            </div>
          </div>
          {!comment.deleted && (
            <div className="flex items-center gap-2 text-xs">
              <Button
                size="small"
                variant="outlined"
                rounded
                onClick={() => startEditComment(comment)}
              >
                수정
              </Button>
              <Button
                size="small"
                variant="outlined"
                rounded
                disabled={deletingCommentId === comment.id}
                onClick={() => handleDeleteComment(comment.id)}
                className="text-primary"
              >
                {deletingCommentId === comment.id ? "삭제중..." : "삭제"}
              </Button>
            </div>
          )}
        </div>
        {editingCommentId === comment.id ? (
          <form onSubmit={handleSubmitEdit} className="mt-2 space-y-2">
            <textarea
              className="w-full rounded border border-gray-200 p-2 text-sm"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="small" type="submit">
                저장
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditingText("");
                }}
              >
                취소
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-2 text-sm text-gray-800">{comment.content ?? "(삭제된 댓글입니다)"}</p>
        )}
        {comment.children?.length ? (
          <div className="mt-3 space-y-2 border-l border-gray-200 pl-3">
            {renderComments(comment.children)}
          </div>
        ) : null}
      </div>
    ));
  };

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={article?.category?.id}>
      <section className="flex min-w-[400px] flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href="/board/0" className="text-sm font-medium text-gray-600">← 목록으로</Link>
          {article && (
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/board/article/${article.id}/edit`}
                className="rounded-[10px] border border-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-50"
              >
                수정
              </Link>
              <button
                onClick={handleDeleteArticle}
                disabled={deleting}
                className="rounded-[10px] border border-gray-200 px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>

        {loading && <div className="text-sm text-gray-600">불러오는 중...</div>}
        {error && <div className="text-sm text-primary">{error}</div>}
        {deleteError && <div className="text-sm text-primary">{deleteError}</div>}
        {commentActionError && <div className="text-sm text-primary">{commentActionError}</div>}

        {article && !loading && !error && (
          <>
            <article className="rounded-[16px] border border-gray-200 bg-white p-6">
              <header className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-gray-500">👤</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{article.author ?? "익명"}</div>
                  <div className="text-xs text-gray-500">
                    {formatDateDot(new Date(article.createdAt))} {article.category?.name ?? ""}
                  </div>
                </div>
              </header>

              <div className="mt-4 space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{article.title}</h1>
                <div className="text-sm text-gray-600 whitespace-pre-line">{article.content}</div>
                <div className="text-sm text-gray-500">
                  💬 {article.commentsCount} · ⭐️ {article.bookmarksCount} · 👍 {article.likesCount}
                </div>
              </div>
            </article>

            <form
              onSubmit={handleSubmitComment}
              className="flex items-center gap-2"
            >
              <Input
                rounded
                placeholder="댓글을 입력하세요..."
                aria-label="댓글 입력"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" className="w-[100px]" disabled={!commentText.trim()}>
                등록
              </Button>
            </form>

            <div className="space-y-3">{renderComments(flattenedComments)}</div>
          </>
        )}
      </section>
    </AppLayout>
  );
}
