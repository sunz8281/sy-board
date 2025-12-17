# SY Board

> **배포 URL**: [배포된 서비스 URL]
> **테스트 계정**: ID: `test@example.com` / PW: `test1234` (선택사항)

## 📌 프로젝트 소개

고등학생끼리 정보를 공유할 수 있는 게시판입니다. 

- **개발 기간**: 2024.12.1 ~ 2024.12.15
- **개발 인원**: 1인

## 🔍 개선 사항
| 문제점 | 개선 |
| --- | --- |
| 단순한 오류 처리로 예외 발생 시 일관된 HTTP 응답 코드가 전달되지 않음 (orElseThrow 사용) | 전역 예외 핸들링(Global Exception Handler)으로 비즈니스/유효성 오류를 4xx, 기타 예외를 5xx로 변환 |

## ✨ 주요 기능
- 회원가입 / 로그인 / 로그아웃 (`/api/auth/register`, `/api/auth/login`)
- 게시글 목록/상세, 작성/수정/삭제, 카테고리 필터, 작성자만 수정·삭제
- 댓글 트리(대댓글), 작성/수정/삭제(작성자만), 자식이 있는 댓글 소프트 삭제
- 좋아요·북마크 토글: 사용자별 상태 + 집계 수 응답
- UI: 좌측 사이드바(카테고리/퀵메뉴), 게시글 작성/편집 에디터, Storybook

## 🛠️ 기술 스택
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind 기반 유틸
- **Backend**: Next.js API Routes, Prisma 5
- **DB**: PostgreSQL (docker-compose)
- **도구**: Storybook, ESLint, Prettier

## 📂 프로젝트 구조
```
src/
  app/               # App Router 페이지 & API
    api/             # Next.js route handlers
    board/           # 게시판 목록/상세/작성/편집
    signup/          # 회원가입 페이지
  components/        # 공통 UI, 레이아웃, 에디터
  icons/             # 아이콘 컴포넌트
  utils/             # 날짜 포맷, 비밀번호 해시 등
prisma/              # Prisma schema & migrations
docker-compose.yml   # PostgreSQL 로컬 실행
```

## 🔗 API 요약
- 인증: `POST /api/auth/register`, `POST /api/auth/login` → 헤더 `x-user-id` 반환
- 사용자: `GET /api/users/me` (필수 헤더 `x-user-id`)
- 게시글: `GET /api/articles?category=`, `GET /api/articles/:id`, `POST /api/articles`, `PATCH /api/articles/:id`, `DELETE /api/articles/:id`
- 반응: `POST /api/articles/:id/like`, `POST /api/articles/:id/bookmark` (헤더 `x-user-id`)
- 댓글: `POST /api/comments`, `PATCH /api/comments/:id`, `DELETE /api/comments/:id`

## 💻 로컬 실행
1. 의존성 설치
```bash
npm install
```
2. 환경 변수 (`.env`)
```
DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/<DB>?schema=public"
POSTGRES_USER=<USER>
POSTGRES_PASSWORD=<PASSWORD>
POSTGRES_DB=<DB>
```
3. DB 준비
```bash
docker-compose up -d db   # PostgreSQL 16
npm run db:generate       # prisma generate
npm run db:migrate        # prisma migrate dev
```
4. 개발 서버
```bash
npm run dev   # http://localhost:3000
```

## 🧩 스크립트
- `npm run dev` / `build` / `start`
- `npm run lint`, `npm run format`
- `npm run storybook`, `npm run build-storybook`
- `npm run db:generate`, `npm run db:migrate`
