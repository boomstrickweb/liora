// MODE + ENDPOINTS
const modes = [
  { id: 'search', label: 'Search', url: 'https://cloud.flowiseai.com/api/v1/prediction/f495e9f3-cd33-428d-93ac-9c7914b5c052' },
  { id: 'deep',   label: 'Deep Search', url: 'https://cloud.flowiseai.com/api/v1/prediction/2fd060a7-3ea7-482c-8eea-4f1a1168cef1' },
  { id: 'chat',   label: 'AI Chat', url: 'https://cloud.flowiseai.com/api/v1/prediction/ef218325-4fa0-4bef-9f1d-11f7278341f3' }
];

let activeIndex = 0; // default Search
const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
const queryInput = document.getElementById('query');
const sendBtn = document.getElementById('send');
const statusEl = document.getElementById('status');
const timerEl = document.getElementById('timer');
const responseEl = document.getElementById('response');

function setActive(index){
  activeIndex = index;
  modeButtons.forEach((b,i)=>{
    b.classList.toggle('active', i === index);
    b.setAttribute('aria-pressed', i === index ? 'true' : 'false');
  });
  // update status / visuals
  statusEl.textContent = 'Idle';
  timerEl.textContent = '';
  responseEl.textContent = '';
  // focus input
  queryInput.focus();
}

// attach click handlers to segmented buttons
modeButtons.forEach((btn, i)=>{
  btn.addEventListener('click', ()=> setActive(i));
});

// timer utilities
let timerInterval = null;
function startTimer(){
  let s = 0;
  timerEl.textContent = `0s`;
  timerInterval = setInterval(()=>{
    s++; timerEl.textContent = `${s}s`;
  },1000);
  return ()=>{
    clearInterval(timerInterval);
  };
}

// typewriter effect
async function typewriterWrite(targetEl, text, msPerChar = 18){
  targetEl.textContent = '';
  for(let i=0;i<text.length;i++){
    targetEl.textContent += text[i];
    await new Promise(r => setTimeout(r, msPerChar));
  }
}

// fetch helper
async function callAPI(url, payload){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if(!res.ok){
    const t = await res.text();
    throw new Error(`HTTP ${res.status} - ${t}`);
  }
  return res.json();
}

// send action
sendBtn.addEventListener('click', async ()=>{
  const q = queryInput.value.trim();
  if(!q) { queryInput.focus(); return; }

  // UI prepare
  responseEl.textContent = '';
  statusEl.textContent = 'Searching...';
  const stopTimer = startTimer();
  sendBtn.disabled = true;
  queryInput.disabled = true;

  try{
    const mode = modes[activeIndex];
    // payload uses "question" key (consistent with earlier examples)
    const start = performance.now();
    const result = await callAPI(mode.url, { question: q });
    const duration = ((performance.now() - start)/1000).toFixed(2);

    // display with typewriter effect (if text exists)
    const text = result && result.text ? result.text : JSON.stringify(result, null, 2);
    await typewriterWrite(responseEl, text, 14); // slightly fast, readable

    statusEl.textContent = `✅ Responded in ${duration}s`;
  }catch(err){
    responseEl.textContent = `Error: ${err.message}`;
    statusEl.textContent = '❌ Error';
  }finally{
    stopTimer();
    sendBtn.disabled = false;
    queryInput.disabled = false;
  }
});

// keyboard: enter to send
queryInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){ sendBtn.click(); }
});

// initialize
setActive(activeIndex);
