import { PostCard } from "@comp/board/PostCard";
import Header from "@comp/common/AppLayout/Header/Header";
import {AppLayout} from "@comp/common/AppLayout/AppLayout";

interface BoardPageProps {
    params?: {
        id?: number;
    }
}

export default function BoardPage({ params }: BoardPageProps) {
  const id = params?.id ?? 0;

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

  return (
    <AppLayout header leftSidebar rightSidebar>
        <section className="flex min-w-[400px] flex-1 flex-col gap-4">
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
        </section>
    </AppLayout>
  );
}
