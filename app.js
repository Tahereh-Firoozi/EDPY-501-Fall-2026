(function () {
  "use strict";

  const config = window.EDPY501_CONFIG || {};

  function isSafeWebUrl(value) {
    if (!value || typeof value !== "string") return false;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function configureFormLink(linkId, messageId, url) {
    const link = document.getElementById(linkId);
    const message = document.getElementById(messageId);
    if (!link || !message) return;

    if (isSafeWebUrl(url)) {
      link.href = url;
      link.removeAttribute("aria-disabled");
      message.hidden = true;
      return;
    }

    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", function (event) {
      event.preventDefault();
      message.hidden = false;
      message.focus?.();
    });
    message.hidden = false;
  }

  configureFormLink("baseline-form-link", "baseline-form-message", config.baselineFormUrl);
  configureFormLink("exit-form-link", "exit-form-message", config.exitTicketFormUrl);

  const revealCases = document.getElementById("reveal-cases");
  const resetCases = document.getElementById("reset-cases");
  const caseGrid = document.getElementById("case-grid");

  revealCases?.addEventListener("click", function () {
    document.querySelectorAll(".case-card .debrief").forEach(function (debrief) {
      debrief.hidden = false;
    });
    revealCases.textContent = "Debrief prompts shown";
  });

  resetCases?.addEventListener("click", function () {
    caseGrid?.querySelectorAll("select").forEach(function (select) {
      select.selectedIndex = 0;
    });
    document.querySelectorAll(".case-card .debrief").forEach(function (debrief) {
      debrief.hidden = true;
    });
    if (revealCases) revealCases.textContent = "Compare with the debrief prompts";
  });

  document.getElementById("print-study")?.addEventListener("click", function () {
    window.print();
  });

  document.getElementById("clear-study")?.addEventListener("click", function () {
    document.querySelectorAll("#activity-two textarea").forEach(function (field) {
      field.value = "";
    });
    document.querySelectorAll("#activity-two input[type='radio']").forEach(function (radio) {
      radio.checked = false;
    });
  });

  const workflow = document.getElementById("verification-flow");
  const revealWorkflow = document.getElementById("reveal-workflow");
  revealWorkflow?.addEventListener("click", function () {
    if (!workflow) return;
    workflow.hidden = false;
    revealWorkflow.textContent = "Verification workflow shown";
    workflow.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
