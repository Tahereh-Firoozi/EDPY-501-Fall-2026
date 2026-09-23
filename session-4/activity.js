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
const summary = document.getElementById("response-summary");
const summaryContent = document.getElementById("summary-content");
const readConfirm = document.getElementById("read-confirm");
const toReview = document.getElementById("to-review");
const ccidInput = document.getElementById("student-ccid");
const submitButtons = [...document.querySelectorAll(".submit-global")];
const submissionTarget = document.getElementById("submission-target");
const JOTFORM_ACTION = "https://submit.jotform.com/submit/262647079374064";

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
let state = loadState();
if (!state.responses) state.responses = {};
if (!state.ccid) state.ccid = "";
ccidInput.value = state.ccid;
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
  document.querySelectorAll(".review-global").forEach(btn => btn.disabled = answered === 0);
  const readyToSubmit = answered === issues.length && Boolean((state.ccid || "").trim());
  submitButtons.forEach(btn => {
    btn.disabled = !readyToSubmit;
    btn.title = readyToSubmit ? "Submit your completed activity" : "Complete all 10 items and enter your CCID first.";
  });
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

ccidInput.addEventListener("input", () => {
  state.ccid = ccidInput.value.trim();
  saveState(state);
  updateProgress();
});

function renderReviewSummary(){
  const hasAny = Object.values(state.responses).some(r => r && (r.choice || (r.fix || "").trim()));
  if (!hasAny){
    announce("You have not entered any ethics-review responses yet.");
    showPage("review");
    return;
  }
  summaryContent.innerHTML = "";
  issues.forEach((issue, i) => {
    const r = state.responses[i+1] || {};
    const div = document.createElement("div");
    div.className = "summary-item";
    const decision = r.choice === "yes" ? "Yes — problem present" : r.choice === "no" ? "No — not a problem in this proposal" : "Not answered";
    div.innerHTML = `<strong>${i+1}. ${issue.title}</strong><span><b>Your decision:</b> ${decision}</span>${r.choice==="yes"?`<p><b>Your proposed fix:</b> ${escapeHtml(r.fix || "")}</p>`:""}`;
    summaryContent.appendChild(div);
  });
  showPage("review");
  summary.hidden = false;
  setTimeout(() => summary.scrollIntoView({behavior:"smooth",block:"start"}), 50);
}
document.querySelectorAll(".review-global").forEach(btn => btn.addEventListener("click", renderReviewSummary));
document.getElementById("edit-responses").addEventListener("click", () => {
  summary.hidden = true;
  document.querySelector(".issue-card").scrollIntoView({behavior:"smooth"});
});
document.getElementById("print-responses").addEventListener("click", () => window.print());

function announce(message){
  document.querySelectorAll(".action-status").forEach(el => {
    el.textContent = message;
    el.classList.add("show");
  });
}
document.querySelectorAll(".save-global").forEach(btn => btn.addEventListener("click", () => {
  saveState(state);
  announce("Saved on this browser, including your CCID and current responses. You can continue later on this same browser/device.");
}));
function buildSubmissionForm(){
  const form = document.createElement("form");
  form.method = "post";
  form.action = JOTFORM_ACTION;
  form.target = "submission-target";
  form.hidden = true;

  const fields = {
    "formID": "262647079374064",
    "simple_spc": "262647079374064-262647079374064",
    "website": "",
    "q2_textbox0": state.ccid || "",
    "q23_textbox21": window.location.href,
    "q24_textbox22": "session4-github-v2"
  };

  issues.forEach((_, i) => {
    const n = i + 1;
    const r = state.responses[n] || {};
    const decisionNames = {
      1:"q3_textbox1",2:"q5_textbox3",3:"q7_textbox5",4:"q9_textbox7",5:"q11_textbox9",
      6:"q13_textbox11",7:"q15_textbox13",8:"q17_textbox15",9:"q19_textbox17",10:"q21_textbox19"
    };
    const fixNames = {
      1:"q4_textarea2",2:"q6_textarea4",3:"q8_textarea6",4:"q10_textarea8",5:"q12_textarea10",
      6:"q14_textarea12",7:"q16_textarea14",8:"q18_textarea16",9:"q20_textarea18",10:"q22_textarea20"
    };
    fields[decisionNames[n]] = r.choice || "";
    fields[fixNames[n]] = r.fix || "";
  });

  Object.entries(fields).forEach(([name,value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  return form;
}

let submissionPending = false;
submissionTarget.addEventListener("load", () => {
  if (!submissionPending) return;
  submissionPending = false;
  state.submitted = true;
  state.submittedAt = new Date().toISOString();
  saveState(state);
  announce("Submitted successfully. Your responses and CCID were sent to the private course submission record.");
  submitButtons.forEach(btn => {
    btn.textContent = "Submitted ✓";
    btn.disabled = true;
  });
});

submitButtons.forEach(btn => btn.addEventListener("click", () => {
  const answered = issues.filter((_, i) => {
    const r = state.responses[i+1] || {};
    return r.choice === "no" || (r.choice === "yes" && (r.fix || "").trim());
  }).length;
  if (!(state.ccid || "").trim()){
    announce("Enter your CCID at the top of the page before submitting.");
    ccidInput.focus();
    return;
  }
  if (answered !== issues.length){
    announce("Complete all 10 ethics-review items before submitting.");
    showPage("review");
    return;
  }
  if (!confirm("Submit your completed responses under CCID " + state.ccid + "?")) return;
  saveState(state);
  announce("Submitting…");
  submissionPending = true;
  const form = buildSubmissionForm();
  form.submit();
  setTimeout(() => form.remove(), 1500);
}));
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