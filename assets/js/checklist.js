/**********************************************************************/
/* 起動
/**********************************************************************/

document.addEventListener("DOMContentLoaded", () => {

  const checklist = document.getElementById("checklist");
  if (!checklist) return;

  const container = checklist.querySelector(":scope > .container > .card");

  // 開くトリガー
  const openTriggers = [
    ...document.querySelectorAll("[data-checklist-open]"),
    ...document.querySelectorAll('a[href="#checklist-open"]')
  ];

  // 閉じるトリガー
  const closeTriggers = document.querySelectorAll("[data-checklist-close]");

  function toggleChecklist(e) {
    if (e) e.preventDefault();
    checklist.classList.toggle("_open");
  }

  function closeChecklist(e) {
    if (e) e.preventDefault();
    checklist.classList.remove("_open");
  }

  openTriggers.forEach(el => {
    el.addEventListener("click", toggleChecklist);
  });

  closeTriggers.forEach(el => {
    el.addEventListener("click", closeChecklist);
  });

  checklist.addEventListener("click", (e) => {
    closeChecklist(e);
  });

  if (container) {
    container.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

});