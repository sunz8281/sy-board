# SY Board

> **배포 URL**: https://sy-board.onrender.com/
> **테스트 계정**: ID: `test@example.com` / PW: `test1234`

## 📌 프로젝트 소개

정보를 공유할 수 있는 게시판입니다. 

- **개발 기간**: 2024.12.1 ~ 2024.12.15
- **개발 인원**: 1인

## 🔍 개선 사항
| 문제점 | 개선 |
| --- | --- |
| 단순한 오류 처리로 예외 발생 시 일관된 HTTP 응답 코드가 전달되지 않음 (orElseThrow 사용) | 전역 예외 핸들링(Global Exception Handler)으로 비즈니스/유효성 오류를 4xx, 기타 예외를 5xx로 변환 |

### 개선 결과

- **개선 전**: 모든 예외가 500 에러로 반환되어 클라이언트가 원인 파악 불가
- **개선 후**: 비즈니스 예외별로 적절한 HTTP 상태 코드(400, 404 등)와 명확한 에러 메시지 제공

---

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

## 🔗 API 명세
### 인증
| Method | Endpoint | Description | 비고 |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | 회원가입 | 응답 헤더 `x-user-id` 반환 |
| POST | `/api/auth/login` | 로그인 | 응답 헤더 `x-user-id` 반환 |

### 사용자
| Method | Endpoint | Description | 비고 |
| --- | --- | --- | --- |
| GET | `/api/users/me` | 내 정보 조회 | 헤더 `x-user-id` 필수 |

### 게시글
| Method | Endpoint | Description | 비고 |
| --- | --- | --- | --- |
| GET | `/api/articles?category={id}` | 게시글 목록 조회 (카테고리 필터) | id 없으면 전체 |
| GET | `/api/articles/{id}` | 게시글 상세 + 댓글 트리 + 좋아요/북마크 상태 | 헤더 `x-user-id` 선택 |
| POST | `/api/articles` | 게시글 작성 | 헤더 `x-user-id` 필수 |
| PATCH | `/api/articles/{id}` | 게시글 수정 | 작성자 + `x-user-id` 필수 |
| DELETE | `/api/articles/{id}` | 게시글 삭제 | 작성자 + `x-user-id` 필수 |

### 반응(좋아요/북마크)
| Method | Endpoint | Description | 비고 |
| --- | --- | --- | --- |
| POST | `/api/articles/{id}/like` | 좋아요 토글 | 헤더 `x-user-id` 필수 |
| POST | `/api/articles/{id}/bookmark` | 북마크 토글 | 헤더 `x-user-id` 필수 |

### 댓글
| Method | Endpoint | Description | 비고 |
| --- | --- | --- | --- |
| POST | `/api/comments` | 댓글/대댓글 작성 | `content`, `articleId`, `parentId?`, `x-user-id` |
| PATCH | `/api/comments/{id}` | 댓글 수정 | 작성자 + `x-user-id` 필수 |
| DELETE | `/api/comments/{id}` | 댓글 삭제 | 작성자 + `x-user-id` 필수 (자식 있으면 소프트 삭제) |



## 💻 로컬 실행
1. 의존성 설치
```bash
bun install
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
bun run db:generate       # prisma generate
bun run db:migrate        # prisma migrate dev
```
4. 개발 서버
```bash
bun run dev   # http://localhost:3000
```
---

## 🎥 시연 영상

https://youtu.be/4t7ttZQZK-E
