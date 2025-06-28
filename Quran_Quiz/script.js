let quranData = [];
let currentAyat = null;
let selectedAyats = [];
let fromPara = 1, toPara = 30;

// Show/Hide sections
function showSection(id) {
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('paraSelectScreen').classList.add('hidden');
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}

// Load Quran data from JSON
async function loadQuranData() {
  try {
    const resp = await fetch('quran_full.json');
    if (!resp.ok) throw new Error('Could not load Quran data.');
    quranData = await resp.json();
  } catch (e) {
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
  // Filter ayats
  selectedAyats = quranData.filter(
    a => fromPara <= (((a.page - 1) / 20 | 0) + 1) && (((a.page - 1) / 20 | 0) + 1) <= toPara
  );
  if (!selectedAyats.length) {
    errDiv.textContent = "❌ Is range ke andar ayat nahi mile.";
    errDiv.classList.remove('hidden');
    return;
  }
  nextQuestion();
  showSection('quizScreen');
}

// Next random ayat/question
function nextQuestion() {
  document.getElementById('quizError').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('answerForm').reset();
  document.querySelector('.next-button').classList.add('hidden');
  const i = Math.floor(Math.random() * selectedAyats.length);
  currentAyat = selectedAyats[i];
  document.getElementById('ayatText').textContent = currentAyat.text;
}

// Check user's answer
function checkAnswer() {
  const user_page = document.getElementById('user_page').value.trim();
  const user_para = document.getElementById('user_para').value.trim();
  const user_page_in_para = document.getElementById('user_page_in_para').value.trim();
  const user_surah = document.getElementById('user_surah').value.trim().toLowerCase();

  const errorDiv = document.getElementById('quizError');
  const resultDiv = document.getElementById('quizResult');
  errorDiv.classList.add('hidden');
  resultDiv.classList.add('hidden');
  document.querySelector('.next-button').classList.add('hidden');
  let resultParts = [];
  let page_check = false, para_check = false, page_in_para_check = false, surah_check = true;

  if (!user_page && (!user_para || !user_page_in_para)) {
    errorDiv.textContent = "❌ Kam az kam Page Number ya Para Number + Page In Para likhiye.";
    errorDiv.classList.remove('hidden');
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
    // Custom logic: user input + 1 must match actual, result shows actual - 1
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
  if ((!user_page || page_check) && para_check && page_in_para_check && surah_check) {
    resultDiv.textContent = "✅ CORRECT ANSWER ✅";
    resultDiv.classList.remove('hidden', 'error');
    resultDiv.classList.add('result');
    document.querySelector('.next-button').classList.remove('hidden');
  } else {
    resultDiv.innerHTML = resultParts.join('<br>') || "❌ Kuch Galat Hai ❌";
    resultDiv.classList.remove('hidden', 'result');
    resultDiv.classList.add('error');
    document.querySelector('.next-button').classList.remove('hidden');
  }
  return false; // Prevent form submit
}

// SEARCH FEATURE
function searchAyats() {
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsDiv = document.getElementById('searchResults');
  if (!input) {
    resultsDiv.innerHTML = "<em>Kuch likhiye search ke liye.</em>";
    return;
  }
  // Search in: ayat text, surah name, page number, para number
  const results = quranData.filter(a =>
    a.text.toLowerCase().includes(input) ||
    a.surah_name.toLowerCase().includes(input) ||
    String(a.page) === input ||
    String(((a.page-1)/20|0)+1) === input // para calculation
  );
  if (results.length === 0) {
    resultsDiv.innerHTML = "<b>Koi result nahi mila.</b>";
    return;
  }
  resultsDiv.innerHTML = results.map(r =>
    `<div class="search-result">
      <b>Ayat:</b> ${r.text} <br>
      <b>Surah:</b> ${r.surah_name} | <b>Page:</b> ${r.page} | <b>Para:</b> ${((r.page-1)/20|0)+1}
    </div>`
  ).join("");
}

// Load data on page load
window.addEventListener('DOMContentLoaded', async () => {
  await loadQuranData();
});
