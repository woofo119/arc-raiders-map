---
description: Cloudtype 배포 가이드 (어떤 서비스를 재배포할지)
---

# Cloudtype 배포 가이드

## 프로젝트 구조
- **arc-server** (Backend) - Node.js 서버
- **arc-map** (Frontend) - React 웹 애플리케이션

---

## 📌 재배포가 필요한 경우

### 🟢 arc-map (프론트엔드) 재배포 필수

다음 파일/폴더를 수정한 경우:
- `client/src/**` - 모든 React 컴포넌트, 페이지
- `client/public/**` - 아이콘, 이미지 등 정적 파일
- `client/package.json` - 의존성 변경
- `client/vite.config.js` - 빌드 설정
- `client/tailwind.config.js` - 스타일 설정

**배포 절차:**
```bash
cd client
npm run build
git add .
git commit -m "Update frontend: [변경 내용]"
git push origin main
```
→ Cloudtype에서 **arc-map** 재배포

---

### 🔵 arc-server (백엔드) 재배포 필수

다음 파일/폴더를 수정한 경우:
- `server/server.js` - 메인 서버 파일
- `server/routes/**` - API 라우트
- `server/controllers/**` - 컨트롤러 로직
- `server/models/**` - MongoDB 모델
- `server/middleware/**` - 미들웨어
- `server/package.json` - 의존성 변경

**배포 절차:**
```bash
git add .
git commit -m "Update backend: [변경 내용]"
git push origin main
```
→ Cloudtype에서 **arc-server** 재배포

---

### 🟠 둘 다 재배포 필요

다음과 같은 경우:
- **API 엔드포인트 변경** (백엔드 + 프론트엔드 모두 수정)
- **새로운 기능 추가** (전체 스택 변경)
- **데이터 모델 변경** (백엔드 모델 + 프론트엔드 UI)

**배포 절차:**
```bash
# 1. 클라이언트 빌드
cd client
npm run build
cd ..

# 2. GitHub 푸시
git add .
git commit -m "Update full stack: [변경 내용]"
git push origin main
```
→ Cloudtype에서 **arc-server**와 **arc-map** 모두 재배포

---

## ⚠️ 주의사항

### 환경 변수 변경 시
- `.env` 파일 변경 후에는 Cloudtype 콘솔에서 직접 환경변수 업데이트 필요
- GitHub에는 `.env` 파일을 푸시하지 않음

### MongoDB 변경 시
- 모델 스키마 변경: **arc-server 재배포**
- 마이그레이션 스크립트 실행 필요 시: 로컬에서 실행 후 **재배포 불필요**

---

## 🚀 빠른 참조

| 변경 파일 경로 | 재배포 대상 |
|--------------|----------|
| `client/src/**` | 🟢 arc-map |
| `client/public/**` | 🟢 arc-map |
| `server/**` | 🔵 arc-server |
| 전체 스택 | 🟠 둘 다 |
