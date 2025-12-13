'use client';

import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import PostEditor from "@comp/board/PostEditor";
import { useParams } from "next/navigation";

export default function BoardCreatePage() {
  const params = useParams<{ id: string }>();
  const activeCategory = Number.isNaN(Number(params.id)) ? 0 : Number(params.id);

  return (
    <AppLayout header leftSidebar rightSidebar activeCategory={activeCategory}>
      <PostEditor mode="create" activeCategory={activeCategory} />
    </AppLayout>
  );
}
