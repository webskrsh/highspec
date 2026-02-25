document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(
    "section.faq .list .item._accordion_button .q"
  );

  buttons.forEach((q) => {
    q.addEventListener("click", () => {

      const item = q.closest("._accordion_button");
      const answer = item.querySelector(".a");

      const isOpen = item.classList.contains("open");

      if (isOpen) {
        // 閉じる
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => {
          answer.style.height = "0px";
        });

        item.classList.remove("open");

      } else {
        // 開く
        answer.style.height = answer.scrollHeight + "px";

        answer.addEventListener("transitionend", function handler() {
          answer.style.height = "auto";
          answer.removeEventListener("transitionend", handler);
        });

        item.classList.add("open");
      }

    });
  });

});
