const STORAGE_KEY = "puppyWalkSaveV1";
const WALK_LENGTH = 5;

const imageMap = {
  dog: "🐶", ball: "🎾", bone: "🦴", water: "💧", house: "🏠", park: "🌳",
  ribbon: "🎀", clock: "🕒", coin: "🪙", heart: "💖", star: "⭐", bag: "🎒",
  book: "📖", shoes: "👟", snack: "🍪", leash: "🦮", flower: "🌼"
};

const scenes = {
  park: { name: "햇살 공원", icon: "🌳" },
  playground: { name: "놀이터", icon: "🛝" },
  snack_shop: { name: "간식 가게", icon: "🍪" },
  home: { name: "집 앞", icon: "🏠" },
  training: { name: "훈련 장소", icon: "🎾" },
  crosswalk: { name: "횡단보도", icon: "🚦" }
};

const rewardLabels = {
  snack_coin: ["간식 코인", "🪙", "snackCoins"],
  word_sticker: ["단어 스티커", "🔤", "wordStickers"],
  alphabet_paw: ["알파벳 발자국", "🐾", "alphabetPaws"],
  speech_sticker: ["말풍선 스티커", "💬", "speechStickers"],
  star_badge: ["별 배지", "⭐", "starBadges"],
  heart: ["하트", "💖", "hearts"]
};

const itemCatalog = [
  { id: "ribbon-basic", name: "기본 리본", file: "assets/items/ribbon-basic.svg", slot: "ribbon", className: "item-ribbon", condition: "산책 1회 완료", check: s => s.completedWalks >= 1 },
  { id: "ribbon-pink", name: "분홍 리본", file: "assets/items/ribbon-pink.svg", slot: "ribbon", className: "item-ribbon", condition: "간식 코인 10개", check: s => s.snackCoins >= 10 },
  { id: "collar-blue", name: "파란 목걸이", file: "assets/items/collar-blue.svg", slot: "collar", className: "item-collar", condition: "처음부터 사용 가능", check: () => true },
  { id: "collar-star", name: "별 목걸이", file: "assets/items/collar-star.svg", slot: "collar", className: "item-collar", condition: "말풍선 스티커 8개", check: s => s.speechStickers >= 8 },
  { id: "hat-detective", name: "탐정 모자", file: "assets/items/hat-detective.svg", slot: "hat", className: "item-hat", condition: "별 배지 5개", check: s => s.starBadges >= 5 },
  { id: "walk-bag", name: "산책 가방", file: "assets/items/walk-bag.svg", slot: "bag", className: "item-bag", condition: "간식 코인 20개", check: s => s.snackCoins >= 20 },
  { id: "heart-badge", name: "하트 배지", file: "assets/items/heart-badge.svg", slot: "badge", className: "item-badge", condition: "하트 5개", check: s => s.hearts >= 5 },
  { id: "dog-collar", name: "DOG 목걸이", file: "assets/items/dog-collar.svg", slot: "collar", className: "item-collar", condition: "영어 문제 5개 성공", check: s => s.englishCorrectCount >= 5 }
];

const fallbackQuestions = [
  { id: "fallback_math", category: "math", type: "multiplication", level: 1, scene: "snack_shop", imageKey: "snack", prompt: "간식이 4개씩 3봉지 있어. 토리가 2개를 먹었어. 몇 개 남았을까?", choices: ["10", "12", "14", "8"], answerIndex: 0, hint: "4 x 3을 먼저 하고 2를 빼보자.", correctFeedback: "맞았어! 12개에서 2개를 먹어서 10개야.", wrongFeedback: "괜찮아. 먼저 간식이 모두 몇 개인지 세어보자.", reward: { type: "snack_coin", amount: 2 } },
  { id: "fallback_eng", category: "english", type: "picture_word", level: 1, scene: "park", imageKey: "dog", prompt: "그림에 알맞은 영어 단어를 골라줘.", choices: ["dog", "ball", "bag", "sit"], answerIndex: 0, hint: "토리 같은 동물을 영어로 떠올려봐.", correctFeedback: "좋아! 강아지는 dog야.", wrongFeedback: "그림을 다시 살펴보자.", reward: { type: "word_sticker", amount: 1 } },
  { id: "fallback_reason", category: "reasoning", type: "pattern", level: 1, scene: "playground", imageKey: "star", prompt: "⭐ 🐾 ⭐ 🐾 다음에 올 모양은 무엇일까?", choices: ["⭐", "🐾", "💧", "🪙"], answerIndex: 0, hint: "별과 발자국이 번갈아 나오고 있어.", correctFeedback: "맞아! 다시 별 차례야.", wrongFeedback: "괜찮아. 모양이 어떤 순서로 반복되는지 보자.", reward: { type: "star_badge", amount: 1 } },
  { id: "fallback_korean", category: "korean", type: "vocabulary", level: 1, scene: "home", imageKey: "book", prompt: "'토리가 꼬리를 살랑살랑 흔들었다'에서 살랑살랑은 어떤 느낌일까?", choices: ["부드럽게 움직임", "아주 크게 소리침", "천천히 잠듦", "세게 달림"], answerIndex: 0, hint: "바람이나 꼬리가 가볍게 움직일 때 쓰는 말이야.", correctFeedback: "맞았어! 살랑살랑은 부드럽게 움직이는 느낌이야.", wrongFeedback: "말의 느낌을 떠올려보자.", reward: { type: "speech_sticker", amount: 1 } },
  { id: "fallback_life", category: "life", type: "safety", level: 1, scene: "crosswalk", imageKey: "leash", prompt: "횡단보도 앞에서 토리와 어떻게 해야 할까?", choices: ["멈추고 초록불을 기다려요", "바로 뛰어가요", "목줄을 놓아요", "차 사이로 지나가요"], answerIndex: 0, hint: "차가 멈추고 초록불일 때 건너야 안전해.", correctFeedback: "정답이야! 안전하게 기다리는 게 좋아.", wrongFeedback: "토리와 안전한 방법을 다시 생각해보자.", reward: { type: "heart", amount: 1 } }
];

let questions = [];
let save = loadSave();
let walk = null;

const app = document.querySelector("#app");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  questions = await loadQuestions();
  unlockAvailableItems();
  renderHome();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

async function loadQuestions() {
  try {
    const response = await fetch("./questions.json", { cache: "no-store" });
    if (!response.ok) throw new Error("questions load failed");
    const data = await response.json();
    return Array.isArray(data) && data.length ? data : fallbackQuestions;
  } catch {
    return fallbackQuestions;
  }
}

function loadSave() {
  const base = {
    snackCoins: 0, wordStickers: 0, alphabetPaws: 0, speechStickers: 0, starBadges: 0,
    hearts: 0, completedWalks: 0, englishCorrectCount: 0, unlockedItems: ["collar-blue"],
    equippedItems: ["collar-blue"]
  };
  try {
    return { ...base, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return base;
  }
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

function renderHome() {
  unlockAvailableItems();
  app.className = "app-shell";
  app.innerHTML = `
    <section class="screen">
      <button class="icon-btn settings-btn" data-action="settings" aria-label="설정">⚙</button>
      <div class="title-block">
        <h1>멍멍 산책</h1>
        <p class="subtitle">Puppy Walk</p>
      </div>
      <div class="card hero-card">
        ${dogMarkup("base")}
        <div class="speech">오늘도 같이 산책 갈까?</div>
      </div>
      <div class="button-stack home-actions">
        <button class="primary-btn" data-action="start">산책 시작</button>
        <button class="secondary-btn" data-action="decorate">꾸미기</button>
      </div>
      <section class="card reward-summary">
        <div class="reward-row">
          <strong>내 보상</strong>
          <span class="stat">산책 완료 ${save.completedWalks}회</span>
        </div>
        ${rewardGrid()}
      </section>
    </section>`;
  bindActions({
    start: startWalk,
    decorate: renderDecorate,
    settings: renderSettings
  });
}

function startWalk() {
  const selected = pickWalkQuestions();
  walk = { questions: selected, index: 0, correct: 0, wrongCount: 0, rewards: [], newItems: [], answered: false };
  renderQuestion();
}

function pickWalkQuestions() {
  const plan = ["math", "english", Math.random() > 0.5 ? "math" : "reasoning", "korean", "life"];
  const used = new Set();
  return plan.map(category => {
    const pool = shuffle(questions.filter(q => q.category === category && !used.has(q.id)));
    const picked = pool[0] || shuffle(questions.filter(q => !used.has(q.id)))[0] || fallbackQuestions[0];
    used.add(picked.id);
    return picked;
  });
}

function renderQuestion(feedback = "토리가 문제를 보고 있어. 천천히 골라보자!", dogState = "thinking") {
  const q = walk.questions[walk.index];
  const scene = scenes[q.scene] || scenes.park;
  app.className = `app-shell dog-${dogState === "happy" ? "happy" : dogState === "wrong" ? "wrong" : ""}`;
  app.innerHTML = `
    <section class="screen">
      <div class="top-row">
        <button class="soft-btn" data-action="home">홈으로</button>
        <strong>${walk.index + 1}/${WALK_LENGTH}</strong>
      </div>
      <div class="progress" aria-label="산책 진행도"><span style="width:${((walk.index + 1) / WALK_LENGTH) * 100}%"></span></div>
      <section class="card walk-stage">
        <div class="scene-name">${scene.icon} ${scene.name}</div>
        ${walkMapMarkup(q, scene)}
      </section>
      <section class="card question-card">
        <p class="mini-label">${categoryName(q.category)}</p>
        <h2>${escapeHtml(q.prompt)}</h2>
        <div class="feedback">${escapeHtml(feedback)}</div>
        <div class="hint ${walk.wrongCount >= 2 ? "show" : ""}">힌트: ${escapeHtml(q.hint)}</div>
      </section>
      <div class="choices">
        ${q.choices.map((choice, index) => `<button class="choice-btn" data-choice="${index}">${escapeHtml(choice)}</button>`).join("")}
      </div>
    </section>`;
  bindActions({ home: renderHome });
  document.querySelectorAll("[data-choice]").forEach(btn => {
    btn.addEventListener("click", () => chooseAnswer(Number(btn.dataset.choice)));
  });
}

function walkMapMarkup(question, scene) {
  const progressIndex = walk.index;
  const points = walk.questions.map((entry, index) => {
    const pointScene = scenes[entry.scene] || scenes.park;
    const state = index < progressIndex ? "done" : index === progressIndex ? "current" : "next";
    return `<div class="route-point ${state}" style="${routePointStyle(index)}" aria-label="${index + 1}번째 산책 장소">${pointScene.icon}<span>${index + 1}</span></div>`;
  }).join("");
  return `
    <div class="walk-map" aria-label="토리와 함께 걷는 산책 코스 지도">
      <svg class="map-path" viewBox="0 0 320 190" aria-hidden="true">
        <path d="M35 146 C76 88, 104 84, 137 126 S204 163, 220 102 S260 33, 291 58" />
      </svg>
      <div class="map-scenery sun"></div>
      <div class="map-scenery tree tree-one"></div>
      <div class="map-scenery tree tree-two"></div>
      <div class="map-scenery house"></div>
      ${points}
      <div class="walker-duo" style="${routePointStyle(progressIndex)}">
        <div class="girl-walker" aria-hidden="true">
          <span class="girl-hair"></span>
          <span class="girl-head"></span>
          <span class="girl-body"></span>
          <span class="girl-leg leg-left"></span>
          <span class="girl-leg leg-right"></span>
        </div>
        <span class="leash" aria-hidden="true"></span>
        <div class="map-dog ${questionStateClass(question)}" aria-hidden="true">
          <span class="map-dog-tail"></span>
          <span class="map-dog-body"></span>
          <span class="map-dog-head"></span>
          <span class="map-dog-ear"></span>
          <span class="map-dog-leg dog-leg-one"></span>
          <span class="map-dog-leg dog-leg-two"></span>
        </div>
      </div>
      <div class="map-mission-sign">
        <span>${imageFor(question.imageKey) || scene.icon}</span>
        <strong>${categoryName(question.category).replace(" 미션", "")}</strong>
      </div>
    </div>`;
}

function routePointStyle(index) {
  const positions = [
    [12, 76],
    [33, 47],
    [52, 68],
    [70, 38],
    [89, 28]
  ];
  const [left, top] = positions[index] || positions[0];
  return `left:${left}%; top:${top}%;`;
}

function questionStateClass(question) {
  return question.category === "life" ? "careful" : question.category === "english" ? "sniff" : "";
}

function chooseAnswer(choiceIndex) {
  if (walk.answered) return;
  const q = walk.questions[walk.index];
  const buttons = [...document.querySelectorAll("[data-choice]")];
  if (choiceIndex === q.answerIndex) {
    walk.answered = true;
    walk.correct += 1;
    if (q.category === "english") save.englishCorrectCount += 1;
    grantReward(q.reward);
    buttons[choiceIndex].classList.add("correct");
    buttons.forEach(button => button.disabled = true);
    document.querySelector(".feedback").textContent = q.correctFeedback;
    app.classList.add("dog-happy");
    animateToNextQuestion();
    return;
  }

  walk.wrongCount += 1;
  buttons[choiceIndex].classList.add("wrong");
  if (walk.wrongCount >= 2) document.querySelector(".hint").classList.add("show");
  app.classList.add("dog-wrong");

  if (walk.wrongCount >= 3) {
    walk.answered = true;
    buttons[q.answerIndex].classList.add("correct");
    buttons.forEach(button => button.disabled = true);
    document.querySelector(".feedback").textContent = `${q.wrongFeedback} 정답은 '${q.choices[q.answerIndex]}'이야.`;
    setTimeout(nextQuestion, 1400);
  } else {
    document.querySelector(".feedback").textContent = walk.wrongCount === 1 ? "괜찮아! 토리랑 다시 생각해보자." : q.wrongFeedback;
  }
}

function animateToNextQuestion() {
  const walker = document.querySelector(".walker-duo");
  if (!walker || walk.index >= WALK_LENGTH - 1) {
    setTimeout(nextQuestion, 900);
    return;
  }
  walker.classList.add("walking");
  requestAnimationFrame(() => {
    walker.setAttribute("style", routePointStyle(walk.index + 1));
  });
  setTimeout(nextQuestion, 1050);
}

function nextQuestion() {
  walk.index += 1;
  walk.wrongCount = 0;
  walk.answered = false;
  saveGame();
  if (walk.index >= WALK_LENGTH) finishWalk();
  else renderQuestion();
}

function grantReward(reward) {
  const meta = rewardLabels[reward.type];
  if (!meta) return;
  save[meta[2]] += reward.amount;
  walk.rewards.push(`${meta[1]} ${meta[0]} ${reward.amount}개`);
}

function finishWalk() {
  save.completedWalks += 1;
  const before = new Set(save.unlockedItems);
  const unlocked = unlockAvailableItems();
  walk.newItems = unlocked.filter(id => !before.has(id));
  saveGame();
  renderComplete();
}

function unlockAvailableItems() {
  const newly = [];
  itemCatalog.forEach(item => {
    if (item.check(save) && !save.unlockedItems.includes(item.id)) {
      save.unlockedItems.push(item.id);
      newly.push(item.id);
    }
  });
  if (newly.length) saveGame();
  return newly;
}

function renderComplete() {
  app.className = "app-shell dog-celebrate";
  const rewardItems = walk.rewards.length ? walk.rewards : ["토리와 끝까지 산책했어요"];
  const newNames = walk.newItems.map(id => itemCatalog.find(item => item.id === id)?.name).filter(Boolean);
  app.innerHTML = `
    <section class="screen">
      <section class="card complete-card">
        <h1>산책 완료!</h1>
        <p class="stat">${WALK_LENGTH}문제 중 ${walk.correct}문제를 맞혔어</p>
        ${dogMarkup("celebrate")}
        <div class="speech">오늘 산책도 정말 즐거웠어!</div>
        <div class="reward-list">${rewardItems.map(item => `<div class="reward-pop">${escapeHtml(item)}</div>`).join("")}</div>
        ${newNames.length ? `<div class="reward-pop">새 꾸미기: ${newNames.join(", ")}</div>` : ""}
      </section>
      <div class="button-stack">
        <button class="primary-btn" data-action="again">다시 산책하기</button>
        <button class="secondary-btn" data-action="decorate">꾸미기 하러 가기</button>
        <button class="soft-btn" data-action="home">홈으로</button>
      </div>
    </section>`;
  bindActions({ again: startWalk, decorate: renderDecorate, home: renderHome });
}

function renderDecorate() {
  unlockAvailableItems();
  app.className = "app-shell";
  app.innerHTML = `
    <section class="screen">
      <div class="top-row">
        <button class="soft-btn" data-action="home">홈으로</button>
        <strong>스티커북 꾸미기</strong>
      </div>
      <section class="card decorate-panel">
        ${dogMarkup("base")}
        <p class="small-note">장착 중: ${equippedNames() || "없음"}</p>
      </section>
      <section class="item-grid">
        ${itemCatalog.map(renderItemCard).join("")}
      </section>
    </section>`;
  bindActions({ home: renderHome });
  document.querySelectorAll("[data-item]").forEach(button => {
    button.addEventListener("click", () => toggleItem(button.dataset.item));
  });
}

function renderSettings() {
  app.className = "app-shell";
  app.innerHTML = `
    <section class="screen">
      <div class="top-row">
        <button class="soft-btn" data-action="home">홈으로</button>
        <strong>설정</strong>
      </div>
      <section class="card settings-panel">
        <h2>게임 설정</h2>
        <p class="small-note">처음부터 다시 시작하면 모은 보상, 산책 횟수, 장착한 꾸미기 아이템이 모두 초기화돼요.</p>
        <button class="danger-btn" data-action="reset">처음부터 다시 시작</button>
      </section>
    </section>`;
  bindActions({ home: renderHome, reset: resetProgress });
}

function renderItemCard(item) {
  const unlocked = save.unlockedItems.includes(item.id);
  const equipped = save.equippedItems.includes(item.id);
  return `
    <article class="sticker-item ${unlocked ? "" : "locked"}">
      <img src="${item.file}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${unlocked ? item.condition : `잠김: ${item.condition}`}</p>
      <button class="${equipped ? "secondary-btn" : "soft-btn"}" ${unlocked ? "" : "disabled"} data-item="${item.id}">
        ${equipped ? "해제하기" : "장착하기"}
      </button>
    </article>`;
}

function toggleItem(itemId) {
  const item = itemCatalog.find(entry => entry.id === itemId);
  if (!item || !save.unlockedItems.includes(itemId)) return;
  if (save.equippedItems.includes(itemId)) {
    save.equippedItems = save.equippedItems.filter(id => id !== itemId);
  } else {
    save.equippedItems = save.equippedItems.filter(id => itemCatalog.find(entry => entry.id === id)?.slot !== item.slot);
    save.equippedItems.push(itemId);
  }
  saveGame();
  renderDecorate();
}

function dogMarkup(state) {
  const file = `assets/dog/dog-${state === "thinking" ? "thinking" : state === "happy" ? "happy" : state === "celebrate" ? "celebrate" : "base"}.svg`;
  const items = save.equippedItems.map(id => itemCatalog.find(item => item.id === id)).filter(Boolean);
  return `
    <div class="dog-preview">
      <img src="${file}" class="dog-base" alt="강아지 토리">
      <div class="dog-items" aria-hidden="true">
        ${items.map(item => `<img src="${item.file}" class="dog-item ${item.className}" alt="">`).join("")}
      </div>
    </div>`;
}

function rewardGrid() {
  const rows = Object.values(rewardLabels).map(([label, icon, key]) => `<div class="reward-pill">${icon}<br>${label}<br>${save[key]}</div>`);
  return `<div class="reward-grid">${rows.join("")}</div>`;
}

function equippedNames() {
  return save.equippedItems.map(id => itemCatalog.find(item => item.id === id)?.name).filter(Boolean).join(", ");
}

function imageFor(key) {
  return key ? imageMap[key] || "" : "";
}

function categoryName(category) {
  return { math: "수학 미션", english: "영어 미션", korean: "국어 미션", reasoning: "추론 미션", life: "생활 미션" }[category] || "산책 미션";
}

function bindActions(map) {
  Object.entries(map).forEach(([name, handler]) => {
    document.querySelectorAll(`[data-action="${name}"]`).forEach(el => el.addEventListener("click", handler));
  });
}

function resetProgress() {
  if (!confirm("보상과 꾸미기를 처음부터 다시 시작할까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  save = loadSave();
  renderHome();
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
}
