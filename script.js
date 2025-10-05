const questionInput = document.getElementById("question");
const searchBtn = document.getElementById("searchBtn");
const modeToggle = document.getElementById("modeToggle");
const modeLabel = document.getElementById("modeLabel");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");

let timerInterval;

const API_DEEP = "https://cloud.flowiseai.com/api/v1/prediction/2fd060a7-3ea7-482c-8eea-4f1a1168cef1";
const API_SEARCH = "https://cloud.flowiseai.com/api/v1/prediction/f495e9f3-cd33-428d-93ac-9c7914b5c052";

async function queryAPI(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

function startTimer() {
  let seconds = 0;
  timerEl.textContent = `⏱️ 0s`;
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = `⏱️ ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

searchBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) return alert("Enter a query!");

  resultEl.textContent = "";
  statusEl.textContent = "🔎 Searching...";
  startTimer();

  const mode = modeToggle.checked ? "deep" : "search";
  const url = mode === "search" ? API_SEARCH : API_DEEP;
  const payload = mode === "search" ? { question } : { question };

  try {
    const res = await queryAPI(url, payload);
    stopTimer();
    statusEl.textContent = "✅ Completed";
    resultEl.textContent = res.text || JSON.stringify(res, null, 2);
  } catch (err) {
    stopTimer();
    statusEl.textContent = "❌ Error";
    resultEl.textContent = err.message;
  }
});

modeToggle.addEventListener("change", () => {
  modeLabel.textContent = modeToggle.checked ? "Deep Search" : "Search";
});
