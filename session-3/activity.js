"use strict";
(() => {
 const {papers,questions,synthesis}=window.LAB;
 const $=id=>document.getElementById(id), key="edpy501-s3-synthesis-v1";
 let state={answers:Array(10).fill(false),attempts:Array(10).fill(0),first:Array(10).fill(null),current:0};
 try { const saved=JSON.parse(localStorage.getItem(key)); if(saved && Array.isArray(saved.answers)&&saved.answers.length===10&&saved.answers.every(x=>typeof x==="boolean")&&Array.isArray(saved.attempts)&&saved.attempts.length===10&&saved.attempts.every(Number.isInteger)&&Array.isArray(saved.first)&&saved.first.length===10&&saved.first.every(x=>x===null||typeof x==="boolean")&&Number.isInteger(saved.current)&&saved.current>=0&&saved.current<10) state=saved; } catch(_){}
 function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch(_){$("storage-note").textContent="Browser storage is unavailable. Progress lasts only while this page stays open; nothing is submitted.";}}
 $("papers").innerHTML=papers.map(p=>`<details class="paper" id="paper-${p.id}"><summary><strong>Paper ${p.id} · ${p.title}</strong><span>${p.short} · Open reading card</span></summary><div class="reading"><h4>Literature-review summary · Prior research</h4>${p.review.map(t=>`<p>${t}</p>`).join("")}<p class="source">Source: ${p.reviewSource}.</p><div class="evidence"><h4>Study evidence · Methods and results</h4><p><strong>Context:</strong> ${p.context}</p><p>${p.evidence}</p><p><strong>Interpretive limit:</strong> ${p.limit}</p><p class="source">Source: ${p.evidenceSource}.</p></div><p class="small">${p.citation}</p><a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">Open original Paper ${p.id} ↗</a></div></details>`).join("");
 function renderMatrix(){
  const count=state.answers.filter(Boolean).length;
  $("progress").value=count;$("progress-label").textContent=`${count} of 10 questions completed`;
  $("matrix-body").innerHTML=papers.map((p,i)=>`<tr><th scope="row">Paper ${p.id}<br>${p.short}<p>${p.context}</p></th>${["gap","design","finding"].map(field=>{const n=questions.findIndex(q=>q.paper===i&&q.field===field);return `<td class="${state.answers[n]?"unlocked":"locked"}">${state.answers[n]?p[field]:`<button data-goto="${n}">Fill with question ${n+1}</button>`}</td>`;}).join("")}<td>${p.limit}</td></tr>`).join("");
  $("synthesis").textContent=state.answers[9]?synthesis:"Cross-study synthesis · Unlock with question 10.";
  $("completion").hidden=count!==10;
  if(count===10)$("completion").innerHTML=`<h3>Matrix complete. Now read across the rows.</h3><p>You answered ${state.first.filter(Boolean).length}/10 correctly on your first attempt and completed all 10 with feedback. This is practice, not a submitted grade.</p><p>Notice the key boundary: evidence about performance, beliefs and measurement cannot be treated as the same outcome.</p>`;
  $("matrix-body").querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>go(Number(b.dataset.goto)));
 }
 function render(){
  renderMatrix();
  $("steps").innerHTML=questions.map((q,i)=>`<button type="button" data-step="${i}" class="${state.answers[i]?"done":""}" ${i===state.current?'aria-current="step"':""} aria-label="Question ${i+1}${state.answers[i]?", completed":""}">${i+1}${state.answers[i]?" ✓":""}</button>`).join("");
  $("steps").querySelectorAll("button").forEach(b=>b.onclick=()=>go(Number(b.dataset.step)));
  const q=questions[state.current],done=state.answers[state.current];
  $("question").innerHTML=`<p class="eyebrow">QUESTION ${state.current+1} / 10 · ${q.field}</p><h3 tabindex="-1" id="question-title">${q.prompt}</h3>${q.paper!==null?`<a href="#paper-${papers[q.paper].id}" id="reread">Revisit Paper ${papers[q.paper].id}</a>`:'<a href="#readings">Revisit all readings</a>'}<div class="options">${q.options.map((o,i)=>`<button type="button" class="option ${done&&i===q.answer?"correct":""}" data-option="${i}" ${done?"disabled":""}><b>${String.fromCharCode(65+i)}</b><span>${o}${done&&i===q.answer?" ✓ Correct":""}</span></button>`).join("")}</div><div id="feedback" role="status" aria-live="polite" aria-atomic="true" class="feedback" ${done?"":"hidden"}>${done?`<strong>Cell unlocked.</strong> ${q.explain}`:""}</div><div class="actions"><button id="next" class="primary" type="button" ${done?"":"hidden"}>${state.current===9?"See my matrix":"Next question →"}</button></div>`;
  $("reread")?.addEventListener("click",()=>{$(`paper-${papers[q.paper].id}`).open=true;});
  $("question").querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.option),b));
  $("next").onclick=()=>{if(state.current<9)go(state.current+1);else{$("matrix").scrollIntoView();$("matrix").setAttribute("tabindex","-1");$("matrix").focus({preventScroll:true});}};
 }
 function go(i){state.current=i;save();render();$("question-title").focus({preventScroll:true});$("practice").scrollIntoView({block:"start"});}
 function answer(i,button){const q=questions[state.current];if(state.answers[state.current])return;state.attempts[state.current]++;if(state.first[state.current]===null)state.first[state.current]=i===q.answer;const feedback=$("feedback");feedback.hidden=false;
  if(i===q.answer){state.answers[state.current]=true;save();renderMatrix();button.classList.add("correct");button.querySelector("span").textContent+=" ✓ Correct";$("question").querySelectorAll("[data-option]").forEach(b=>b.disabled=true);feedback.className="feedback";feedback.innerHTML=`<strong>Correct — cell unlocked.</strong> ${q.explain}`;$("next").hidden=false;const step=$("steps").querySelector(`[data-step="${state.current}"]`);step.classList.add("done");step.textContent=`${state.current+1} ✓`;step.setAttribute("aria-label",`Question ${state.current+1}, completed`);}
  else{button.classList.add("wrong");button.disabled=true;feedback.className="feedback retry";feedback.innerHTML=`<strong>Not quite. Try another choice.</strong> ${q.hints[i]}`;save();}
 }
 $("print").onclick=()=>window.print();$("reset").onclick=()=>{$("reset-confirm").hidden=false;$("confirm-reset").focus();};$("cancel-reset").onclick=()=>{$("reset-confirm").hidden=true;$("reset").focus();};$("confirm-reset").onclick=()=>{state={answers:Array(10).fill(false),attempts:Array(10).fill(0),first:Array(10).fill(null),current:0};save();$("reset-confirm").hidden=true;go(0);};
 render();
})();
