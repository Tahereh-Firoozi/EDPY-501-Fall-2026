const issues = [
  {
    title: "The research problem may stereotype or stigmatize participants.",
    prompt: "Does the proposal frame international and Indigenous students in a way that assumes a deficit before the study begins?"
  },
  {
    title: "Participation may not be fully voluntary because of a power relationship.",
    prompt: "Consider the principal investigator's role as an instructor, the timing of recruitment, and the 2% course credit."
  },
  {
    title: "Gatekeeper permission is being treated as participant consent.",
    prompt: "Consider the department chair and instructors' approval in relation to observing and recording students."
  },
  {
    title: "Participants may not have adequate privacy during recruitment.",
    prompt: "Consider how international and Indigenous identity is disclosed during the sign-up process."
  },
  {
    title: "The researcher incorrectly describes the interviews as anonymous.",
    prompt: "Can interviews be anonymous if the researcher meets participants and knows their identities?"
  },
  {
    title: "Some students may be observed or recorded without their consent.",
    prompt: "Consider students who do not complete the questionnaire but may still appear in observation notes or recordings."
  },
  {
    title: "The data-storage and transfer procedures may not adequately protect confidentiality.",
    prompt: "Consider the personal laptop, email transfer, access, and the absence of a clear destruction date."
  },
  {
    title: "Interview questioning may go beyond what participants originally agreed to discuss.",
    prompt: "Consider follow-up questions about trauma, discrimination, mental health, finances, or family circumstances."
  },
  {
    title: "Participants may be identifiable when findings are reported.",
    prompt: "Consider the small Indigenous subgroup and the use of detailed descriptors with quotations."
  },
  {
    title: "Using mixed methods and comparing groups is itself an ethical violation.",
    prompt: "Decide whether the research approach itself is unethical, or whether the ethical concerns arise from how it is designed and implemented."
  }
];

const STORAGE_KEY = "edpy501_session4_ethics_review_v1";
const pages = [...document.querySelectorAll(".page")];
const steps = [...document.querySelectorAll(".step")];
const issueList = document.getElementById("issue-list");
const progress = document.getElementById("review-progress");
const count = document.getElementById("answered-count");
const reviewButton = document.getElementById("review-responses");
const summary = document.getElementById("response-summary");
const summaryContent = document.getElementById("summary-content");
const readConfirm = document.getElementById("read-confirm");
const toReview = document.getElementById("to-review");

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
let state = loadState();
if (!state.responses) state.responses = {};
if (state.readConfirmed) { readConfirm.checked = true; toReview.disabled = false; }

issues.forEach((issue, i) => {
  const n = i + 1;
  const saved = state.responses[n] || {};
  const card = document.createElement("article");
  card.className = "issue-card";
  card.dataset.issue = n;
  card.innerHTML = `
    <div class="issue-head">
      <div class="issue-number">${String(n).padStart(2,"0")}</div>
      <div>
        <h3>${issue.title}</h3>
        <p class="muted">${issue.prompt}</p>
      </div>
    </div>
    <div class="choices" role="radiogroup" aria-label="Issue ${n}">
      <div class="choice">
        <input id="issue-${n}-yes" type="radio" name="issue-${n}" value="yes" ${saved.choice==="yes"?"checked":""}>
        <label for="issue-${n}-yes">Yes, this problem is present</label>
      </div>
      <div class="choice">
        <input id="issue-${n}-no" type="radio" name="issue-${n}" value="no" ${saved.choice==="no"?"checked":""}>
        <label for="issue-${n}-no">No, not in this proposal</label>
      </div>
    </div>
    <div class="fix-wrap" ${saved.choice==="yes"?"":"hidden"}>
      <label for="fix-${n}">How could the researcher fix this ethical problem?</label>
      <textarea id="fix-${n}" placeholder="Explain a practical correction that preserves the study purpose.">${saved.fix || ""}</textarea>
    </div>`;
  issueList.appendChild(card);
});

function updateCard(card){
  const n = card.dataset.issue;
  const choice = card.querySelector('input[type="radio"]:checked')?.value || "";
  const fixWrap = card.querySelector(".fix-wrap");
  const fix = card.querySelector("textarea").value.trim();
  fixWrap.hidden = choice !== "yes";
  state.responses[n] = {choice, fix};
  if (choice === "no" || (choice === "yes" && fix.length > 0)) card.classList.add("complete");
  else card.classList.remove("complete");
  saveState(state);
  updateProgress();
}
function updateProgress(){
  let answered = 0;
  issues.forEach((_, i) => {
    const r = state.responses[i+1] || {};
    if (r.choice === "no" || (r.choice === "yes" && (r.fix || "").trim())) answered++;
  });
  progress.value = answered;
  count.textContent = `${answered} / ${issues.length}`;
  reviewButton.disabled = answered !== issues.length;
}
issueList.addEventListener("change", e => {
  const card = e.target.closest(".issue-card");
  if (card) updateCard(card);
});
issueList.addEventListener("input", e => {
  const card = e.target.closest(".issue-card");
  if (card) updateCard(card);
});
[...document.querySelectorAll(".issue-card")].forEach(updateCard);

function showPage(id){
  pages.forEach(p => p.classList.toggle("active", p.id === id));
  steps.forEach(s => s.classList.toggle("active", s.dataset.page === id));
  window.scrollTo({top:0,behavior:"smooth"});
  history.replaceState(null,"",`#${id}`);
}
document.addEventListener("click", e => {
  const next = e.target.closest("[data-next]");
  const prev = e.target.closest("[data-prev]");
  const step = e.target.closest(".step");
  if (next) showPage(next.dataset.next);
  if (prev) showPage(prev.dataset.prev);
  if (step) showPage(step.dataset.page);
});
readConfirm.addEventListener("change", () => {
  state.readConfirmed = readConfirm.checked;
  saveState(state);
  toReview.disabled = !readConfirm.checked;
});

reviewButton.addEventListener("click", () => {
  summaryContent.innerHTML = "";
  issues.forEach((issue, i) => {
    const r = state.responses[i+1];
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `<strong>${i+1}. ${issue.title}</strong><span><b>Your decision:</b> ${r.choice==="yes"?"Yes — problem present":"No — not a problem in this proposal"}</span>${r.choice==="yes"?`<p><b>Your proposed fix:</b> ${escapeHtml(r.fix)}</p>`:""}`;
    summaryContent.appendChild(div);
  });
  summary.hidden = false;
  summary.scrollIntoView({behavior:"smooth",block:"start"});
});
document.getElementById("edit-responses").addEventListener("click", () => {
  summary.hidden = true;
  document.querySelector(".issue-card").scrollIntoView({behavior:"smooth"});
});
document.getElementById("print-responses").addEventListener("click", () => window.print());
document.getElementById("reset-activity").addEventListener("click", () => {
  if (!confirm("Clear all Session 4 responses saved in this browser?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});
function escapeHtml(str){
  const d=document.createElement("div"); d.textContent=str; return d.innerHTML;
}
const requested = location.hash.replace("#","");
if (["instructions","proposal","review"].includes(requested)) showPage(requested);
else showPage("instructions");
updateProgress();