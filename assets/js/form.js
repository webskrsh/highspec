/**********************************************************************/
/* フォーム起動
/**********************************************************************/

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form");
  if (!form) return;

  const mq = window.matchMedia("(max-width: 520px)");
  const container = form.querySelector(":scope > .container");

  // 🔥 ここ追加
  const linkTriggers = document.querySelectorAll('a[href="#form-open"]');

  const openTriggers = [
    document.getElementById("form-open"),
    ...document.querySelectorAll("[data-form-open]"),
    ...linkTriggers
  ].filter(Boolean);

  const closeTriggers = [
    document.getElementById("form-close"),
    ...document.querySelectorAll("[data-form-close]")
  ].filter(Boolean);

  function getFirstField() {
    return form.querySelector(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled])"
    );
  }

  function focusFirstField() {
    const first = getFirstField();
    if (!first) return;
    setTimeout(() => first.focus(), 800);
  }

  // ----- SP -----
  function openSP(e) {
    if (e) e.preventDefault();

    const willOpen = !form.classList.contains("_open");
    form.classList.toggle("_open");

    if (willOpen) focusFirstField();
  }

  function closeSP(e) {
    if (e) e.preventDefault();
    form.classList.remove("_open");
  }

  // ----- PC -----
  function openPC(e) {
    if (e) e.preventDefault();

    form.classList.add("_prompt");
    focusFirstField();

    const onFormClick = (ev) => {
      const el = ev.target;
      if (el.closest("input, textarea, select")) {
        form.classList.remove("_prompt");
        form.removeEventListener("click", onFormClick, true);
      }
    };

    form.addEventListener("click", onFormClick, true);
  }

  function closePC(e) {
    if (e) e.preventDefault();
    form.classList.remove("_prompt");
  }

  function handleOpen(e) {
    if (mq.matches) openSP(e);
    else openPC(e);
  }

  function handleClose(e) {
    if (mq.matches) closeSP(e);
    else closePC(e);
  }

  openTriggers.forEach(el => el.addEventListener("click", handleOpen));
  closeTriggers.forEach(el => el.addEventListener("click", handleClose));

  // SP overlay close
  form.addEventListener("click", (e) => {
    if (!mq.matches) return;
    closeSP(e);
  });

  if (container) {
    container.addEventListener("click", (e) => {
      if (!mq.matches) return;
      e.stopPropagation();
    });
  }

  mq.addEventListener("change", () => {
    form.classList.remove("_open");
    form.classList.remove("_prompt");
  });

});

/**********************************************************************/
/* 職務経歴書アップロードボタン
/**********************************************************************/

document.addEventListener("DOMContentLoaded", () => {

  const control = document.querySelector('[data-part="upload"]');
  if (!control) return;

  const fileInput = control.querySelector('.file-input');
  const uploadBtn = control.querySelector('.upload-btn');
  const listEl = control.querySelector('.uploaded ul');

  // ここが本体：選択ファイルを保持する入れ物
  const dt = new DataTransfer();

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    // 追加選択されたファイルをdtへ積む
    for (const file of fileInput.files) {
      // 同名・同サイズ・同更新日の重複を避けたい場合はここで弾く
      const exists = Array.from(dt.files).some(f =>
        f.name === file.name &&
        f.size === file.size &&
        f.lastModified === file.lastModified
      );
      if (!exists) dt.items.add(file);
    }

    // input.files を差し替えて送信内容を同期
    fileInput.files = dt.files;

    // 一覧を描画
    renderList();

    // 同じファイルをもう一回選べるようにリセット
    fileInput.value = "";
  });

  function renderList() {
    listEl.innerHTML = "";

    Array.from(dt.files).forEach((file, index) => {
      const li = document.createElement("li");

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = file.name;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete";
      del.addEventListener("click", () => {
        // dtから削除 → input.filesも同期 → 再描画
        dt.items.remove(index);
        fileInput.files = dt.files;
        renderList();
      });

      li.appendChild(name);
      li.appendChild(del);
      listEl.appendChild(li);
    });
  }

});