# 멍멍 산책 (Puppy Walk)

초등학교 2학년 아이가 핸드폰에서 토리와 산책하며 짧은 학습 미션을 푸는 모바일 웹 학습 게임입니다. 공부 앱처럼 딱딱하지 않게, 귀여운 강아지 산책 스티커북 느낌으로 만들었습니다.

## 대상 사용자

- 초등학교 2학년 전후의 어린이
- 강아지와 꾸미기 놀이를 좋아하는 아이
- 짧은 시간에 수학, 국어, 영어, 추론, 생활 판단 문제를 풀고 싶은 사용자

## 주요 기능

- 산책 1회당 5개 미션 진행
- 수학, 영어, 국어, 추론, 생활 판단 문제 랜덤 출제
- 정답 보상으로 간식 코인, 스티커, 배지, 하트 지급
- localStorage 기반 진행 상황 저장
- 산책 완료와 보상 조건에 따른 꾸미기 아이템 해금
- 강아지 본체와 꾸미기 아이템을 분리한 SVG 구조
- GitHub Pages에 올릴 수 있는 정적 HTML/CSS/JavaScript 앱
- PWA용 `manifest.json`과 `service-worker.js` 포함

## 실행 방법

파일을 그대로 브라우저에서 열면 실행됩니다.

```text
index.html
```

로컬 서버로 확인하려면 프로젝트 폴더에서 아래처럼 실행할 수 있습니다.

```bash
python3 -m http.server 8080
```

그 뒤 브라우저에서 `http://localhost:8080`을 엽니다.

## GitHub Pages 배포 방법

1. 이 폴더의 파일을 GitHub 저장소에 커밋합니다.
2. GitHub 저장소의 Settings > Pages로 이동합니다.
3. Branch를 `main`, 폴더를 `/root`로 선택합니다.
4. 저장 후 표시되는 Pages URL로 접속합니다.

모든 경로는 상대 경로를 사용하므로 저장소 이름이 붙는 GitHub Pages 경로에서도 동작하도록 구성되어 있습니다.

## 파일 구조

```text
/
├─ index.html
├─ style.css
├─ script.js
├─ questions.json
├─ manifest.json
├─ service-worker.js
├─ README.md
└─ assets/
   ├─ dog/
   ├─ items/
   ├─ backgrounds/
   └─ icons/
```

## 문제 추가 방법

`questions.json` 배열에 새 문제 객체를 추가합니다. 산책 문제는 `script.js`에서 카테고리 비율에 맞춰 뽑습니다.

## questions.json 문제 형식

```json
{
  "id": "math_mul_001",
  "category": "math",
  "type": "multiplication",
  "level": 1,
  "scene": "snack_shop",
  "imageKey": "snack",
  "prompt": "간식이 4개씩 3봉지 있어. 모두 몇 개일까?",
  "choices": ["7", "12", "14", "16"],
  "answerIndex": 1,
  "hint": "4개짜리 묶음이 3개야.",
  "correctFeedback": "맞았어! 4 x 3은 12야.",
  "wrongFeedback": "괜찮아. 4씩 세 번 세어보자.",
  "reward": {
    "type": "snack_coin",
    "amount": 2
  }
}
```

사용 가능한 주요 카테고리는 `math`, `english`, `korean`, `reasoning`, `life`입니다.

## 이미지 교체 방법

- 강아지 이미지는 `assets/dog/` 안의 SVG를 같은 파일명으로 교체하면 됩니다.
- 꾸미기 아이템은 `assets/items/` 안의 SVG를 교체하면 됩니다.
- 문제 그림은 `script.js`의 `imageMap`에서 `imageKey`별 표시를 관리합니다.

초기 버전은 이모지와 SVG 중심으로 구성되어 있으며, 나중에 PNG 또는 더 정교한 SVG로 쉽게 바꿀 수 있습니다.

## 꾸미기 아이템 추가 방법

1. `assets/items/`에 새 이미지 파일을 넣습니다.
2. `script.js`의 `itemCatalog`에 아이템 정보를 추가합니다.
3. 아이템 위치가 필요하면 `style.css`에 `.item-*` 위치 클래스를 추가합니다.

아이템은 강아지 본체 위에 `position: absolute`로 얹히므로 강아지 이미지와 독립적으로 관리됩니다.

## 향후 개선 아이디어

- 실제 일러스트 PNG/SVG 에셋 추가
- 산책 장소별 배경 이미지 확장
- 문제 난이도 선택
- 아이템 착용 위치 미세 조정 UI
- 산책 완료 스티커북 앨범
- 보호자용 문제 편집 도구
