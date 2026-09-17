"use strict";
(() => {
 const {papers,questions,synthesis}=window.LAB;
 const $=id=>document.getElementById(id), key="edpy501-s3-synthesis-v1", dialog=$("question-dialog");
 const labels={gap:"Identify the research gap",design:"Explore the study design",finding:"Find the main result"};
 const names={gap:"Research gap",design:"Study design",finding:"Main finding",synthesis:"Connecting the studies"};
 let state={answers:Array(10).fill(false),current:0}, lastFilled=null;
 try {
  const saved=JSON.parse(localStorage.getItem(key));
  if(saved && Array.isArray(saved.answers) && saved.answers.length===10 && saved.answers.every(x=>typeof x==="boolean")){
   state.answers=saved.answers;
   if(Number.isInteger(saved.current)&&saved.current>=0&&saved.current<10)state.current=saved.current;
  }
 } catch(_){}
 if(!state.answers.slice(0,9).every(Boolean))state.answers[9]=false;
 function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch(_){$("storage-note").textContent="Browser storage is unavailable. Progress lasts while this page stays open; nothing is submitted.";}}
 function reading(p){return `<h4>Literature-review summary · What earlier research said</h4>${p.review.map(t=>`<p>${t}</p>`).join("")}<p class="source">Source: ${p.reviewSource}.</p><div class="evidence"><h4>This study · What the researchers did and found</h4><p><strong>Who and where:</strong> ${p.context}</p><p>${p.evidence}</p><p><strong>A reason for caution:</strong> ${p.limit}</p><p class="source">Source: ${p.evidenceSource}.</p></div>`;}
 $("papers").innerHTML=papers.map(p=>`<details class="paper" id="paper-${p.id}"><summary><strong>Paper ${p.id} · ${p.title}</strong><span>${p.short} · Open reading card</span></summary><div class="reading">${reading(p)}<p class="small">${p.citation}</p><a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">Open original Paper ${p.id} ↗</a></div></details>`).join("");
 function renderMatrix(){
  const count=state.answers.slice(0,9).filter(Boolean).length;
  $("progress").value=count;$("progress-label").textContent=`${count} of 9 study cells filled`;
  $("matrix-body").innerHTML=papers.map((p,i)=>`<tr><th scope="row">Paper ${p.id}<br>${p.short}<p>${p.context}</p></th>${["gap","design","finding"].map(field=>{
   const n=questions.findIndex(q=>q.paper===i&&q.field===field),done=state.answers[n];
   return `<td id="cell-${n}" class="${done?"unlocked":"locked"}"><button class="cell-button" type="button" data-goto="${n}" aria-label="Paper ${p.id}: ${done?"review":"fill"} ${names[field].toLowerCase()}">${done?`<span class="cell-check">✓ Added to your matrix</span><span>${p[field]}</span><small>Revisit explanation ↗</small>`:`<span class="cell-plus" aria-hidden="true">+</span><span>${labels[field]}</span><small>Open a guided question</small>`}</button></td>`;
  }).join("")}<td>${p.limit}</td></tr>`).join("");
  $("synthesis").innerHTML=`<p class="eyebrow">03 / CONNECT THE STUDIES</p><h3>What do the papers tell us together?</h3>${count<9?`<p>Fill the nine study cells first. Then one final question will help you compare the papers.</p><button type="button" disabled>Available after all 9 cells are filled (${count}/9)</button>`:`${state.answers[9]?`<p>${synthesis}</p>`:"<p>Your study cells are ready. Now look for a connection across the rows.</p>"}<button id="synthesis-question" type="button" class="primary">${state.answers[9]?"Revisit the synthesis explanation":"Connect the three studies →"}</button>`}`;
  $("completion").hidden=!state.answers.every(Boolean);
  $("completion").innerHTML="<h3>Your matrix is complete.</h3><p>You have compared three studies and connected their ideas. You can revisit any cell or save your matrix. Trying different answers is part of learning.</p>";
  $("matrix-body").querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>openQuestion(Number(b.dataset.goto)));
  $("synthesis-question")?.addEventListener("click",()=>openQuestion(9));
 }
 function renderQuestion(){
  const q=questions[state.current],done=state.answers[state.current],p=q.paper===null?null:papers[q.paper];
  $("question").innerHTML=`<p class="eyebrow">${p?"PAPER "+p.id:"ALL THREE PAPERS"} · ${names[q.field]}</p><h3 tabindex="-1" id="question-title">${q.prompt}</h3><p class="question-help">${q.help}</p><p class="small">Choose one answer. You can try again as often as you need.</p><details class="question-reading"><summary>${p?"Read Paper "+p.id+"’s summary here":"Look back at the three completed rows"}</summary><div class="reading">${p?reading(p):papers.map(p=>`<h4>Paper ${p.id}</h4><p>${p.finding}</p><p><strong>Caution:</strong> ${p.limit}</p>`).join("")}</div></details><div class="options">${q.options.map((o,i)=>`<button type="button" class="option ${done&&i===q.answer?"correct":""}" data-option="${i}" ${done?"disabled":""}><b>${String.fromCharCode(65+i)}</b><span>${o}${done&&i===q.answer?" ✓ Correct":""}</span></button>`).join("")}</div><div id="feedback" role="status" aria-live="polite" aria-atomic="true" class="feedback" ${done?"":"hidden"}>${done?`<strong>Why this fits:</strong> ${q.explain}`:""}</div><div class="actions"><button id="back-to-matrix" class="primary" type="button">${done?"See this in my matrix →":"Back to my matrix"}</button></div>`;
  $("question").querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.option),b));
  $("back-to-matrix").onclick=()=>dialog.close();
 }
 function openQuestion(n){
  if(n===9&&!state.answers.slice(0,9).every(Boolean))return;
  state.current=n;save();renderQuestion();dialog.showModal();dialog.scrollTop=0;$("question-title").focus({preventScroll:true});
 }
 function answer(i,button){
  const q=questions[state.current];if(state.answers[state.current])return;
  const feedback=$("feedback");feedback.hidden=false;
  if(i===q.answer){
   state.answers[state.current]=true;lastFilled=state.current;save();renderMatrix();
   button.classList.add("correct");button.querySelector("span").textContent+=" ✓ Correct";
   $("question").querySelectorAll("[data-option]").forEach(b=>b.disabled=true);
   feedback.className="feedback";feedback.innerHTML=`<strong>That fits — ${state.current===9?"your synthesis is ready":"your cell is filled"}.</strong> ${q.explain}`;
   $("back-to-matrix").textContent="See this in my matrix →";
   $("back-to-matrix").focus({preventScroll:true});
  }else{
   button.classList.add("wrong");button.setAttribute("aria-label",q.options[i]+" — try another answer");
   feedback.className="feedback retry";feedback.innerHTML=`<strong>Let’s look at it another way.</strong> ${q.hints[i]} <span>You can try another answer.</span>`;
  }
 }
 $("close-dialog").onclick=()=>dialog.close();
 dialog.addEventListener("close",()=>{
  const n=state.current,target=n===9?$("synthesis-question"):$("matrix-body").querySelector(`[data-goto="${n}"]`);
  target?.focus({preventScroll:true});target?.scrollIntoView({block:"nearest",inline:"nearest"});
  if(lastFilled!==null){
   const cell=lastFilled===9?$("synthesis"):$("cell-"+lastFilled);
   cell?.classList.remove("just-filled");requestAnimationFrame(()=>cell?.classList.add("just-filled"));
   $("matrix-status").textContent=lastFilled===9?"Your synthesis has been added.":`Paper ${papers[questions[lastFilled].paper].id}: ${names[questions[lastFilled].field].toLowerCase()} added to your matrix.`;
   lastFilled=null;
  }
 });
 $("print").onclick=()=>window.print();
 $("reset").onclick=()=>{$("reset-confirm").hidden=false;$("confirm-reset").focus();};
 $("cancel-reset").onclick=()=>{$("reset-confirm").hidden=true;$("reset").focus();};
 $("confirm-reset").onclick=()=>{state={answers:Array(10).fill(false),current:0};lastFilled=null;save();$("reset-confirm").hidden=true;renderMatrix();$("matrix-status").textContent="Ready for a fresh start. Choose any empty cell.";$("matrix-body").querySelector("[data-goto]").focus();};
 renderMatrix();
})();
