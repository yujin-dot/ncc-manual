# 원격제어 화면 설명서 (웹)

Claude Design 번들(`project/`)을 정적 웹사이트로 옮긴 결과물입니다. 빌드 과정 없이 `public/`을 그대로 배포합니다.

```
public/
  index.html        브라우저 언어에 따라 /ko/ 또는 /en/으로 이동
  ko/index.html     한국어판 (14페이지)
  en/index.html     영어판 (13페이지, 엘리베이터 페이지 없음)
  assets/
    manual.css      공통 스타일
    manual.js       페이지 이동 · 검색 (페이지 수는 마크업에서 자동 계산)
    img/            도판 (내용 해시 파일명, 한/영 공용 이미지는 한 번만 저장)
vercel.json         Vercel 설정 (출력 폴더 public/)
```

## 로컬에서 보기

```
cd public && python3 -m http.server 8000
# http://localhost:8000/ko/  ·  http://localhost:8000/en/
```

## 수정 방법

- 문구: `public/ko/index.html`, `public/en/index.html`을 직접 수정합니다.
- 이미지 교체: 새 파일을 `public/assets/img/`에 넣고 해당 `<img src>`를 바꿉니다. 크기(가로세로 비율)가 같으면 번호 표시(`.hot`) 위치는 그대로 맞습니다.
- 페이지 추가·삭제: `<section class="page">`와 사이드 메뉴 링크(`.nav a`)를 함께 수정합니다. 하단 페이지 수는 자동으로 맞춰집니다.
