/**
 * file-viewer.js
 * ----------------
 * Բացում է ուսումնական նյութերը (PDF, PPTX, DOCX, IPYNB) նոր tab-ում՝
 * ուղիղ դիտման համար, փոխանակ դրանք ուղղակի ներբեռնելու։
 *
 * ⚠️ ԿԱՐԵՎՈՐ. Սա աշխատում է միայն այն դեպքում, երբ կայքը հրապարակված է
 * հանրային hosting-ի վրա (GitHub Pages, Netlify, և այլն) — ոչ թե տեղական
 * համակարգչից բացված (file:///...) կամ localhost-ից, քանի որ Office-ի և
 * Colab-ի viewer-ները պետք է կարողանան ինքնուրույն ներբեռնել ֆայլը
 * ինտերնետից՝ նրա հանրային հասցեով։
 *
 * ԱՆՀՐԱԺԵՇՏ ԿԱՐԳԱՎՈՐՈՒՄ .ipynb ֆայլերի համար.
 * Google Colab-ը կարող է ֆայլեր բացել միայն GitHub-ից՝ ուղիղ URL-ով
 * ֆայլից (ոչ թե ցանկացած hosting-ից)։ Այդ պատճառով անհրաժեշտ է ներքևում
 * լրացնել GITHUB_REPO-ն, եթե այս կայքի կոդը տեղադրված է GitHub-ում
 * (օրինակ՝ GitHub Pages-ի միջոցով)։
 */

const GITHUB_REPO = "hv-smile/AI_info"; // օր.՝ "harutyun/ab-hosq-site"  (username/repo-anun)
const GITHUB_BRANCH = "main"; // կամ "master", ինչ branch որ օգտագործում ես

/**
 * ՄԵԾ ՖԱՅԼԵՐ (>25MB) — առանց Google Drive-ի, առանց "թույլտվություն" հարցի
 * ---------------------------------------------------------------------
 * GitHub-ի 25MB սահմանաչափը վերաբերում է միայն web-ով (drag & drop)
 * վերբեռնելուն։ "Releases" բաժնում կցվող ֆայլերի համար այդ սահմանաչափը
 * չկա (մինչև 2GB մեկ ֆայլի համար), ֆայլը հանրային է, և ոչ ոք չպետք է
 * հարցնի քեզնից թույլտվություն ամեն անգամ, ինչպես Google Drive-ի դեպքում։
 *
 * Ինչպես ավելացնել մեծ ֆայլը.
 *   1) Repo-ի էջում՝ աջ կողմում սեղմիր "Releases" → "Draft a new release"
 *   2) Դիր tag (օր.՝ "materials") և վերնագիր, ապա "Publish release"
 *      (հետո "Edit release"-ով կարող ես նաև ֆայլեր ավելացնել)
 *   3) "Attach binaries by dropping them here..." տեղում քաշիր-գցիր
 *      մեծ ֆայլերը (PDF/PPTX/DOCX) — այստեղ 25MB-ի սահմանաչափ չկա
 *   4) Publish → յուրաքանչյուր ֆայլի հասցեն ավտոմատ կլինի.
 *      https://github.com/<username>/<repo>/releases/download/<tag>/<filename>
 *   5) Ներքևում լրացրու քո հասցեն LARGE_FILES_BASE-ում, և ավելացրու
 *      ճշգրիտ ֆայլանունները LARGE_FILES ցուցակում (պետք է ճիշտ նույնը
 *      լինի, ինչ Release-ում կցված ֆայլի անունն է)
 */
const LARGE_FILES_BASE = "https://github.com/HV-SMILE/AI_info/releases/download/materials/";

const LARGE_FILES = [
  "10-.pdf",
  "11-.pdf",
  "Algebra_.guidebook_10th_2nd_semester_designed.pdf",
  "Slides-Chapter1.pptx",
  "Hanrahashiv.11.kisamyak.1.pdf",
];

function openMaterial(relPath) {
  if (LARGE_FILES.includes(relPath)) {
    relPath = LARGE_FILES_BASE + relPath;
  }
  const ext = relPath.split(".").pop().toLowerCase();
  const absoluteUrl = new URL(relPath, window.location.href).href;
  const isLocal =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (ext === "pptx" || ext === "docx" || ext === "doc" || ext === "xlsx" || ext === "ppt") {
    if (isLocal) {
      alert(
        "PPTX/DOCX ֆայլերը դիտելու համար (առանց ներբեռնելու) կայքը պետք է լինի հրապարակված (GitHub Pages, Netlify և այլն)։ Այժմ ֆայլը կբացվի/կներբեռնվի ուղղակիորեն։"
      );
      window.open(absoluteUrl, "_blank");
      return;
    }
    window.open(
      "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(absoluteUrl),
      "_blank"
    );
    return;
  }

  if (ext === "ipynb") {
    if (!GITHUB_REPO) {
      alert(
        "Colab-ում ipynb ֆայլը բացելու համար պետք է լրացնես GITHUB_REPO փոփոխականը file-viewer.js ֆայլում (քո GitHub username/repo-ն)։ Առայժմ ֆայլը կներբեռնվի ուղղակիորեն։"
      );
      window.open(absoluteUrl, "_blank");
      return;
    }
    window.open(
      `https://colab.research.google.com/github/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${relPath}`,
      "_blank"
    );
    return;
  }

  // PDF և մյուս տեսակները. բրաուզերն արդեն գիտի ինչպես ցուցադրել դրանք tab-ում
  window.open(absoluteUrl, "_blank");
}
