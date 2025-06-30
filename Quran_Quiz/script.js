// Najiful85 Quran Game – Fixed Version

let quranData = [];
let currentAyat = null;
let selectedAyats = [];
let fromPara = 1, toPara = 30;
let quizIndex = 0;
let score = 0;
let totalQuestions = 10;
let mode = 'practice';
let usedIndexes = [];
let bestSurah = '';
let surahCorrectCount = {};
let startTime = 0, totalTime = 0, timer = null, timePerQ = [];
let survivalActive = true;
let hintCount = 0;
const maxHints = 2;

// Show/Hide sections and search only on welcome
function showSection(id) {
  document.querySelectorAll('.screen').forEach(sec =>
    sec.classList.remove('active')
  );
  document.getElementById(id).classList.add('active');
  // SEARCH SIRF WELCOME SCREEN PAR
  let searchSection = document.getElementById('searchContainer');
  if (searchSection) searchSection.style.display = (id === 'welcomeScreen') ? 'block' : 'none';
  let toggleBtn = document.getElementById('toggleSearchBtn');
  if (toggleBtn && id !== 'welcomeScreen') toggleBtn.innerText = '🔎 Search';
  if (id === 'welcomeScreen') resetAll();
}

// Loader (optional, not implemented in this UI)
function loader(show = true) {
  // If you want to show a loader, implement here
}

// Load Quran data from JSON (uses local file, works on GitHub Pages)
async function loadQuranData() {
  try {
    loader(true);
    const resp = await fetch('quran_full.json');
    if (!resp.ok) throw new Error('Could not load Quran data.');
    quranData = await resp.json();
    loader(false);
  } catch (e) {
    loader(false);
    alert('❌ Quran data load error: ' + e.message);
  }
}

// Start Game: Para range selection
function startGame() {
  fromPara = parseInt(document.getElementById('fromPara').value);
  toPara = parseInt(document.getElementById('toPara').value);
  const errDiv = document.getElementById('selectError');
  errDiv.classList.add('hidden');
  if (isNaN(fromPara) || isNaN(toPara) || fromPara < 1 || toPara > 30 || fromPara > toPara) {
    errDiv.textContent = "❌ Galat range! Para range 1–30 ke andar aur From <= To hona zaruri hai.";
    errDiv.classList.remove('hidden');
    return;
  }
  if (!quranData || quranData.length === 0) {
    errDiv.textContent = "❌ Quran data abhi load nahi hui. Internet ya file check karein!";
    errDiv.classList.remove('hidden');
    return;
  }
  selectedAyats = quranData.filter(
    a => fromPara <= (((a.page - 1) / 20 | 0) + 1) && (((a.page - 1) / 20 | 0) + 1) <= toPara
  );
  if (!selectedAyats.length) {
    errDiv.textContent = "❌ Is range ke andar ayat nahi mile.";
    errDiv.classList.remove('hidden');
    return;
  }
  quizIndex = 0;
  score = 0;
  usedIndexes = [];
  bestSurah = '';
  surahCorrectCount = {};
  timePerQ = [];
  totalTime = 0;
  hintCount = 0;
  // Hint button and info (optional, hide if not present)
  let hintBtn = document.getElementById('hintBtn');
  let hintInfo = document.getElementById('hintInfo');
  if (hintBtn) hintBtn.disabled = false;
  if (hintInfo) hintInfo.textContent = `Hint: ${hintCount}/${maxHints}`;
  let survivalAnswer = document.getElementById('survivalAnswer');
  if (survivalAnswer) survivalAnswer.classList.add('hidden');
  if (mode === 'timed') totalQuestions = 10;
  else if (mode === 'practice') totalQuestions = 9999;
  else if (mode === 'survival') totalQuestions = 9999, survivalActive = true;
  nextQuestion();
  showSection('quizScreen');
  updateScore();
}

// Prevent repeat questions
function randomAyatIndex() {
  if (usedIndexes.length >= Math.min(totalQuestions, selectedAyats.length)) return -1;
  let i;
  do {
    i = Math.floor(Math.random() * selectedAyats.length);
  } while (usedIndexes.includes(i));
  usedIndexes.push(i);
  return i;
}

// Next random ayat/question
function nextQuestion() {
  let quizError = document.getElementById('quizError');
  let quizResult = document.getElementById('quizResult');
  let survivalAnswer = document.getElementById('survivalAnswer');
  let answerForm = document.getElementById('answerForm');
  let nextBtn = document.querySelector('.next-button');
  let tryAgainBtn = document.getElementById('tryAgainBtn');
  let hintBtn = document.getElementById('hintBtn');
  let hintInfo = document.getElementById('hintInfo');
  if (quizError) quizError.classList.add('hidden');
  if (quizResult) quizResult.classList.add('hidden');
  if (survivalAnswer) survivalAnswer.classList.add('hidden');
  if (answerForm) answerForm.reset();
  if (nextBtn) nextBtn.classList.add('hidden');
  if (tryAgainBtn) tryAgainBtn.classList.add('hidden');
  if (hintBtn) hintBtn.disabled = hintCount >= maxHints;
  if (hintInfo) hintInfo.textContent = `Hint: ${hintCount}/${maxHints}`;
  if (quizIndex >= totalQuestions || usedIndexes.length >= selectedAyats.length) {
    endQuiz();
    return;
  }
  const i = randomAyatIndex();
  if (i === -1) {
    endQuiz();
    return;
  }
  currentAyat = selectedAyats[i];
  // Typing effect if available, else fallback
  if (window.ayatTypingEffect) window.ayatTypingEffect(currentAyat.text);
  else document.getElementById('ayatText').textContent = currentAyat.text;
  quizIndex++;
  updateScore();
  let quizProgress = document.getElementById('quizProgress');
  if (quizProgress)
    quizProgress.textContent = mode === 'practice'
      ? `Practice Mode`
      : `Sawalat: ${quizIndex} / ${mode === 'timed' ? totalQuestions : '∞'}`;
  let timerDiv = document.getElementById('timer');
  if (mode === 'timed') {
    startTimer(30);
  } else if (timerDiv) {
    timerDiv.textContent = '';
    startTime = Date.now();
  }
}

// Timer for Timed mode
function startTimer(seconds) {
  let time = seconds;
  let timerDiv = document.getElementById('timer');
  timerDiv.textContent = `⏱️ ${time}s`;
  startTime = Date.now();
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timerDiv.textContent = `⏱️ ${time}s`;
    if (time <= 0) {
      clearInterval(timer);
      timerDiv.textContent = "⏱️ Time's up!";
      timePerQ.push(seconds);
      showWrong("⏱️ Time's up!");
      if (mode === 'survival') {
        showSurvivalAnswer();
        setTimeout(() => endQuiz(), 1900);
      }
      else document.querySelector('.next-button').classList.remove('hidden');
    }
  }, 1000);
}

// Show wrong answer (timed mode)
function showWrong(msg) {
  let quizResult = document.getElementById('quizResult');
  quizResult.innerHTML = msg;
  quizResult.classList.remove('hidden', 'result');
  quizResult.classList.add('error');
  document.querySelector('.next-button').classList.remove('hidden');
  setTimeout(() => quizResult.classList.add('hidden'), 5000);
}

// Check user's answer
function checkAnswer() {
  let timeSpent = Math.round((Date.now() - startTime) / 1000);
  if (mode === 'timed') {
    if (timer) clearInterval(timer);
  }
  const user_page = document.getElementById('user_page').value.trim();
  const user_para = document.getElementById('user_para').value.trim();
  const user_page_in_para = document.getElementById('user_page_in_para').value.trim();
  const user_surah = document.getElementById('user_surah').value.trim().toLowerCase();

  const errorDiv = document.getElementById('quizError');
  const resultDiv = document.getElementById('quizResult');
  errorDiv.classList.add('hidden');
  resultDiv.classList.add('hidden');
  document.querySelector('.next-button').classList.add('hidden');
  let survivalAnswer = document.getElementById('survivalAnswer');
  if (survivalAnswer) survivalAnswer.classList.add('hidden');
  let resultParts = [];
  let page_check = false, para_check = false, page_in_para_check = false, surah_check = true;

  if (!user_page && (!user_para || !user_page_in_para)) {
    errorDiv.textContent = "❌ Kam az kam Page Number ya Para Number + Page In Para likhiye.";
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 2300);
    return false;
  }

  const page_num_in_data = parseInt(currentAyat.page);
  const actual_para_num = ((page_num_in_data - 1) / 20 | 0) + 1;
  const actual_page_in_para = ((page_num_in_data - 1) % 20) + 1;

  // Page Number Check
  if (user_page) {
    const user_page_num = parseInt(user_page);
    if (user_page_num === page_num_in_data) {
      page_check = true;
    } else {
      resultParts.push(`❌ Page Number Galat! Sahi: ${page_num_in_data}`);
    }
  }

  // Para + Page in Para Check
  if (user_para && user_page_in_para) {
    const user_para_num = parseInt(user_para);
    const user_page_in_para_num = parseInt(user_page_in_para);
    if (user_para_num === actual_para_num) {
      para_check = true;
    } else {
      resultParts.push(`❌ Para Galat! Sahi: ${actual_para_num}`);
    }
    if (user_page_in_para_num + 1 === actual_page_in_para) {
      page_in_para_check = true;
    } else {
      resultParts.push(`❌ Page In Para Galat! Sahi: ${actual_page_in_para - 1}`);
    }
  }

  // Surah Name Check
  if (user_surah) {
    if (!currentAyat.surah_name.toLowerCase().includes(user_surah)) {
      resultParts.push(`❌ Surah Name Galat! Sahi: ${currentAyat.surah_name}`);
      surah_check = false;
    }
  }

  // Final Result
  let isCorrect = ((!user_page || page_check) && para_check && page_in_para_check && surah_check);
  if (isCorrect) {
    score++;
    // Surah correct count
    let sname = currentAyat.surah_name;
    surahCorrectCount[sname] = (surahCorrectCount[sname] || 0) + 1;
    resultDiv.textContent = "✅ Sahi! +1 Point";
    resultDiv.classList.remove('hidden', 'error');
    resultDiv.classList.add('result');
  } else {
    resultDiv.innerHTML = resultParts.join('<br>') || "❌ Kuch Galat Hai ❌<br> 0 Point";
    resultDiv.classList.remove('hidden', 'result');
    resultDiv.classList.add('error');
    if (mode === 'survival') {
      survivalActive = false;
      showSurvivalAnswer();
      setTimeout(() => endQuiz(), 1900);
      return false;
    }
  }
  document.querySelector('.next-button').classList.remove('hidden');
  timePerQ.push(timeSpent);
  updateScore();
  setTimeout(() => resultDiv.classList.add('hidden'), 5000);
  return false; // Prevent form submit
}

// Survival mode wrong answer show
function showSurvivalAnswer() {
  let div = document.getElementById('survivalAnswer');
  let page_num_in_data = parseInt(currentAyat.page);
  let actual_para_num = ((page_num_in_data - 1) / 20 | 0) + 1;
  let actual_page_in_para = ((page_num_in_data - 1) % 20) + 1;
  div.innerHTML = `<b>Sahi Jawab:</b><br>
  Surah: <b>${currentAyat.surah_name}</b><br>
  Para: <b>${actual_para_num}</b><br>
  Page: <b>${page_num_in_data}</b><br>
  Page in Para: <b>${actual_page_in_para - 1}</b>`;
  div.classList.remove('hidden');
}

// Show Score/Result at end
function endQuiz() {
  if (timer) clearInterval(timer);
  showSection('resultScreen');
  let bestSurahName = '';
  let maxCorrect = 0;
  Object.entries(surahCorrectCount).forEach(([s, c]) => {
    if (c > maxCorrect) { maxCorrect = c; bestSurahName = s; }
  });
  let avgTime = timePerQ.length ? Math.round(timePerQ.reduce((a, b) => a + b, 0) / timePerQ.length) : 0;
  let finalResult = document.getElementById('finalResult');
  if (finalResult)
    finalResult.innerHTML = `
    🧠 Your Score: <b>${score}/${quizIndex}</b><br>
    📖 Best Surah: <b>${bestSurahName || '-'}</b><br>
    ⏱️ Average Time: <b>${avgTime} sec</b><br>
    <br>${mode === 'survival' && !survivalActive ? '💥 Survival Ended!' : '🎉 Mubarak!'}
  `;
}

// Restart Game
function restartGame(home = false) {
  quizIndex = 0;
  score = 0;
  usedIndexes = [];
  bestSurah = '';
  surahCorrectCount = {};
  timePerQ = [];
  totalTime = 0;
  hintCount = 0;
  let hintBtn = document.getElementById('hintBtn');
  let hintInfo = document.getElementById('hintInfo');
  if (hintBtn) hintBtn.disabled = false;
  if (hintInfo) hintInfo.textContent = `Hint: ${hintCount}/${maxHints}`;
  if (home) showSection('welcomeScreen');
  else showSection('paraSelectScreen');
}

// Copy Ayat to Clipboard
function copyAyat() {
  if (!currentAyat) return;
  navigator.clipboard.writeText(currentAyat.text)
    .then(() => {
      let btn = document.getElementById('copyAyatBtn');
      if (btn) {
        btn.textContent = "✅";
        setTimeout(() => { btn.textContent = "📋"; }, 1200);
      }
    });
}

// SEARCH FEATURE (only on welcome)
function searchAyats() {
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('searchResults');
  if (!input) {
    resultsDiv.innerHTML = "<em>Kuch likhiye search ke liye.</em>";
    return;
  }
  const results = quranData.filter(a =>
    a.text.toLowerCase().includes(input) ||
    a.surah_name.toLowerCase().includes(input) ||
    String(a.page) === input ||
    String(((a.page - 1) / 20 | 0) + 1) === input
  );
  if (results.length === 0) {
    resultsDiv.innerHTML = "<b>Koi result nahi mila.</b>";
    return;
  }
  resultsDiv.innerHTML = results.map((r, idx) =>
    `<div class="search-result" onclick="highlightAyat(${r.page})">
      <b>Ayat:</b> ${r.text} <br>
      <b>Surah:</b> ${r.surah_name} | <b>Page:</b> ${r.page} | <b>Para:</b> ${((r.page - 1) / 20 | 0) + 1}
    </div>`
  ).join("");
}

// Highlight ayat (optional: show detail popup etc.)
function highlightAyat(page) {
  alert("Page: " + page + " pe ye ayat hai. (Aap is feature ko customize kar sakte hain)");
}

// Enter par bhi search ho (only on welcome)
let searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchAyats();
    }
  });
}

// Score board update
function updateScore() {
  let scoreBoard = document.getElementById('scoreBoard');
  if (scoreBoard)
    scoreBoard.innerHTML = `Score: ${score} / ${quizIndex}`;
}

// Reset all for home
function resetAll() {
  quizIndex = 0;
  score = 0;
  usedIndexes = [];
  bestSurah = '';
  surahCorrectCount = {};
  timePerQ = [];
  totalTime = 0;
  hintCount = 0;
  let radios = document.querySelectorAll('input[name="quizMode"]');
  if (radios.length) {
    let checked = Array.from(radios).find(r => r.checked);
    mode = checked ? checked.value : 'practice';
  }
}

// On DOM ready, load Quran data
window.addEventListener('DOMContentLoaded', async () => {
  await loadQuranData();
});
