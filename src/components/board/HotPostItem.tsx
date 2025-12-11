type HotPostItemProps = {
  title: string;
  comments: number;
  dateLabel: string;
};

export function HotPostItem({ title, comments, dateLabel }: HotPostItemProps) {
  return (
    <div className="rounded-[8px] border border-[#f2f2f2] p-3">
      <div className="text-[14px] font-semibold text-[#1a1a1a]">{title}</div>
      <div className="mt-1 flex items-center justify-between text-[12px] text-[#999999]">
        <span>댓글 {comments}</span>
        <span>{dateLabel}</span>
      </div>
    </div>
  );
}
