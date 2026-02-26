/**********************************************************************/
/* 案件取得
/**********************************************************************/

document.addEventListener("DOMContentLoaded", async () => {

  const root = document.querySelector("section.jobs .bodying");
  if (!root) return;

  const listEl = root.querySelector(".list");
  const placeholderEl = root.querySelector(".placeholder");
  const template = root.querySelector("#job-card-template");

  if (!listEl || !template) return;

  const endpoint = "https://api.freelance-mikata.com/v2/projects";

  const showPlaceholder = () => {
    if (placeholderEl) placeholderEl.hidden = false;
  };

  const hidePlaceholder = () => {
    if (placeholderEl) placeholderEl.hidden = true;
  };

  const pickWeek = (workingStyles) => {
    if (!Array.isArray(workingStyles)) return "";
    const w = workingStyles.find(x => typeof x?.name === "string" && x.name.includes("週"));
    return w?.name ?? "";
  };

  const pickRemote = (workingStyles) => {
    if (!Array.isArray(workingStyles)) return "";
    const hasRemote = workingStyles.some(x => typeof x?.name === "string" && x.name.includes("リモート"));
    return hasRemote ? "あり" : "";
  };

  const joinNames = (arr) => {
    if (!Array.isArray(arr)) return "";
    return arr
      .map(x => x?.name)
      .filter(v => typeof v === "string" && v.trim())
      .join(" / ");
  };

  const normalizeIncome = (job) => {
    // 添付JSONでは displayMinAmount / displayMaxAmount が入ってるケースが多い:contentReference[oaicite:1]{index=1}
    const min = job?.displayMinAmount ?? job?.sales_price_min ?? "";
    const max = job?.displayMaxAmount ?? job?.sales_price_max ?? "";
    return {
      min: (min ?? "").toString(),
      max: (max ?? "").toString(),
      unit: "万円/月"
    };
  };

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    console.log(json);

    // 添付は data 配列:contentReference[oaicite:2]{index=2}
    const jobs = Array.isArray(json.data) ? json.data.slice(0, 3) : [];

    if (jobs.length === 0) {
      showPlaceholder();
      return;
    }

    hidePlaceholder();

    jobs.forEach(job => {
      const frag = template.content.cloneNode(true);

      const setText = (field, value) => {
        const el = frag.querySelector(`[data-field="${field}"]`);
        if (!el) return;

        const normalized =
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
            ? "---"
            : value;

        el.textContent = normalized;
      };

      const income = normalizeIncome(job);

      setText("title", job?.name ?? "");

      setText("income_min", income.min);
      setText("income_max", income.max);
      setText("income_unit", income.unit);

      setText("loc", job?.prefectures?.[0]?.name ?? "");
      setText("week", pickWeek(job?.workingStyles));
      setText("remote", pickRemote(job?.workingStyles));

      setText("lang", joinNames(job?.skills));
      setText("env", joinNames(job?.positions));

      setText("detail", job?.detail ?? "");
      setText("cta_message", "任せられるエージェントが最短距離でこの案件をご紹介します");

      // クローン内の data-form-open をカスタムイベントで起動（動的DOMでも確実）
      frag.querySelectorAll("[data-form-open]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          document.dispatchEvent(new Event("form:open"));
        });
      });

      listEl.appendChild(frag);
    });

  } catch (err) {
    console.error("jobs.json load failed:", err);
    showPlaceholder();
  }

});