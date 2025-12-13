'use client';

import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import PostEditor from "@comp/board/PostEditor";
import { useParams } from "next/navigation";

export default function BoardEditPage() {
  const params = useParams<{ id: string; pageId: string }>();
  const activeCategory = Number.isNaN(Number(params.id)) ? 0 : Number(params.id);

  // TODO: load post details by pageId; using placeholder content for now
  const initialTitle = "교수님 오늘 수업 오시나요?";
  const initialContent = "1교시 수업인데 교수님 안 오시면 알려주세요";

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={activeCategory}>
      <PostEditor mode="edit" activeCategory={activeCategory} initialTitle={initialTitle} initialContent={initialContent} />
    </AppLayout>
  );
}
