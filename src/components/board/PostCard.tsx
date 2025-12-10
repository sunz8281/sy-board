type PostCardProps = {
  title: string;
  preview: string;
  category: string;
  meta: string;
  stats: string;
};

export function PostCard({ title, preview, category, meta, stats }: PostCardProps) {
  return (
    <article className="rounded-[16px] border border-[#ededed] bg-white p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[16px] font-semibold leading-[19px] text-[#1a1a1a]">{title}</h2>
        <p className="text-[14px] leading-[17px] text-[#808080]">{preview}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-6 items-center rounded-[3px] bg-[#f2f2f2] px-3 text-[12px] text-[#666666]">
            {category}
          </span>
          <span className="text-[12px] text-[#999999]">{meta}</span>
        </div>
        <span className="text-[12px] text-[#999999]">{stats}</span>
      </div>
    </article>
  );
}
