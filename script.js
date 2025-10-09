// Menu Navigation
const menuBtns = document.querySelectorAll(".menu-btn");
const sections = document.querySelectorAll("section");

menuBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-section");
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
    menuBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Timer
function startTimer(statusEl) {
  let time = 0;
  statusEl.textContent = "Processing...";
  const interval = setInterval(() => {
    time++;
    statusEl.textContent = `Processing... ${time}s`;
  }, 1000);
  return interval;
}

// API Calls
async function querySearch(data) {
  const response = await fetch(
    "https://cloud.flowiseai.com/api/v1/prediction/f495e9f3-cd33-428d-93ac-9c7914b5c052",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );
  return response.json();
}

async function queryDeep(data) {
  const response = await fetch(
    "https://cloud.flowiseai.com/api/v1/prediction/2fd060a7-3ea7-482c-8eea-4f1a1168cef1",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );
  return response.json();
}

async function queryChat(data) {
  const response = await fetch(
    "https://cloud.flowiseai.com/api/v1/prediction/ef218325-4fa0-4bef-9f1d-11f7278341f3",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
  );
  return response.json();
}

// Research Run
document.getElementById("researchBtn").addEventListener("click", async () => {
  const query = document.getElementById("researchInput").value;
  const status = document.getElementById("researchStatus");
  const resultBox = document.getElementById("researchResult");
  const isDeep = document.getElementById("modeToggle").checked;

  const interval = startTimer(status);
  const res = isDeep ? await queryDeep({ question: query }) : await querySearch({ question: query });
  clearInterval(interval);

  status.textContent = "Done ✅";
  resultBox.textContent = res.text || JSON.stringify(res);
});

// Chat
const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const chatBtn = document.getElementById("chatBtn");

function addMessage(message, sender) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = message;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatBtn.addEventListener("click", async () => {
  const msg = chatInput.value;
  if (!msg) return;
  addMessage(msg, "user");
  chatInput.value = "";

  const res = await queryChat({ question: msg });
  addMessage(res.text || JSON.stringify(res), "ai");
});
