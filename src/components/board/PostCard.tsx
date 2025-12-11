type PostCardProps = {
  title: string;
  commentCount: number;
  preview: string;
  category: string;
  author: string;
  postedAt: string;
  views: number;
  likes: number;
  favorites: number;
};

export function PostCard({
  title,
  commentCount,
  preview,
  category,
  author,
  postedAt,
  views,
  likes,
  favorites,
}: PostCardProps) {
  return (
    <article className="rounded-[16px] border border-[#ededed] bg-white p-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold leading-[19px] text-[#1a1a1a]">{title}</h2>
          <span className="text-[12px] font-semibold text-primary">[{commentCount}]</span>
        </div>
        <p className="text-[14px] leading-[17px] text-[#808080]">{preview}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-6 items-center rounded-[3px] bg-[#f2f2f2] px-3 text-[12px] text-[#666666]">
            {category}
          </span>
          <span className="text-[12px] text-[#999999]">
            {author} · {postedAt}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-[#999999]">
          <span>👁 {views}</span>
          <span>👍 {likes}</span>
          <span>⭐️ {favorites}</span>
        </div>
      </div>
    </article>
  );
}
