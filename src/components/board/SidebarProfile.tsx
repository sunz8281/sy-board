type ProfileProps = {
  name: string;
  info: string;
};

export function SidebarProfile({ name, info }: ProfileProps) {
  return (
    <div className="rounded-[16px] border border-gray-200 bg-white p-5">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200" />
      <div className="text-center">
        <div className="text-sm font-bold text-black">{name}</div>
        <div className="mt-1 text-[12px] text-gray-600">{info}</div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button className="h-8 flex-1 rounded-[4px] bg-gray-100 text-[12px] font-medium text-gray-600">
          내 정보
        </button>
        <button className="h-8 flex-1 rounded-[4px] border border-gray-300 text-[12px] font-medium text-gray-600">
          로그아웃
        </button>
      </div>
    </div>
  );
}
