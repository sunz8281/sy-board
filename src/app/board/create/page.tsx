'use client';

import { AppLayout } from "@comp/common/AppLayout/AppLayout";
import PostEditor from "@comp/board/PostEditor";

export default function BoardCreatePage() {
  const activeCategory = 1;

  return (
    <AppLayout header activeCategory={activeCategory}>
      <PostEditor mode="create" activeCategory={activeCategory} />
    </AppLayout>
  );
}
