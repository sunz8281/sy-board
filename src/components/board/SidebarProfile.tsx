import { Button } from "@comp/common/Button/Button";

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
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="grayscale" size="small" rounded={false} className="w-full">
          내 정보
        </Button>
        <Button variant="outlined" size="small" rounded={false} className="w-full">
          로그아웃
        </Button>
      </div>
    </div>
  );
}
