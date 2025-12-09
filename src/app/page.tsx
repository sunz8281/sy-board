export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="h-[60px] bg-black">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white" />
              <span className="text-white">sy-board</span>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <a className="text-primary font-semibold" href="#">
                게시판
              </a>
              <a className="text-gray-400" href="#">
                시간표
              </a>
              <a className="text-gray-400" href="#">
                강의평가
              </a>
              <a className="text-gray-400" href="#">
                학점계산기
              </a>
              <a className="text-gray-400" href="#">
                친구
              </a>
              <a className="text-gray-400" href="#">
                책방
              </a>
              <a className="text-gray-400" href="#">
                캠퍼스맵
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="h-5 w-5 rounded-full bg-white/30" />
            <div className="h-6 w-6 rounded-full bg-white/30" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] gap-8 px-8 py-8">
        <aside className="flex w-[206px] shrink-0 flex-col gap-4">
          <div className="rounded-[16px] border border-gray-200 bg-white p-5">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200" />
            <div className="text-center">
              <div className="text-sm font-bold text-black">박선영</div>
              <div className="mt-1 text-[12px] text-gray-600">2학년 / 소프트웨어개발과</div>
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

          <div className="rounded-[16px] border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
                <span className="h-6 w-6 rounded bg-gray-200" />
                내 글 모음
              </li>
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
                <span className="h-6 w-6 rounded bg-gray-200" />
                댓글 단 글
              </li>
              <li className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
                <span className="h-6 w-6 rounded bg-gray-200" />
                내 북마크
              </li>
            </ul>
          </div>

          <div className="rounded-[16px] border border-gray-200 bg-white p-4">
            <div className="space-y-3 text-sm">
              <div className="text-gray-600">전체게시판</div>
              <div className="font-semibold text-primary">자유게시판</div>
              <div className="text-gray-600">비밀게시판</div>
              <div className="text-gray-600">졸업생게시판</div>
              <div className="text-gray-600">새내기게시판</div>
            </div>
          </div>

          <button className="h-[50px] rounded-[16px] bg-primary text-base font-semibold text-white">
            새 글쓰기
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <button className="text-[14px] font-medium text-gray-600">← 목록으로</button>
              <h1 className="text-[28px] font-bold leading-[34px] text-black">새 글쓰기</h1>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-[116px] w-full rounded-[8px] border border-dashed border-gray-200 bg-gray-50" />
            </div>
          </div>
        </section>

        <aside className="flex w-[296px] shrink-0 flex-col gap-4">
          <div className="flex h-[43px] items-center rounded-[4px] border border-gray-300 bg-white px-3">
            <span className="text-[14px] text-gray-400">자유 게시판의 글을 검색하세요</span>
            <span className="ml-auto text-[16px]">🔍</span>
          </div>

          <div className="rounded-[16px] border border-gray-300 bg-white p-4">
            <div className="text-[16px] font-semibold text-blue">📈 실시간 인기 글</div>
            <div className="mt-3 space-y-2 text-[14px] text-gray-800">
              <p>오늘 날씨 엄청 춥네요</p>
              <p>중간고사 망했어요...</p>
              <p>학식 맛집 추천해주세요</p>
            </div>
          </div>

          <div className="rounded-[16px] border border-gray-300 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-semibold text-primary">HOT 게시물</div>
              <button className="text-[12px] text-gray-500">전체 &gt;</button>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-[8px] border border-gray-100 p-3">
                <div className="text-[14px] font-semibold text-gray-900">취업이 안될것만 같다</div>
                <div className="mt-1 flex items-center justify-between text-[12px] text-gray-500">
                  <span>댓글 47</span>
                  <span>2025. 12.24.</span>
                </div>
              </div>
              <div className="rounded-[8px] border border-gray-100 p-3">
                <div className="text-[14px] font-semibold text-gray-900">취업이 안될것만 같다</div>
                <div className="mt-1 flex items-center justify-between text-[12px] text-gray-500">
                  <span>댓글 47</span>
                  <span>2025. 12.24.</span>
                </div>
              </div>
              <div className="rounded-[8px] border border-gray-100 p-3">
                <div className="text-[14px] font-semibold text-gray-900">취업이 안될것만 같다</div>
                <div className="mt-1 flex items-center justify-between text-[12px] text-gray-500">
                  <span>댓글 47</span>
                  <span>2025. 12.24.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
