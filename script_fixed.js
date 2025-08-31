import { PropertyDatabase } from "./propertyDatabase.js";

// --- Firebase (module) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// --- Firebase Initialization (single init) ---
const firebaseConfig = {
  apiKey: "AIzaSyAQQVDajaCdDDhL_bfBqJOl4b0zBgBSLic",
  authDomain: "dor-real-estate.firebaseapp.com", // <-- fix this key
  projectId: "dor-real-estate",
  storageBucket: "dor-real-estate.appspot.com",
  messagingSenderId: "501082745824",
  appId: "1:501082745824:web:cda8afd68c1d8148b45985",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.firebaseApp = app;
window.firebaseAuth = auth;

// --- Helper: Basic IL phone normalization to E.164 ---
function formatILPhoneE164(raw) {
  const t = (raw || "").trim();
  if (!t) return "";
  if (t.startsWith("+")) return t;
  return t.replace(/^\s*0/, "+972");
}

// --- Phone Auth Setup (called when register step is rendered) ---
let recaptchaWidgetId = null;

async function setupPhoneAuth() {
  const host = ensureRecaptchaRoot(); // your existing persistent host
  ensureUIRoot(); // create toast container if missing

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      host,
      { size: "invisible" },
      auth,
    );
    window.recaptchaVerifier.render().then((id) => (recaptchaWidgetId = id));
  }

  let confirmationResult = null;
  const sendBtn = document.getElementById("sendCodeBtn");
  const verifyBtn = document.getElementById("verifyCodeBtn");
  if (!sendBtn || !verifyBtn) return;

  // Clear inline error whenever user types
  const nameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phoneNumber");
  const codeInput = document.getElementById("smsCode");
  [nameInput, phoneInput, codeInput].forEach((el) => {
    if (el) el.addEventListener("input", () => showInlineError(""));
  });

  sendBtn.onclick = async () => {
    const phoneRaw = (
      document.getElementById("phoneNumber")?.value || ""
    ).trim();
    const fullName = (document.getElementById("fullName")?.value || "").trim();

    if (!fullName) {
      showInlineError("אנא הזינו שם מלא");
      return;
    }
    if (!phoneRaw) {
      showInlineError("אנא הזינו מספר טלפון");
      return;
    }

    if (typeof grecaptcha !== "undefined" && recaptchaWidgetId != null) {
      grecaptcha.reset(recaptchaWidgetId);
    }

    const phone = formatILPhoneE164(phoneRaw);
    setLoading(sendBtn, true);
    try {
      confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier,
      );
      const step = document.getElementById("smsStep");
      if (step?.style) step.style.display = "block";
      document.getElementById("smsCode")?.focus();
      showInlineError(""); // hide any previous error
      showToast("✨ קוד נשלח לנייד", "success");
    } catch (err) {
      showToast("בעיה בשליחת SMS: " + err.message, "error");
    } finally {
      setLoading(sendBtn, false);
    }
  };

  verifyBtn.onclick = async () => {
    if (!confirmationResult) {
      showInlineError('שלחו קוד קודם בלחיצה על "שלחו לי קוד אימות"');
      return;
    }
    const code = (document.getElementById("smsCode")?.value || "").trim();
    if (!code) {
      showInlineError("אנא הזינו את הקוד");
      return;
    }

    setLoading(verifyBtn, true);
    try {
      const cred = await confirmationResult.confirm(code);

      userData.auth = {
        uid: cred.user.uid,
        phone:
          cred.user.phoneNumber ||
          (document.getElementById("phoneNumber")?.value || "").trim(),
        name: (document.getElementById("fullName")?.value || "").trim(),
      };
      saveUserData();

      showInlineError("");
      goToStepType("quick-qs"); // continue onboarding
    } catch (e) {
      showToast("❌ קוד שגוי", "error");
      console.warn(e);
    } finally {
      setLoading(verifyBtn, false);
    }
  };
}

// Persistent, off-screen host for reCAPTCHA (created once)
function ensureRecaptchaRoot() {
  let el = document.getElementById("recaptcha-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "recaptcha-root";
    // keep it in the DOM (required) but out of sight
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.bottom = "0";
    document.body.appendChild(el);
  }
  return el;
}

// DOM Elements
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const onboardingOverlay = document.getElementById("onboardingOverlay");
const onboardingContent = document.getElementById("onboardingContent");
const onboardingClose = document.getElementById("onboardingClose");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const startJourneyBtn = document.getElementById("startJourney");
const swipeInterface = document.getElementById("swipeInterface");

// State Management
let currentStep = 0;
let userData = {};
let onboardingSteps = [];

// Modal Content Database
const modalContents = {
  about: {
    title: "מורשת בכתב",
    content: `
            <section class="about-timeline" dir="rtl" aria-label="קו הזמן של דור נכסים">
              <header class="about-tl-header">
                <h2>הסיפור שלנו</h2>
    <p class="about-tl-sub">
    בעולם שמשתנה ללא הרף, נדיר למצוא עסק אשר חי, נושם ומתרחב זה 28 שנים. כדי לפעול מתוך תשוקה, אשר רק הולכת ומתחזקת, לאורך תקופת זמן שכזו, מוכרחת להיות כמיהה אמיתית.
    </p>
    <p class="about-tl-sub">
    עבורנו, נדל"ן מהווה שליחות. המסע שלנו התחיל ברצון לגעת בכל אדם דרך האנרגיה הקיומית המרתקת של הנדל"ן, בתצורה של חיבור למרחב ההגשמה המדויק עבורו.
    </p>
    <p class="about-tl-sub">
    בהמשך, אף להגשים את חזון בניין ארץ ישראל ולבנות בתים חדשים.</p>
    <p class="about-tl-sub">
    למעשה, זו זכות להגיד כי אנו כאן. ענפים יותר, חדשניים יותר, חזקים יותר, והזרוע עוד נטויה.</p>
              </header>

              <div class="about-tl-rail">
                <button class="about-tl-nav prev" aria-label="אחורה" title="אחורה">‹</button>

                <ol class="about-tl-list" id="aboutTlList">
                  <!-- 1997 -->
                  <li class="tl-item" tabindex="0">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="תחילת הדרך – בית מסחר נכסים, 1997">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year">1997</span>
                      <h3 class="tl-title">בית מסחר נכסים</h3>
                      <p class="tl-desc">כניסה לעולם העסקאות, מיקוד בתמחור מדויק ובמצוינות משא ומתן. הונחו היסודות לאמון ארוך טווח.</p>
                    </div>
                  </li>

                  <!-- 2006 -->
                  <li class="tl-item" tabindex="0">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="יזמות נדל״ן, 2006">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year">2006</span>
                      <h3 class="tl-title">יזמות</h3>
                      <p class="tl-desc">הרחבת הפעילות לפיתוח פרויקטים: מימון, תכנון ורישוי, ניהול קצה לקצה.</p>
                    </div>
                  </li>

                  <!-- 2008 -->
                  <li class="tl-item" tabindex="0">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="שיווק פרויקטים, 2008">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year">2008</span>
                      <h3 class="tl-title">שיווק פרויקטים</h3>
                      <p class="tl-desc">בניית מנוע שיווקי עם דאטת שוק, קהלים וחוויית לקוח, על מנת להאיץ קליטה ומכירות.</p>
                    </div>
                  </li>

                  <!-- 2011 -->
                  <li class="tl-item" tabindex="0">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="בית השקעות, 2011">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year">2011</span>
                      <h3 class="tl-title">בית השקעות</h3>
                      <p class="tl-desc">מסגרות השקעה למשקיעים פרטיים ומשפחתיים, בקרת סיכונים ודיווחיות.</p>
                    </div>
                  </li>

                  <!-- 2014 -->
                  <li class="tl-item" tabindex="0">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="התרחבות ופריסה, 2014">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year">2014</span>
                      <h3 class="tl-title">התרחבות</h3>
                      <p class="tl-desc">צמיחה אורגנית, חיזוק שרשרת הערך ומעבר לפעילות רב‑תחומית.</p>
                    </div>
                  </li>

                  <!-- 2020 -->
                  <li class="tl-item" tabindex="0">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="דור הבא, 2020">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year">2020</span>
                      <h3 class="tl-title">דור הבא</h3>
                      <p class="tl-desc">מתודות מבוססות דאטה, אוטומציה וניתוח קבלת החלטות, מכפילי ביצוע ותשואה.</p>
                    </div>
                  </li>

                  <!-- 2025 -->
                  <li class="tl-item tl-highlight" tabindex="0" aria-current="step">
                    <div class="tl-cover">
                      <img src="gen_pic/bg_blurred.png" alt="REDOR – יוזמת השקעות, 2025">
                    </div>
                    <div class="tl-meta">
                      <span class="tl-year tl-badge">2025</span>
                      <h3 class="tl-title">REDOR</h3>
                      <p class="tl-desc">יוזמת השקעות ממוקדת. מסגרות קפיטליות, תהליכי סינון ושותפויות. <span class="tl-note">בשלבי פריסה והרחבה</span>.</p>
                    </div>
                  </li>
                </ol>

                <button class="about-tl-nav next" aria-label="קדימה" title="קדימה">›</button>
              </div>

            <footer class="about-tl-foot">
              <button class="cta-button start-journey">על מה אתם חולמים?</button>
            </footer>

            </section>
          `,
  },
  services: {
    title: "שירותי הפירמה",
    content: `
      <section class="services-timeline" dir="rtl" aria-label="שירותי דור נכסים">
        <header class="services-tl-header">
          <h2>התחומים שלנו</h2>
        </header>

        <div class="services-tl-rail">
          <button class="services-tl-nav prev" aria-label="אחורה" title="אחורה">‹</button>

          <ol class="services-tl-list" id="servicesTlList">

            <li class="svc-item" tabindex="0">
              <div class="svc-cover">
                <img src="gen_pic/bg_blurred.png" alt="יזמות">
              </div>
              <div class="svc-meta">
                <h3 class="svc-title">יזמות</h3>
                <p class="svc-desc">איתור קרקעות מדויק, באמצעות מודלים מבוססי למידת מכונה, פרדיקציות ובינה מלאכותית. ניתוח תב"ע ותכנון מותאם, לצד ניהול רישוי וביצוע מוקפד. יצירת ערך אמיתי כבר מהרעיון ועד המפתח.</p>
              </div>
            </li>

            <li class="svc-item" tabindex="0">
              <div class="svc-cover">
                <img src="gen_pic/bg_blurred.png" alt="שיווק">
              </div>
              <div class="svc-meta">
                <h3 class="svc-title">שיווק</h3>
                <p class="svc-desc">אסטרטגיה מונחית דאטה, בהשראה משיווק קוואנטי. חווית לקוח מותאמת אישית לצורך פילוח שוק מבוסס בינה מלאכותית. מיתוג עוצמתי בעולמות הפרויקטים והיד-שנייה.</p>
              </div>
            </li>

            <li class="svc-item" tabindex="0">
              <div class="svc-cover">
                <img src="gen_pic/bg_blurred.png" alt="המחלקה הפיננסית">
              </div>
              <div class="svc-meta">
                <h3 class="svc-title">המחלקה הפיננסית</h3>
                <p class="svc-desc">מודלי תשואה מתקדמים, פתרונות מימון מותאמים ועסקאות מיזוגים ורכישות מנוהלות בקפדנות. בקרת סיכונים רציפה להבטחת יציבות וצמיחה בכל שלב.</p>
              </div>
            </li>

          </ol>

          <button class="services-tl-nav next" aria-label="קדימה" title="קדימה">›</button>
        </div>

        <footer class="services-tl-foot">
              <button class="cta-button" data-modal="team" type="button">
                חבר הבכירים
              </button>
            </footer>
      </section>
      `,
  },
  contact: {
    title: "צור קשר",
    content: `
            <h2>מחכים לך בבית..</h2>
            <div style="margin-top: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <h3> </h3>
                    <p><strong>כתובת:</strong> ויצמן 37, גבעתיים</p>
                    <p><strong>טלפון:</strong> 050-5534488</p>
                    <p><strong>אימייל:</strong> inquiries@dorealestate.com</p>
                </div>

            <form id="contactForm" style="margin-top: 1rem;">
              <div style="margin-bottom: 1rem;">
                <input id="contactName" type="text" placeholder="שם מלא"
                       style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;" required>
              </div>
              <div style="margin-bottom: 1rem;">
                <input id="contactEmail" type="email" placeholder="כתובת אימייל"
                       style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;" required>
              </div>
              <div style="margin-bottom: 1rem;">
                <textarea id="contactMsg" placeholder="הודעה" rows="4"
                          style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;" required></textarea>
              </div>
              <button type="submit" style="background: var(--primary-color); color: white; border: none; padding: 0.75rem 2rem; border-radius: 25px; cursor: pointer;">
                שלח הודעה
              </button>
            </form>


                <script>
                document.getElementById("contactForm").addEventListener("submit", function(e) {
                  e.preventDefault(); // stop normal submit
                  // here you could send data if you want
                  window.location.href = "/"; // redirect to homepage
                });
                </script>

            </div>
        `,
  },
  team: {
    title: "הצוות שלנו",
    content: `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div id="executive-counter" style="font-weight: bold; font-size: 1.2rem; margin-bottom: 2rem;">1/8</div>
                <div style="width: 60%; height: 8px; background: #e0e0e0; margin: 0 auto; border-radius: 5px; overflow: hidden; margin-bottom: 3rem;">
                    <div id="progress-bar" style="width: 14.2%; height: 100%; background: var(--primary-color); transition: width 0.3s;"></div>
                </div>
            </div>

            <div class="executive-carousel">
                <div class="executive-slide active">
                    <img src="board_pics/David.jpg" alt="דוד דור, מנכ\"ל" class="executive-photo" />
                    <div class="executive-name">דוד דור, מנכ"ל</div>
                    <p class="executive-description">
                        דוד דור עומד בחזית הפירמה מאז היום הראשון, ומוביל אותה במשך 28 שנים עם אינטליגנציה רגשית ועם דיוק קר ברגעי משא ומתן. הוא מחבר בין קריאות שוק מהירות, עם תמחור מדויק ועם סגירת עסקאות ברף הגבוה בענף. ניסיונו האישי, עם הקשרים ארוכי השנים ועם ההבנה העמוקה של השוק, לצד יכולות יזמיות מובהקות, מהווים נכס אסטרטגי שמאפשר לפירמה לפעול בעוצמה בשווקים תנודתיים. בראות עיניו, כל עסקה היא לא רק פעולה פיננסית, אלא מהווה אף הצהרה על איכות, על מוניטין ועל עמידה בהבטחות. המוטו שלו, מאז ומתמיד, היה ועודנו: "להיות ראשון, זה מחייב."
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Revital.png" alt="רויטל דור, סמנכ\"לית תפעול" class="executive-photo" />
                    <div class="executive-name">רויטל דור, סמנכ"לית תפעול</div>
                    <p class="executive-description">
                        רויטל דור מהווה, יחד עם דוד, את שלד הפירמה מראשית דרכה ומנהלת את המערך התפעולי מקצה לקצה. היא מיישרת תהליכים, עם הגדרת סטנדרטים ועם אימות שכל הבטחה שיווקית מתממשת בשטח ברמת דיוק גבוהה. ניסיונה הרב מאפשר לה לחזות אתגרי תפעול לפני שהם מתרחשים, ולפיכך, היא מבטיחה שהלקוח יחווה מסע חלק, עם אמינות ועם דיוק. שילוב היציבות, עם החזון ועם ההתמדה שלה, הופך את התפעול למנוע שקט אך עוצמתי.
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Talya.jpg" alt="טליה קמינסקי, סמנכ\"לית מכירות" class="executive-photo" />
                    <div class="executive-name">טליה קמינסקי, סמנכ"לית מכירות</div>
                    <p class="executive-description">
                        טליה קמינסקי היא הלב הפועם של הפירמה. בפרט, ברובד המכירות. זאת, נוכח הבנה עמוקה של שווקים, ומעל הכל, של אנשים. בעברה, היוות יזמית בתחומים אשר עסקו בנשמה, כך למשל במוזיקה וביצירה. בדרכה הייחודית, הצליחה לבצע אינטרגציה של מי שהיא לתוך עולם הנדל"ן. כחלק מאותו עולם, היא משלבת רבדים אנושיים יחד עם מומחיות נדל"נית, בצורה יוצאת דופן, אשר מבשילה לכדי תוצר מבריק, הבא לידי ביטוי בוריאציה של חוויה אופטימלית לקהל הלקוחות, המשקיעים והיזמים.
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Din.jpeg" alt="דין דור, סמנכ\"ל כספים" class="executive-photo" />
                    <div class="executive-name">דין דור, סמנכ"ל כספים</div>
                    <p class="executive-description">
                        דין דור גדל בתוך הפירמה, והפך לעמוד תווך פיננסי עם אסטרטגיה מדויקת ועם הבנה מעמיקה בשוק. הוא משלב חוש טבעי למנהיגות, עם שליטה במספרים ועם בקיאות במיסוי ובניהול סיכונים. בזכות היכרותו עם ה־DNA של הפירמה, הוא יודע לחבר בין מטרות ארוכות טווח, עם ביצוע מדויק ועם שמירה על יציבות פיננסית. הוא מבסס מערכות שקופות, עם חוכמה ועם יכולת תגובה מהירה, המאפשרות תמחור חכם ועם קבלת החלטות מושכלת גם בתנאי לחץ.
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Ron.jpg" alt="רון דור, סמנכ\"ל פיתוח עסקי" class="executive-photo" />
                    <div class="executive-name">רון דור, סמנכ"ל פיתוח עסקי</div>
                    <p class="executive-description">
רון דור, בדומה לאחיו דין, גדל בפירמה. לימים יצא למסע חוצה גבולות בעולם הסקאוטינג בכדורגל, ועד מהרה צבר השפעה בינלאומית. מילדות נמשך לתוכנה, ובהמשך למדעי הנתונים ולבינה המלאכותית. בכדורגל שילב תחומים אלה בהקמת חברה גלובלית, אשר חוותה צמיחה מהירה וייעלה תהליכי קבלת החלטות ברכש בקרב מועדונים. לעולם הנדל"ן מביא תפיסה אינטגרטיבית, המבוססת על מתודולוגיות איתור שפיתח בספורט, בדגש על זיהוי אסימטריות ודפוסים חבויים בקנה מידה עולמי, יחד עם ניתוח פילוסופיות התנהגות בקבלת החלטות. סט כישוריו הופך אותו לכוח מניע בחדשנות הפירמה.
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Niv.jpeg" alt="ניב שירזי, ראש המחלקה הפיננסית" class="executive-photo" />
                    <div class="executive-name">ניב שירזי, ראש המחלקה הפיננסית</div>
                    <p class="executive-description">
                        ניב שירזי, המבסס ידע רב בעולמות הפיננסיים, משמש יד ימינו של הדרג הבכיר. זאת, עם מומחיות גבוהה במימון עסקאות, עם בדיקות נאותות, עם עיצוב האסטרטגיה הפיננסית ועם מתן פתרונות אופרטיביים מדויקים. הודות לשליטתו במספרים, להבנת השוק ולראייתו האסטרטגית, הוא ממזג בין ניתוח קר ובין גמישות מחשבתית, ולמעשה מבטיח ניהול פיננסי שמגן על האינטרסים של הפירמה.
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Ari.jpg" alt="ארי גבאי, ראש קהילות המשקיעים" class="executive-photo" />
                    <div class="executive-name">ארי גבאי, ראש קהילות המשקיעים</div>
                    <p class="executive-description">
ארי גבאי מוביל קהילות משקיעים עם תפיסה קהילתית עוצמתית ועם יכולת לזהות הזדמנויות חבויות בשוק. הוא מתרגם דאטה לאינפורמציה פרקטית, עם הנגשה לקהלים שונים ועם דיוק במסרים. הוא מחבר בין אנשים, הזדמנויות וכן פתרונות השקעה מותאמים, באופן שמייצר ערך הדדי. באמצעות טיפוח קשרים בין אישיים, שיתופי פעולה אסטרטגיים ואף ניהול רשת מקצועית, הוא בונה בסיס איתן המעצים את הכוח הקולקטיבי של הפירמה.
                    </p>
                </div>
                <div class="executive-slide">
                    <img src="board_pics/Ron.jpg" alt="שחר צור, סמנכ\"לית שיווק" class="executive-photo" />
                    <div class="executive-name">שחר צור, סמנכ"לית שיווק</div>
                    <p class="executive-description">
שחר צור מובילה את המותג משלב האסטרטגיה ועד הביצוע בפועל, עם ידע נרחב בשיווק, עם סושיאל מדיה ועם ניהול קמפיינים. היא מייצרת ביקוש אורגני, עם בניית נוכחות תקשורתית ועם יוזמות שיווקיות חדשניות. יכולתה להנגיש את ערכי המותג בשפה שמדברת ללב, עם השכל ועם החושים, יוצרת חיבור רגשי עמוק עם קהלים מגוונים. כל פרויקט שהיא נוגעת בו מקבל זהות חדה, עם נוכחות בולטת ועם ערך מוסף ברור.                    </p>
                </div>
            </div>

            <div class="exec-nav">
              <button class="exec-nav__btn" onclick="switchExecutive(-1)">‹</button>
              <button class="exec-nav__btn" onclick="switchExecutive(1)">›</button>
            </div>
        `,
  },
  join: {
    title: "הצטרפו אלינו",
    content: `
            <h2>הזדמנויות קריירה ושותפויות</h2>
            <p style="margin-bottom: 2rem;">אנחנו תמיד מחפשים אנשים מוכשרים להצטרף אלינו במגוון תפקידים ופרויקטים.</p>

            <div style="display: grid; gap: 1.5rem; margin-top: 2rem;">
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px;">
                    <h3>תחומי פעילות</h3>
                    <ul style="margin-top: 1rem; padding-right: 1rem;">
                        <li>יזמות נדל"ן</li>
                        <li>שיווק ומכירות</li>
                        <li>ניהול פרויקטים</li>
                        <li>ייעוץ פיננסי</li>
                    </ul>
                </div>

                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px;">
                    <h3>מועמד אידיאלי</h3>
                    <ul style="margin-top: 1rem; padding-right: 1rem;">
                        <li>בן אדם עצמאי עם חוש עסקי</li>
                        <li>יכולת לקחת פרויקט ולהוביל אותו להצלחה</li>
                        <li>נכונות לעבוד בצוות דינמי ומאתגר</li>
                        <li>ניסיון בתחום מקנה יתרון משמעותי</li>
                    </ul>
                </div>
            </div>

<div style="text-align: center; margin-top: 2rem;"> <button class="cta-button contact" data-modal="contact" type="button" style="background: var(--primary-color); color: var(--text-light); border: 2px solid var(--primary-color); padding: 1rem 2rem; border-radius: 25px; cursor: pointer; margin: 0.5rem;">צור קשר</button> </div>
        `,
  },
  knowledge: {
    title: 'רגע של נדל"ן',
    content: `
            <h2>מאגר הידע והמדריכים שלנו</h2>
            <p style="margin-bottom: 2rem;">כל מה שרציתם לדעת על נדל"ן במקום אחד.</p>

            <div style="display: grid; gap: 1rem; margin-top: 2rem;">
                <div style="border: 1px solid #eee; padding: 1rem; border-radius: 10px; cursor: pointer;" onclick="this.style.background='#f8f9fa'">
                    <h3><i class="fas fa-calculator" style="margin-left: 0.5rem; color: var(--primary-color);"></i>מיסוי נדל"ן</h3>
                    <p>הכל על מיסוי בעולם הנדל"ן</p>
                </div>

                <div style="border: 1px solid #eee; padding: 1rem; border-radius: 10px; cursor: pointer;" onclick="this.style.background='#f8f9fa'">
                    <h3><i class="fas fa-map" style="margin-left: 0.5rem; color: var(--primary-color);"></i>מקרקעין ותכנון</h3>
                    <p>מדריך למקרקעין ותכנון עירוני</p>
                </div>

                <div style="border: 1px solid #eee; padding: 1rem; border-radius: 10px; cursor: pointer;" onclick="this.style.background='#f8f9fa'">
                    <h3><i class="fas fa-hammer" style="margin-left: 0.5rem; color: var(--primary-color);"></i>פינוי בינוי ותמ"א</h3>
                    <p>תקנות פינוי בינוי ותמ"א</p>
                </div>

                <div style="border: 1px solid #eee; padding: 1rem; border-radius: 10px; cursor: pointer;" onclick="this.style.background='#f8f9fa'">
                    <h3><i class="fas fa-handshake" style="margin-left: 0.5rem; color: var(--primary-color);"></i>עסקאות קומבינציה</h3>
                    <p>מה זה עסקאות קומבינציה וכיצד הן פועלות</p>
                </div>

                <div style="border: 1px solid #eee; padding: 1rem; border-radius: 10px; cursor: pointer;" onclick="this.style.background='#f8f9fa'">
                    <h3><i class="fas fa-chart-line" style="margin-left: 0.5rem; color: var(--primary-color);"></i>ניתוחי שווקים</h3>
                    <p>ניתוחים מקצועיים של שוק הנדל"ן</p>
                </div>

                <div style="border: 1px solid #eee; padding: 1rem; border-radius: 10px; cursor: pointer;" onclick="this.style.background='#f8f9fa'">
                    <h3><i class="fas fa-lightbulb" style="margin-left: 0.5rem; color: var(--primary-color);"></i>קבלת החלטות בנדל"ן</h3>
                    <p>כלים לקבלת החלטות חכמות בנדל"ן</p>
                </div>
            </div>
        `,
  },
  picks: {
    title: "הנבחרים שלנו",
    content: `
            <h2>פרויקטים ונכסי יוקרה נבחרים</h2>
            <p style="margin-bottom: 2rem;">הזדמנויות מיוחדות שאנחנו ממליצים עליהן במיוחד.</p>

            <div style="display: grid; gap: 2rem; margin-top: 2rem;">
                <div style="border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
                    <div style="background: linear-gradient(45deg, #d4af37, #f39c12); height: 150px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-building" style="font-size: 3rem; color: white;"></i>
                    </div>
                    <div style="padding: 1.5rem;">
                        <h3>פרויקט יוקרה מיוחד</h3>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0;">תל אביב צפון</p>
                        <p style="font-size: 1.2rem; color: var(--primary-color); font-weight: 600;">החל מ-3,500,000 ₪</p>
                        <button style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 15px; cursor: pointer; margin-top: 1rem;">פרטים נוספ, ם</button>
                    </div>
                </div>

                <div style="border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
                    <div style="background: linear-gradient(45deg, #667eea, #764ba2); height: 150px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-home" style="font-size: 3rem; color: white;"></i>
                    </div>
                    <div style="padding: 1.5rem;">
                        <h3>דירת גן מעוצבת</h3>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0;">רמת אביב</p>
                        <p style="font-size: 1.2rem; color: var(--primary-color); font-weight: 600;">2,800,000 ₪</p>
                        <button style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 15px; cursor: pointer; margin-top: 1rem;">פרטים נוספים</button>
                    </div>
                </div>
            </div>

            <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary); font-style: italic;">
                הנכסים מתעדכנים יום-יומיים
            </p>
        `,
  },
  assets: {
    title: "נכסים",
    content: `
            <h2>מנוע חיפוש עם קטגוריות משלנו</h2>
            <p style="margin-bottom: 2rem;">חפשו ומצאו את הנכס המושלם עבורכם.</p>
            <div style="margin: 2rem 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">

<select id="assetTypeSelect" style="padding:0.75rem;border:1px solid #ddd;border-radius:8px;color:#333;background:#fff;">

         <option value="">סוג נכס</option>
         <option value="דירה">דירה</option>
         <option value="דירת גן">דירת גן</option>
         <option value="פנטהאוז">פנטהאוז</option>
         <option value="בית פרטי">בית פרטי</option>
                    </select>
<select id="assetAreaSelect" style="padding:0.75rem;border:1px solid #ddd;border-radius:8px;color:#333;background:#fff;">

        <option value="">אזור</option>
         <option value="תל אביב">תל אביב</option>
         <option value="רמת גן">רמת גן</option>
         <option value="גבעתיים">גבעתיים</option>

                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
       <input id="minPriceInput" type="number" placeholder="מחיר מינימלי" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">
       <input id="maxPriceInput" type="number" placeholder="מחיר מקסימלי" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">
                </div>

     <button id="assetsSearchBtn" style="background: var(--primary-color); color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; width: 100%;">חפש נכסים</button>

            </div>
 <div id="assetsResults" style="margin-top: 2rem;"></div>
        `,
  },
  projects: {
    title: "פרויקטים",
    content: `
        <h2>פרויקטי פיתוח והשקעה</h2>
        <p style="margin-bottom: 2rem;">הפרויקטים המובילים שלנו בגבעתיים והסביבה</p>

        <style>
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }

          .project-card {
            position: relative;
            overflow: hidden;
            border-radius: 20px;
            cursor: pointer;
            aspect-ratio: 4 / 3;
          }

          .project-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
            display: block;
            z-index: 0;
          }

          .project-card:hover img {
            transform: scale(1.05);
          }

          .project-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 2;
            padding: 1rem;
            text-align: center;
          }

        /* שכבת כהות בפרויקטים רגילים – רק בהובר */
        .project-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          z-index: 1;
          transition: background 0.3s ease;
        }

        /* רק כשמזיזים עכבר, השכבה תופיע */
        .project-card:hover::before {
          background: rgba(0, 0, 0, 0.25);
        }


          .project-card:hover .project-overlay {
            opacity: 1;
            background: rgba(0, 0, 0, 0.25);
          }

          .project-overlay.show-always {
              opacity: 1;
              background: rgba(0, 0, 0, 0.5);
        }

          .project-sold::after {
            content: "נמכר";
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: white;
            color: black;
            padding: 0.3rem 0.8rem;
            font-weight: bold;
            border-radius: 30px;
            z-index: 3;
          }

          .project-sold::before {
              content: "";
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.25);
              z-index: 1;
            }


          @media (max-width: 900px) {
            .projects-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <div class="projects-grid">
          <!-- Sold Projects -->
          <a class="project-card project-sold">
            <img src="firm_projects/hamaayan_7_givatayim.png" alt="המעיין 7, גבעתיים" />
            <div class="project-overlay show-always">המעיין 7, גבעתיים</div>
          </a>

          <a class="project-card project-sold">
            <img src="firm_projects/yitzchak_sade_3_givatayim.jpg" alt="יצחק שדה 3, גבעתיים" />
            <div class="project-overlay show-always">יצחק שדה 3, גבעתיים</div>
          </a>

  <!-- Active Projects -->
            <a class="project-card">
              <img src="firm_projects/golomb_54_givatayim.jpeg" alt="גולומב 54, גבעתיים" />
              <div class="project-overlay">גולומב 54, גבעתיים</div>
            </a>

          <a class="project-card">
            <img src="firm_projects/yitzchak_sade_5_givatayim.jpg" alt="יצחק שדה 5, גבעתיים" />
            <div class="project-overlay">יצחק שדה 5, גבעתיים</div>
          </a>

          <a class="project-card">
            <img src="firm_projects/zabo_37_givatayim.jpg" alt="ז'בוטינסקי 37, גבעתיים" />
            <div class="project-overlay">ז'בוטינסקי 37, גבעתיים</div>
          </a>

          <a class="project-card">
            <img src="firm_projects/reines_23_givatayim.jpg" alt="ריינס 23, גבעתיים" />
            <div class="project-overlay">ריינס 23, גבעתיים</div>
          </a>

            <a class="project-card">
              <img src="firm_projects/yitzchak_sade_7_givatayim.jpg" alt="יצחק שדה 7, גבעתיים" />
              <div class="project-overlay">יצחק שדה 7, גבעתיים</div>
            </a>

              <a class="project-card">
                <img src="firm_projects/berdiv_37_givatayim.jpg" alt="ברדיצ'בסקי 37, גבעתיים" />
                <div class="project-overlay">ברדיצ'בסקי 37, גבעתיים</div>
              </a>

        </div>
      `,
  },
  terms: {
    title: "תנאי שימוש",
    content: `
               <h2 style="margin-bottom: 1rem;">תנאי שימוש</h2>
               <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                 השימוש באתר דור נכסים כפוף לתנאים שלהלן ומהווה הסכמה להם. אם אינך מסכים, אנא הימנע משימוש באתר.
               </p>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">תוכן ושירותים באתר</h3>
                 <p>
                   האתר מציג מידע על נכסים, פרויקטים ושירותים. חלק מהמידע מתקבל מצדדים שלישיים.
                   ייתכנו שגיאות, ליקויים או אי התאמות, והמידע עשוי להתעדכן מעת לעת.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">אין בהצגה באתר הצעה מחייבת</h3>
                 <p>
                   פרסום נכס באתר אינו מהווה הצעה או התחייבות. כל עסקה תיעשה על פי הסכמים בכתב בלבד
                   ותותנה בקבלת אישורים והצהרות כנדרש בדין.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">שימוש מותר וקניין רוחני</h3>
                 <p>
                   שימוש אישי בלבד. אין להעתיק, לשכפל, להפיץ או לפרסם תכנים ללא אישור בכתב.
                   כל זכויות הקניין הרוחני באתר שייכות לחברה או למורשים מטעמה.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">פטור והגבלת אחריות</h3>
                 <p>
                   התוכן ניתן כמות שהוא. החברה אינה אחראית לנזקים ישירים או עקיפים הנובעים משימוש באתר או מהסתמכות על המידע.
                   מבלי לגרוע, אחריות החברה בכל מקרה תוגבל לסכום ששולם בפועל בעבור השירות שבמחלוקת, אם שולם.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">התנהלות משתמשים</h3>
                 <p>
                   חל איסור לבצע פעולות העלולות לפגוע בפעילות האתר, לרבות סריקה אוטומטית, חדירה למידע או עקיפת מנגנוני אבטחה.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">קישורים לצד שלישי</h3>
                 <p>
                   האתר עשוי לכלול קישורים לאתרים חיצוניים. החברה אינה אחראית לתוכנם או למדיניותם.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">שינויים בתנאים</h3>
                 <p>
                   החברה רשאית לעדכן את תנאי השימוש בכל עת. תוקף העדכון ממועד פרסומו באתר.
                 </p>
               </div>

               <div style="margin: 1.25rem 0;">
                 <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">פתרון מחלוקות וסמכות שיפוט</h3>
                 <p>
                   הדין החל הוא הדין הישראלי. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב–יפו.
                 </p>
               </div>

               <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                 עודכן לאחרונה: <span id="terms-updated">__ / __ / ____</span>
               </p>
             `,
  },
  privacy: {
    title: "מדיניות פרטיות",
    content: `
                     <h2 style="margin-bottom: 1rem;">מדיניות פרטיות</h2>
                     <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                       מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ושומרים מידע אישי באתר. השימוש באתר מהווה הסכמה למדיניות.
                     </p>

                     <div style="margin: 1.25rem 0;">
                       <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">איסוף מידע</h3>
                       <p>
                         אנו עשויים לאסוף מידע שמוסר המשתמש מרצונו, כגון שם, טלפון ודוא"ל, וכן מידע טכני הנאסף אוטומטית,
                         כגון כתובת IP, סוג דפדפן ונתוני שימוש.
                       </p>
                     </div>

                     <div style="margin: 1.25rem 0;">
                       <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">שימוש במידע</h3>
                       <p>
                         מתן שירות, יצירת קשר, שיפור חוויית משתמש והתאמת הצעות. העברת מידע לצד שלישי תיעשה רק אם נדרש על פי דין,
                         בהסכמת המשתמש או לצורך אספקת השירותים מטעמנו.
                       </p>
                     </div>

<div style="margin: 1.25rem 0;">
  <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">Cookies</h3>
  <p>
    האתר של דור נכסים משתמש בקובצי Cookies לשיפור חוויית המשתמש, להתאמת תכנים ושירותים, למדידת שימוש וסטטיסטיקה, ולהצגת פרסומות ומסרים שיווקיים אישיים. Cookies הם קובצי טקסט קטנים הנשמרים במכשירך באמצעות הדפדפן: חלקם זמניים ונמחקים עם סגירת הדפדפן, וחלקם נשמרים לפרק זמן קצוב או עד למחיקה יזומה. עשוי להיעשות שימוש גם בקובצי Cookies של צדדים שלישיים, כגון כלי אנליטיקה וספקי פרסום, בכפוף להגדרותיך. באפשרותך לנהל או לחסום Cookies דרך הגדרות הדפדפן. חסימה מלאה או חלקית עלולה לפגוע בפעולת האתר ובחוויית השימוש.
  </p>
</div>

                     <div style="margin: 1.25rem 0;">
                       <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">אבטחת מידע ושמירה</h3>
                       <p>
                         אנו נוקטים אמצעים סבירים כדי להגן על המידע מפני גישה ושימוש בלתי מורשים. אין אפשרות להבטיח אבטחה מוחלטת.
                         נשמור מידע כל עוד הוא נחוץ למטרות המתוארות או לפי דרישת הדין.
                       </p>
                     </div>

                     <div style="margin: 1.25rem 0;">
                       <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">זכויות משתמש</h3>
                       <p>
                         זכות לעיין במידע, לבקש תיקון או מחיקה, בכפוף לדין. בקשות ניתן לשלוח לכתובת הדוא"ל שלהלן.
                       </p>
                     </div>

                     <div style="margin: 1.25rem 0;">
                       <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">העברה מחוץ לישראל</h3>
                       <p>
                         אם יועבר מידע אל מחוץ לישראל, נעשה זאת לפי הוראות הדין ובהגנות מתאימות לרבות הסכמים מחייבים.
                       </p>
                     </div>

                     <div style="margin: 1.25rem 0;">
                       <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">עדכונים ומחלוקות</h3>
                       <p>
                         אנו רשאים לעדכן מדיניות זו מעת לעת. תוקף העדכון ממועד פרסומו.
                         על מחלוקת יחול הדין הישראלי וסמכות השיפוט תהיה לבתי המשפט במחוז תל אביב–יפו.
                       </p>
                     </div>

                     <div style="background:#f8f9fa; border:1px solid #eee; border-radius:10px; padding: .75rem 1rem; margin-top: 1rem;">
                       <p style="margin: .25rem 0;"><strong>כתובת לפניות פרטיות:</strong> privacy@dorealestate.com</p>
                       <p style="margin: .25rem 0;"><strong>טלפון:</strong> 050-5534488</p>
                       <p style="margin: .25rem 0;"><strong>מענה:</strong> א'–ה', 9:00–17:00</p>
                     </div>

                     <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                       עודכן לאחרונה: <span id="privacy-updated">__ / __ / ____</span>
                     </p>
                   `,
  },
  accessibility: {
    title: "הסדרי נגישות",
    content: `
                       <h2 style="margin-bottom: 1rem;">הצהרת נגישות</h2>
                       <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                         אנו פועלים לאפשר שירות שוויוני ונגיש לכל לקוחותינו, באתר ובמשרדינו, בהתאם לדין ולתקנים הרלוונטיים.
                       </p>

                       <div style="margin: 1.25rem 0;">
                         <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">התאמות נגישות באתר</h3>
                         <ul style="margin: .5rem 0 0; padding-right: 1rem; line-height: 1.8;">
                           <li>אפשרות להגדלת והקטנת טקסט</li>
                           <li>תמיכה בתוכנות קוראות מסך</li>
                           <li>ניווט מלא באמצעות מקלדת</li>
                           <li>ניגודיות צבעים משופרת</li>
                           <li>טקסט חלופי לתמונות ותוויות לטפסים</li>
                         </ul>
                       </div>

                       <div style="margin: 1.25rem 0;">
                         <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">נגישות בסניף</h3>
                         <p>
                           בכפוף למגבלות פיזיות של הבניין, אנו פועלים לספק גישה נגישה, עמדות שירות מותאמות וסיוע אנושי לפי צורך.
                         </p>
                       </div>

                       <div style="margin: 1.25rem 0;">
                         <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">פנייה בנושא נגישות</h3>
                         <p>נשמח לקבל משוב והצעות לשיפור.</p>
                         <div style="background:#f8f9fa; border:1px solid #eee; border-radius:10px; padding: .75rem 1rem; margin-top: 1rem;">
                           <p style="margin: .25rem 0;"><strong>ממונה נגישות:</strong> ________</p>
                           <p style="margin: .25rem 0;"><strong>טלפון:</strong> 050-5534488</p>
                           <p style="margin: .25rem 0;"><strong>דוא"ל:</strong> accessibility@dorealestate.com</p>
                           <p style="margin: .25rem 0;"><strong>ימי מענה:</strong> א'–ה', 9:00–17:00</p>
                         </div>
                       </div>

                       <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                         עודכן לאחרונה: <span id="accessibility-updated">__ / __ / ____</span>
                       </p>
                     `,
  },
  ethics: {
    title: "כללי אתיקה",
    content: `
                <h2 style="margin-bottom: 1rem;">כללי אתיקה</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                  דור נכסים מחויבת לפעול ביושרה, בשקיפות ובכבוד כלפי לקוחות, שותפים, ספקים ועובדים.
                  כללי האתיקה שלהלן מנחים את פעילותנו בכל הקשור להצגת מידע, מתן שירות וביצוע עסקאות נדל"ן.
                </p>

                <div style="margin: 1.5rem 0;">
                  <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">יושרה מקצועית</h3>
                  <p>הימנעות מהטעיה, מצג שווא וניגוד עניינים. החלטות מקצועיות יתקבלו מתוך שיקול דעת ענייני בלבד.</p>
                </div>

                <div style="margin: 1.5rem 0;">
                  <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">שקיפות והוגנות</h3>
                  <p>מסירת מידע מהותי, נכון וברור לגבי נכסים, מחירים, תנאים וסיכונים. הסבר הוגן של חלופות ללקוח.</p>
                </div>

                <div style="margin: 1.5rem 0;">
                  <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">שמירה על סודיות</h3>
                  <p>הגנה על מידע אישי ועסקי שנמסר לחברה ושימוש בו רק למטרות שלשמן נמסר, בהתאם לחוק.</p>
                </div>

                <div style="margin: 1.5rem 0;">
                  <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">ציות לדין</h3>
                  <p>עמידה בהוראות הדין החלות, כולל חוק הגנת הפרטיות, חוק הגנת הצרכן וחוק המתווכים במקרקעין.</p>
                </div>

                <div style="margin: 1.5rem 0;">
                  <h3 style="margin-bottom: .5rem; color: var(--text-secondary);">אחריות חברתית</h3>
                  <p>טיפוח תרבות שירות מכבדת ונגישה לכלל הציבור ותרומה לסביבה העסקית והקהילתית.</p>
                </div>

                <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                  עודכן לאחרונה: <span id="ethics-updated">__ / __ / ____</span>
                </p>
              `,
  },
};

function initializeOnboardingSteps() {
  onboardingSteps = [
    // 1) Intro Screen
    {
      type: "intro",
      title: "תכירו את הדרך החדשה למצוא בית",
      subtitle: "כמו טינדר, אבל לדירות. קליל, מהיר, כיפי.",
      content: `
        <div class="intro-screen" style="text-align:center; padding:2rem;">
          <img src="gen_pic/tinder_mock.png" alt="מסך דוגמה" style="max-width:280px; border-radius:20px; margin-bottom:1.5rem; box-shadow:0 8px 20px rgba(0,0,0,0.15);" />
          <h2 style="margin-bottom:1rem;">מצאו את הבית שלכם בהחלקה</h2>
          <p style="color:#666; margin-bottom:2rem;">נכסים שיתאימו בדיוק למה שאתם מחפשים</p>
          <button id="toRegistration" style="background:var(--primary-color); color:white; border:none; padding:1rem 2.5rem; border-radius:50px; cursor:pointer; font-size:1.1rem;">
            מתחילים עכשיו
          </button>
        </div>
      `,
    },

    // 2) Registration / Login (Firebase Phone)
    {
      type: "register",
      title: "הרשמה קצרה",
      subtitle: "פחות מדקה ואתם בפנים",
      content: `
            <div class="register-screen" style="padding:1rem;">
              <input id="fullName" type="text" placeholder="שם מלא" style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:12px; margin-bottom:1rem;" />
              <input id="phoneNumber" type="tel" placeholder="מספר טלפון" style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:12px; margin-bottom:1rem;" />

              <button id="sendCodeBtn" style="width:100%; background:var(--primary-color); color:white; border:none; padding:0.9rem; border-radius:30px; cursor:pointer; margin-bottom:1rem;">
                שלחו לי קוד אימות
              </button>

              <div id="smsStep" style="display:none;">
                <input id="smsCode" type="text" placeholder="הכניסו את הקוד שקיבלתם" style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:12px; margin-bottom:1rem;" />
                <button id="verifyCodeBtn" style="width:100%; background:green; color:white; border:none; padding:0.9rem; border-radius:30px; cursor:pointer;">
                  המשיכו
                </button>
              </div>

              <div id="recaptcha-container"></div>
            </div>
          `,
    },

    // 3) Micro Questionnaire (single screen)
    {
      type: "quick-qs",
      title: "שאלון קצר",
      subtitle: "כדי שנוכל להתאים לכם נכסים מדויקים",
      content: `
                <style>
                  /* layout: crisp 3-column on desktop, 1–2 on mobile */
                  .options-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 1rem;
                  }
                  @media (max-width: 900px) {
                    .options-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                  }
                  @media (max-width: 560px) {
                    .options-grid { grid-template-columns: 1fr; }
                  }

                  .option-card {
                    border: 2px solid #ead18f;
                    border-radius: 18px;
                    padding: 1rem 1.25rem;
                    background: #fff;
                    cursor: pointer;
                    transition: .2s ease;
                    box-shadow: 0 1px 0 rgba(0,0,0,.02);
                  }
                  .option-card:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,.06); }
                  .option-card.selected {
                    border-color: var(--primary-color);
                    background: #fff9e8;
                  }
                  .option-title { font-weight: 800; margin-bottom: .25rem; }
                  .option-description { color:#666; font-size:.95rem; }
                  .hint { color:#777; font-size:.9rem; margin:.25rem 0 1rem; }
                </style>

                <div class="question-container" dir="rtl">
                  <!-- Q1: Area -->
                  <h2 class="question-title">איפה תרצו לגור?</h2>
                  <div class="options-grid" data-group="area">
                    <div class="option-card" data-value="givatayim"><div class="option-title">גבעתיים</div></div>
                    <div class="option-card" data-value="ramat-gan"><div class="option-title">רמת גן</div></div>
                    <div class="option-card" data-value="tel-aviv"><div class="option-title">תל אביב</div></div>
                  </div>

                  <!-- Q2: Budget -->
                  <h2 class="question-title" style="margin-top:2rem;">מה התקציב?</h2>
                  <div class="options-grid" data-group="budget">
                    <div class="option-card" data-value="budget-low"><div class="option-title">עד 2 מ׳ ₪</div></div>
                    <div class="option-card" data-value="budget-mid"><div class="option-title">2–4 מ׳ ₪</div></div>
                    <div class="option-card" data-value="budget-high"><div class="option-title">מעל 4 מ׳ ₪</div></div>
                  </div>

                  <!-- Q3: Rooms -->
                  <h2 class="question-title" style="margin-top:2rem;">כמה חדרים יתאים לכם?</h2>
                  <div class="options-grid" data-group="rooms">
                    <!-- We store the minimum rooms as a number in data-value -->
                    <div class="option-card" data-value="3">
                      <div class="option-title">2–3 חדרים</div>
                      <div class="option-description">קומפקטי ונוח</div>
                    </div>
                    <div class="option-card" data-value="4">
                      <div class="option-title">4 חדרים</div>
                      <div class="option-description">משפחתי קלאסי</div>
                    </div>
                    <div class="option-card" data-value="5">
                      <div class="option-title">5+ חדרים</div>
                      <div class="option-description">מרווח במיוחד</div>
                    </div>
                  </div>

                  <!-- Q4: Type -->
                  <h2 class="question-title" style="margin-top:2rem;">איזה סוג נכס מדבר אליכם?</h2>
                  <div class="options-grid" data-group="type">
                    <!-- Store slugs that match the DB directly -->
                    <div class="option-card" data-value="apartment"><div class="option-title">דירה בבניין</div></div>
                    <div class="option-card" data-value="garden_apartment"><div class="option-title">דירת גן</div></div>
                    <div class="option-card" data-value="penthouse"><div class="option-title">פנטהאוז</div></div>
                    <div class="option-card" data-value="townhouse"><div class="option-title">בית פרטי</div></div>
                  </div>
                </div>

                <div style="text-align:center; margin-top:2rem;">
                  <button id="toSwiping" style="background:var(--primary-color); color:white; border:none; padding:1rem 3rem; border-radius:50px; font-size:1.1rem; cursor:pointer;">
                    מצאו את הבית שלכם
                  </button>
                </div>
                `,
    },
  ];
}

function goToStepType(type) {
  const i = onboardingSteps.findIndex((s) => s.type === type);
  if (i === -1) return;
  currentStep = i;
  loadStep(currentStep);
}

function hasAuth() {
  return !!(userData && userData.auth && userData.auth.uid);
}

// TAKING CARE OF SWITCHING BETWEEN EXECUTIVES

let currentExecutive = 0;

function updateExecutiveCarousel() {
  const slides = document.querySelectorAll(".executive-slide");
  const totalExecutives = slides.length;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentExecutive);
  });

  const counter = document.getElementById("executive-counter");
  if (counter)
    counter.textContent = `${currentExecutive + 1}/${totalExecutives}`;

  const progress = document.getElementById("progress-bar");
  if (progress) {
    const percent = ((currentExecutive + 1) / totalExecutives) * 100;
    progress.style.width = `${percent}%`;
  }
}

function switchExecutive(direction) {
  const slides = document.querySelectorAll(".executive-slide");
  currentExecutive =
    (currentExecutive + direction + slides.length) % slides.length;
  updateExecutiveCarousel();
}

document.addEventListener("DOMContentLoaded", () => {
  updateExecutiveCarousel();
});

// END OF SWITCHING BETWEEN EXECUTIVES

// Event Listeners

function initializeEventListeners() {
  // Modal triggers
  document.querySelectorAll("[data-modal]").forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      const modalType = this.getAttribute("data-modal");
      openModal(modalType);
    });
  });

  // Modal close
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // מאזין כולל לכל הכפתורים שמתחילים מסע, גם בדף וגם בתוך מודלים
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(
      "#startJourney, .start-journey, [data-start-journey]",
    );
    if (!btn) return;

    // סוגרים מודל אם פתוח
    if (modalOverlay.classList.contains("active")) {
      closeModal();
    }

    // מפעילים את האונבורדינג
    startOnboarding();
  });

  // Onboarding
  startJourneyBtn.addEventListener("click", startOnboarding);
  onboardingClose.addEventListener("click", closeOnboarding);
  prevBtn.addEventListener("click", previousStep);
  nextBtn.addEventListener("click", nextStep);

  // Escape key handling
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      closeOnboarding();
    }
  });
}

function initContactForm(scope = document) {
  const form = scope.querySelector("#contactForm");
  if (!form) return;

  form.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();

      const name = scope.querySelector("#contactName")?.value.trim() || "";
      const email = scope.querySelector("#contactEmail")?.value.trim() || "";
      const msg = scope.querySelector("#contactMsg")?.value.trim() || "";

      if (!name || !email || !msg) {
        alert("אנא מלאו שם, אימייל והודעה.");
        return;
      }

      // --- OPTION A (no backend): open a mailto with the message ---
      const subject = `פנייה מהאתר`;
      const body = `${msg}\n\nשם: ${name}\nאימייל: ${email}`;
      window.location.href = `mailto:inquiries@dorealestate.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // UX
      showToast("✅ תודה! קיבלנו את פנייתכם וניצור קשר בהקדם.", "success");
      closeModal();
      setTimeout(() => {
        window.location.href = "/";
      }, 300);

      // --- OPTION B (if you have an endpoint) ---
      // fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, msg })
      // }).then(() => { alert('תודה!'); closeModal(); })
      //   .catch(() => alert('חלה שגיאה בשליחה, נסו שוב.'));
    },
    { once: true },
  ); // avoid duplicate bindings on re-open
}

// Modal Functions
function openModal(type) {
  const content = modalContents[type];
  if (content) {
    modalContent.innerHTML = content.content;
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // (re)bind inside the modal
    initContactForm(modalContent); // <— add this

    modalContent.querySelectorAll("[data-modal]").forEach((trigger) => {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        const modalType = this.getAttribute("data-modal");
        openModal(modalType);
      });
    });
  }

  if (type === "assets") {
    try {
      initAssetsModal(modalContent);
    } catch (e) {
      console.warn(e);
    }
  }

  if (
    type === "team" ||
    type === "join" ||
    type === "knowledge" ||
    type === "picks" ||
    type === "assets" ||
    type === "projects" ||
    type === "about" ||
    type === "services" ||
    type === "contact" ||
    type === "accessibility" ||
    type === "privacy" ||
    type === "ethics" ||
    type === "terms"
  ) {
    if (type === "about") {
      try {
        initAboutTimeline();
      } catch (_) {}
    }
    if (type === "services") {
      try {
        initServicesTimeline();
      } catch (_) {}
    }
    const contactFixed = document.querySelector(".contact-fixed");
    if (contactFixed) contactFixed.style.display = "none";
  }
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = ""; // instead of "hidden"
  const contactFixed = document.querySelector(".contact-fixed");
  if (contactFixed) contactFixed.style.display = "block";
}

// Onboarding Functions
function startOnboarding() {
  currentStep = 0;
  userData = {};
  if (swipeInterface) swipeInterface.style.display = "none"; // <—
  onboardingOverlay.style.display = "flex";
  setTimeout(() => {
    onboardingOverlay.classList.add("active");
    loadStep(currentStep);
  }, 10);
}

let lastStepType = null;

function teardownRecaptcha() {
  if (window.recaptchaVerifier?.clear) {
    try {
      window.recaptchaVerifier.clear();
    } catch {}
  }
  window.recaptchaVerifier = null;
  recaptchaWidgetId = null;
}

function closeOnboarding() {
  teardownRecaptcha();
  onboardingOverlay.classList.remove("active");
  setTimeout(() => {
    onboardingOverlay.style.display = "none";
  }, 300);
}

function loadStep(stepIndex) {
  const step = onboardingSteps[stepIndex];
  if (!step) return;

  // If we're leaving register, tear down the old widget
  if (lastStepType === "register" && step.type !== "register") {
    teardownRecaptcha();
  }

  // Inject new DOM
  onboardingContent.innerHTML = step.content;
  lastStepType = step.type;

  // Progress logic
  if (step.type === "intro") {
    progressFill.style.width = "0%";
    progressText.textContent = "";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else if (step.type === "register") {
    progressFill.style.width = "50%";
    progressText.textContent = `שלב 1 מתוך 2`;
    prevBtn.style.display = "flex";
    nextBtn.style.display = "none"; // advance via verify
    // init phone auth after DOM is injected
    setupPhoneAuth();
  } else if (step.type === "quick-qs") {
    progressFill.style.width = "100%";
    progressText.textContent = `שלב 2 מתוך 2`;
    prevBtn.style.display = "none"; // hide back on quick-qs
    nextBtn.style.display = "none"; // advance via button
  } else {
    // fallback
    const progress = ((stepIndex + 1) / onboardingSteps.length) * 100;
    progressFill.style.width = progress + "%";
    progressText.textContent = `שלב ${stepIndex + 1} מתוך ${onboardingSteps.length}`;
    prevBtn.style.display = stepIndex > 0 ? "flex" : "none";
    nextBtn.innerHTML = 'הבא <i class="fas fa-arrow-left"></i>';
    nextBtn.style.display = "flex";
  }

  // Bind inline actions after DOM is ready
  setTimeout(() => {
    addOptionListeners();

    const regBtn = document.getElementById("toRegistration");
    if (regBtn)
      regBtn.addEventListener("click", () => goToStepType("register"));

    const swipeBtn = document.getElementById("toSwiping");
    if (swipeBtn) {
      swipeBtn.addEventListener("click", () => {
        if (!hasAuth()) {
          alert("לפני שממשיכים, נא לאמת מספר טלפון 🙂");
          return goToStepType("register");
        }
        saveStepData();
        closeOnboarding();
        setTimeout(() => startPropertySwiping(), 300);
      });
    }
  }, 50);
}

function addOptionListeners() {
  const optionCards = document.querySelectorAll(".option-card");

  optionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const grid = this.closest(".options-grid");
      const isMultiple = grid?.dataset.multiple === "true";
      const groupCards = grid ? grid.querySelectorAll(".option-card") : [];

      if (isMultiple) {
        this.classList.toggle("selected");
      } else {
        groupCards.forEach((c) => c.classList.remove("selected"));
        this.classList.add("selected");
      }
    });
  });

  // Keep your “start swiping” handlers:
  const startSwipingBtn = document.getElementById("startSwiping");
  if (startSwipingBtn)
    startSwipingBtn.addEventListener("click", () => {
      closeOnboarding();
      setTimeout(() => startPropertySwiping(), 300);
    });

  const toSwipingBtn = document.getElementById("toSwiping");
  if (toSwipingBtn)
    toSwipingBtn.addEventListener("click", () => {
      saveStepData();
      closeOnboarding();
      setTimeout(() => startPropertySwiping(), 300);
    });
}

function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    loadStep(currentStep);
  }
}

function nextStep() {
  saveStepData();
  const next = currentStep + 1;
  const nextType = onboardingSteps[next]?.type;
  if (nextType === "quick-qs" && !hasAuth()) {
    alert("נא לאמת מספר טלפון לפני שממשיכים.");
    return goToStepType("register");
  }
  if (currentStep < onboardingSteps.length - 1) {
    currentStep = next;
    loadStep(currentStep);
  } else {
    closeOnboarding();
    setTimeout(() => startPropertySwiping(), 300);
  }
}

function saveStepData() {
  const stepType = onboardingSteps[currentStep].type;

  if (stepType === "quick-qs") {
    const data = {};
    document.querySelectorAll(".options-grid[data-group]").forEach((grid) => {
      const group = grid.getAttribute("data-group");
      const multi = grid.getAttribute("data-multiple") === "true";
      if (multi) {
        data[group] = Array.from(
          grid.querySelectorAll(".option-card.selected"),
        ).map((el) => el.getAttribute("data-value"));
      } else {
        const sel = grid.querySelector(".option-card.selected");
        if (sel) data[group] = sel.getAttribute("data-value");
      }
    });
    userData["quickQs"] = data; // e.g.{ persona, budget, cities: [...], urgency }
    saveUserData();
    return;
  }

  // default (single screen selections without groups)
  const selectedOptions = document.querySelectorAll(".option-card.selected");
  if (selectedOptions.length > 0) {
    if (
      selectedOptions.length === 1 &&
      selectedOptions[0].getAttribute("data-multiple") !== "true"
    ) {
      userData[stepType] = selectedOptions[0].getAttribute("data-value");
    } else {
      userData[stepType] = Array.from(selectedOptions).map((option) =>
        option.getAttribute("data-value"),
      );
    }
    saveUserData();
  }
}

// Utility Functions
function saveUserData() {
  localStorage.setItem("dorRealEstate_userData", JSON.stringify(userData));
}

function loadUserData() {
  const saved = localStorage.getItem("dorRealEstate_userData");
  if (saved) {
    userData = JSON.parse(saved);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  try {
    initAccessibilityToolbar(); // סרגל נגישות
  } catch (e) {
    /* no-op */
  }

  loadUserData(); // הלוקל-סטורג'
  initializeOnboardingSteps(); // סטפים
  initializeEventListeners(); // מודלים, אונבורדינג וכו'
  updateExecutiveCarousel(); // הקרוסלה של ההנהלה
  setupSubmenus(); // הפונקציה החדשה לתפריטים
});

function setupSubmenus() {
  const toggles = document.querySelectorAll(".main-nav .has-submenu > a");

  function closeAll() {
    document
      .querySelectorAll(".main-nav .has-submenu.open")
      .forEach((li) => li.classList.remove("open"));
  }

  toggles.forEach((a) => {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const li = a.parentElement;
      const wasOpen = li.classList.contains("open");
      closeAll();
      if (!wasOpen) li.classList.add("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".main-nav")) closeAll();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });
}

// === Accessibility Toolbar (A11Y) ===
function initAccessibilityToolbar() {
  const toolbar = document.getElementById("a11y-toolbar");
  if (!toolbar) return; // אין טולבר בדף

  const btnToggle = document.getElementById("a11y-toggle-btn");
  const panel = document.getElementById("a11y-panel");
  const links = () => Array.from(panel.querySelectorAll(".a11y-link"));
  const body = document.body;
  const root = document.documentElement; // עובדים על html
  const STORAGE_KEY = "a11y-state-v1";

  const FONT_STEPS = [
    "a11y-font-120",
    "a11y-font-130",
    "a11y-font-140",
    "a11y-font-150",
    "a11y-font-160",
    "a11y-font-170",
    "a11y-font-180",
    "a11y-font-190",
    "a11y-font-200",
  ];
  let fontIndex = 0; // 0 ללא שינוי

  function openPanel() {
    toolbar.classList.add("a11y-open");
    panel.hidden = false;
    btnToggle.setAttribute("aria-expanded", "true");
    links().forEach((b) => b.setAttribute("tabindex", "0"));
  }

  function closePanel() {
    toolbar.classList.remove("a11y-open");
    panel.hidden = true;
    btnToggle.setAttribute("aria-expanded", "false");
    links().forEach((b) => b.setAttribute("tabindex", "-1"));
  }

  function togglePanel() {
    toolbar.classList.contains("a11y-open") ? closePanel() : openPanel();
  }

  btnToggle.addEventListener("click", (e) => {
    e.preventDefault();
    togglePanel();
  });
  btnToggle.addEventListener("keyup", (e) => {
    if (e.key === "Tab") openPanel();
  });

  function clearFontClasses() {
    FONT_STEPS.forEach((c) => root.classList.remove(c));
  }
  function applyFont() {
    clearFontClasses();
    if (fontIndex > 0) root.classList.add(FONT_STEPS[fontIndex - 1]);
  }
  function setToggleClass(cls) {
    body.classList.toggle(cls);
  }
  function resetAll() {
    [
      "a11y-grayscale",
      "a11y-high-contrast",
      "a11y-negative",
      "a11y-light-bg",
      "a11y-underline",
      "a11y-readable",
    ].forEach((c) => body.classList.remove(c));
    clearFontClasses();
    fontIndex = 0;
    saveState();
  }

  function saveState() {
    const state = {
      fontIndex,
      classes: [
        "a11y-grayscale",
        "a11y-high-contrast",
        "a11y-negative",
        "a11y-light-bg",
        "a11y-underline",
        "a11y-readable",
      ].filter((c) => body.classList.contains(c)),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function restoreState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      fontIndex = Math.min(
        Math.max(Number(s.fontIndex || 0), 0),
        FONT_STEPS.length,
      );
      applyFont();
      (s.classes || []).forEach((c) => body.classList.add(c));
    } catch {}
  }

  panel.addEventListener("click", (e) => {
    const el = e.target.closest("button[data-action]");
    if (!el) return;
    const action = el.getAttribute("data-action");
    switch (action) {
      case "font-plus":
        fontIndex = Math.min(fontIndex + 1, FONT_STEPS.length);
        applyFont();
        break;
      case "font-minus":
        fontIndex = Math.max(fontIndex - 1, 0);
        applyFont();
        break;
      case "grayscale":
        setToggleClass("a11y-grayscale");
        break;
      case "high-contrast":
        setToggleClass("a11y-high-contrast");
        break;
      case "negative":
        setToggleClass("a11y-negative");
        break;
      case "light-bg":
        setToggleClass("a11y-light-bg");
        break;
      case "underline":
        setToggleClass("a11y-underline");
        break;
      case "readable":
        setToggleClass("a11y-readable");
        break;
      case "reset":
        resetAll();
        break;
    }
    saveState();
  });

  // delegate clicks anywhere on the page
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-contact]");
    if (!btn) return;
    openModal("contact");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toolbar.classList.contains("a11y-open")) {
      closePanel();
      btnToggle.focus();
    }
  });

  // התחלה
  restoreState();
  if (panel.hidden) links().forEach((b) => b.setAttribute("tabindex", "-1"));
}

function initAboutTimeline() {
  const list = document.getElementById("aboutTlList");
  if (!list) return;

  const step = () => Math.round(list.clientWidth * 0.8);

  const rail = list.closest(".about-tl-rail");
  const btnPrev = rail.querySelector(".about-tl-nav.prev");
  const btnNext = rail.querySelector(".about-tl-nav.next");

  btnPrev.addEventListener("click", () =>
    list.scrollBy({ left: -step(), behavior: "smooth" }),
  );
  btnNext.addEventListener("click", () =>
    list.scrollBy({ left: step(), behavior: "smooth" }),
  );

  // מקשי מקלדת
  list.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")
      list.scrollBy({ left: step(), behavior: "smooth" });
    if (e.key === "ArrowRight")
      list.scrollBy({ left: -step(), behavior: "smooth" });
  });
}

function initServicesTimeline() {
  const rail = document.getElementById("servicesTlList");
  if (!rail) return;
  const wrap = rail.closest(".services-tl-rail");
  const prev = wrap.querySelector(".services-tl-nav.prev");
  const next = wrap.querySelector(".services-tl-nav.next");

  const itemWidth = () => {
    const it = rail.querySelector(".svc-item");
    const gap = parseFloat(
      getComputedStyle(rail).columnGap || getComputedStyle(rail).gap || 16,
    );
    return (it?.offsetWidth || 280) + gap;
  };

  const by = (dir) =>
    rail.scrollBy({ left: dir * itemWidth(), behavior: "smooth" });

  prev.addEventListener("click", () => by(-1));
  next.addEventListener("click", () => by(1));

  const updateBtns = () => {
    const max = rail.scrollWidth - rail.clientWidth - 1;
    prev.disabled = rail.scrollLeft <= 0;
    next.disabled = rail.scrollLeft >= max;
  };
  rail.addEventListener("scroll", updateBtns);
  window.addEventListener("resize", updateBtns);
  setTimeout(updateBtns, 0);

  // נגיעה/גרירה (נוח לנייד)
  let down = false,
    sx = 0,
    sl = 0;
  const start = (x) => {
    down = true;
    sx = x;
    sl = rail.scrollLeft;
  };
  const move = (x) => {
    if (down) rail.scrollLeft = sl - (x - sx);
  };
  const end = () => {
    down = false;
  };

  rail.addEventListener("mousedown", (e) => start(e.clientX));
  window.addEventListener("mousemove", (e) => move(e.clientX));
  window.addEventListener("mouseup", end);
  rail.addEventListener("touchstart", (e) => start(e.touches[0].clientX), {
    passive: true,
  });
  rail.addEventListener("touchmove", (e) => move(e.touches[0].clientX), {
    passive: true,
  });
  rail.addEventListener("touchend", end);
}

// One DB singleton for the whole app
window.__dorDB = window.__dorDB || new PropertyDatabase();

/** Map budget bucket to price range (NIS) */
function budgetBucketToRange(bucket) {
  switch (bucket) {
    case "budget-low":
      return { maxPrice: 2_000_000 };
    case "budget-mid":
      return { minPrice: 2_000_000, maxPrice: 4_000_000 };
    case "budget-high":
      return { minPrice: 4_000_000 };
    default:
      return {};
  }
}

/** Build DB filters from quick-qs (area, budget, rooms, type) */
function deriveSwipeFilters() {
  const q = (userData && userData.quickQs) || {};
  const f = { ...budgetBucketToRange(q.budget) }; // maps budget bucket → {minPrice,maxPrice}

  // Q1: area (single slug: 'givatayim' | 'ramat-gan' | 'tel-aviv')
  if (typeof q.area === "string" && q.area.trim()) f.area = q.area.trim();

  // Q3: rooms  → default behavior: "at least N"
  // If you kept data-value as "3" | "4" | "5", this means >= N rooms.
  if (q.rooms) {
    if (q.rooms === "3") {
      f.minRooms = 2;
      f.maxRooms = 3;
    } else if (q.rooms === "4") {
      f.minRooms = 4;
      f.maxRooms = 4;
    } else if (q.rooms === "5+") {
      f.minRooms = 5; /* no max */
    }
  }

  // Q4: type (slug: 'apartment' | 'garden_apartment' | 'penthouse' | 'villa')
  if (typeof q.type === "string" && q.type.trim()) f.type = q.type.trim();

  // Guard: if min>max for any reason, swap
  if (f.minPrice && f.maxPrice && f.minPrice > f.maxPrice) {
    const t = f.minPrice;
    f.minPrice = f.maxPrice;
    f.maxPrice = t;
  }

  return f;
}

// make inline HTML handlers work in module mode
window.switchExecutive = switchExecutive;
// bottom of script_fixed.js
// one global, no confusion
window.contactAdvisor = () => openModal("contact");

// Map Hebrew UI -> DB slugs
function hebTypeToSlug(t) {
  const map = {
    דירה: "apartment",
    "דירת גן": "garden_apartment",
    פנטהאוז: "penthouse",
    "בית פרטי": "townhouse",
  };
  return map[t] || "";
}

function hebAreaToSlug(a) {
  const map = {
    "תל אביב": "tel-aviv",
    "רמת גן": "ramat-gan",
    גבעתיים: "givatayim",
  };
  return map[a] || "";
}

function initAssetsModal(scope) {
  const typeSel = scope.querySelector("#assetTypeSelect");
  const areaSel = scope.querySelector("#assetAreaSelect");
  const minEl = scope.querySelector("#minPriceInput");
  const maxEl = scope.querySelector("#maxPriceInput");
  const btn = scope.querySelector("#assetsSearchBtn");
  const results = scope.querySelector("#assetsResults");
  if (!btn || !results) return;

  // singleton DB
  window.__dorDB = window.__dorDB || new PropertyDatabase();
  const db = window.__dorDB;

  function render(list) {
    if (!list || list.length === 0) {
      results.innerHTML = `
        <div style="text-align:center; color:var(--text-secondary); padding:1.5rem;">
          <i class="fas fa-search" style="font-size:2rem; opacity:.7;"></i>
          <div style="margin-top:.5rem;">לא נמצאו נכסים תואמים. נסו להרחיב את החיפוש.</div>
        </div>`;
      return;
    }
    results.innerHTML = `
      <div class="assets-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1rem;">
        ${list
          .map(
            (p) => `
          <article class="asset-card" style="border:1px solid #eee; border-radius:14px; overflow:hidden;">
            <div style="background:#f8f9fa; height:150px; display:flex; align-items:center; justify-content:center;">
              <i class="${p.image || "fas fa-building"}" style="font-size:2rem;"></i>
            </div>
            <div style="padding:1rem;">
              <h3 style="margin:0 0 .25rem 0; font-size:1.05rem;">${p.title || ""}</h3>
              <div style="color:var(--text-secondary); font-size:.95rem; margin-bottom:.5rem;">
                ${p.neighborhood ? p.neighborhood + " · " : ""}${p.area || ""}
              </div>
              <div style="font-weight:700; color:var(--primary-color);">${fmtNIS(p.price)} ₪</div>
              <div style="font-size:.9rem; color:#666; margin-top:.25rem;">
                ${p.rooms || "-"} חד׳ · ${p.sqm || "-"} מ״ר · ${p.floor != null ? "קומה " + p.floor : ""}
              </div>
              <button class="cta-button" style="margin-top:.75rem; width:100%; border-radius:10px;"
                      onclick="window.contactAdvisor && window.contactAdvisor()">
                מעוניין/ת
              </button>
            </div>
          </article>
        `,
          )
          .join("")}
      </div>`;
  }

  function search() {
    const filters = {};
    const t = typeSel?.value?.trim();
    const a = areaSel?.value?.trim();
    const min = Number(minEl?.value || "");
    const max = Number(maxEl?.value || "");

    if (t) filters.type = hebTypeToSlug(t);
    if (a) filters.area = hebAreaToSlug(a);
    if (!Number.isNaN(min) && min > 0) filters.minPrice = min;
    if (!Number.isNaN(max) && max > 0) filters.maxPrice = max;

    const list = db.getProperties(filters);

    // Build a *constrained* fallback from trending
    const fallback = db.getTrendingProperties(40).filter((p) => {
      if (filters.area && p.area !== filters.area) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });

    render(list.length ? list : fallback); // ✅ always respects filters
  }

  // First paint: trending
  render(db.getTrendingProperties(12));

  // Bind
  btn.addEventListener("click", search);
  // optional: live search on change
  typeSel && typeSel.addEventListener("change", search);
  areaSel && areaSel.addEventListener("change", search);
}

// ---- Swipe state (one source of truth) ----
let activeSwipePool = [];
let currentPropertyIndex = 0;
let likedProperties = [];

// ---- Image Cache System ----
const imageCache = new Map(); // propertyId -> images array

// Format helpers
const fmtNIS = (n) => {
  try {
    return Number(n).toLocaleString("he-IL");
  } catch {
    return n;
  }
};

////// SWIPE FROM HERE
// Build the swipe pool from DB + onboarding filters
function startPropertySwiping() {
  const swipeInterface = document.getElementById("swipeInterface");
  const db = window.__dorDB;
  const filters = deriveSwipeFilters();
  let pool = db.getProperties(filters);
  // If the strict query is empty, build a constrained fallback from trending
  if (!pool || pool.length === 0) {
    const broad = db.getTrendingProperties(60);
    pool = broad.filter((p) => {
      if (filters.area && p.area !== filters.area) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.minRooms && (p.rooms ?? 0) < filters.minRooms) return false;
      if (filters.maxRooms && (p.rooms ?? 0) > filters.maxRooms) return false; // ✅ add this
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    });
  }
  // Still nothing? Be honest—show results screen with “no matches” messaging
  if (!pool || pool.length === 0) {
    activeSwipePool = [];
    currentPropertyIndex = 0;
    likedProperties = [];
    swipeInterface.style.display = "block";
    showSwipeResults();
    return;
  }
  activeSwipePool = pool;
  currentPropertyIndex = 0;
  likedProperties = [];
  swipeInterface.style.display = "block";
  loadProperty();
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  if (likeBtn) likeBtn.onclick = () => swipeProperty("like");
  if (dislikeBtn) dislikeBtn.onclick = () => swipeProperty("dislike");
}

// --- Helpers: load images for a property (manifest-based, zero probing) ---

// Path to your generated manifest (you said you added it at project root)
const MANIFEST_URL = '/manifest.json';

// Use the imageCache you already declared above
// const imageCache = new Map();

let IMG_MANIFEST = null;

async function loadManifest() {
  if (IMG_MANIFEST) return IMG_MANIFEST;
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`);
    IMG_MANIFEST = await res.json();
  } catch (e) {
    console.error('[manifest] failed to load:', e);
    IMG_MANIFEST = {};
  }
  return IMG_MANIFEST;
}

function urlsFromManifestEntry(propId, entry) {
  const base = `/prop_pics/${propId}`;
  const ext  = entry.ext;
  return [
    `${base}/${entry.hero}.${ext}`,
    ...entry.thumbs.map(name => `${base}/${name}.${ext}`)
  ];
}

/**
 * Return ordered image URLs for a property.
 * Priority:
 * 1) p.images if provided
 * 2) manifest.json entry
 * 3) placeholder
 *
 * Signature kept as (p, maxPics) for compatibility; maxPics is ignored.
 */
async function getPropertyImages(p, _maxPics = 12) {
  if (imageCache.has(p.id)) return imageCache.get(p.id);

  let urls = [];
  if (Array.isArray(p.images) && p.images.length) {
    urls = p.images;
  } else {
    const manifest = await loadManifest();
    const entry = manifest[p.id];
    if (entry && entry.ext && entry.hero) {
      urls = urlsFromManifestEntry(p.id, entry);
    }
  }

  if (!urls.length) urls = ['/gen_pic/placeholder.jpg'];

  imageCache.set(p.id, urls);
  return urls;
}

// Optional: warm a few images (for the NEXT card) without stealing bandwidth
function warmImages(urls, limit = 4) {
  const take = urls.slice(0, limit);
  for (const u of take) {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'lazy';
    if ('fetchPriority' in img) img.fetchPriority = 'low';
    img.src = u;
  }
}

// Clear cache (kept for your debugging)
window.clearImageCache = function () {
  imageCache.clear();
  console.log('🗑️ Image cache cleared - next calls will re-read manifest/arrays');
};

// Smart image resizing based on aspect ratio (your original, kept)
function smartImageResize(img) {
  if (!img || !img.naturalWidth || !img.naturalHeight) return;

  const aspectRatio = img.naturalWidth / img.naturalHeight;
  const isVertical = aspectRatio < 0.75; // Portrait orientation

  if (isVertical) {
    img.classList.add('vertical-image');
    console.log(`📱 Detected vertical image: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
  } else {
    img.classList.remove('vertical-image');
    console.log(`🖼️ Standard image: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
  }
}

// --- Feature map to Hebrew labels and icons ---
const FEATURE_ICONS = {
  "safe-room": "fas fa-shield-alt",    // Safe room icon
  balcony: "fas fa-coffee",          // Balcony icon (custom or use fa-window)
  parking: "fas fa-parking",          // Parking icon
  elevator: "fas fa-elevator",        // Elevator icon
  ac: "fas fa-snowflake",             // Air conditioning icon
  bars: "fas fa-lock",                // Bars (security) icon
  accessible: "fas fa-wheelchair",    // Accessibility icon
};
const FEATURE_LABELS_HE = {
  "safe-room": 'ממ"ד',
  balcony: "מרפסת",
  parking: "חניה",
  elevator: "מעלית",
  ac: "מיזוג",
  bars: "סורגים",
  accessible: "נגיש",
};
// --- Render feature pills ---
function renderFeaturePills(p) {
  const features = Array.isArray(p.features) ? p.features : [];
  if (!features.length) return "";
  const pills = features
    .filter((f) => FEATURE_LABELS_HE[f])
    .map(
      (f) => `
      <li class="feature-pill" dir="rtl">
        <span class="feature-icon"><i class="${FEATURE_ICONS[f]}"></i></span>
        <span class="feature-text">${FEATURE_LABELS_HE[f]}</span>
      </li>`,
    )
    .join("");
  return `
    <ul class="feature-pills">
      ${pills}
    </ul>`;
}

// --- Render description with toggle ---
function renderDescription(p) {
  const desc = p.description?.trim();
  if (!desc) return "";
  const safe = desc.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
    <div class="property-desc" dir="rtl">
      <div class="desc-text">${safe}</div>
    </div>`;
}
// --- Carousel controls wiring ---
function wireCarousel(cardEl) {
  const track = cardEl.querySelector(".carousel-track");
  const slides = Array.from(cardEl.querySelectorAll(".carousel-slide"));
  const prev = cardEl.querySelector(".carousel-prev");
  const next = cardEl.querySelector(".carousel-next");
  const dots = Array.from(cardEl.querySelectorAll(".carousel-dot"));
  if (!track || slides.length === 0) return;
  // Size track and slides: track = N*100%, each slide = 100% of viewport width
  const applyTrackLayout = () => {
    track.style.width = `${slides.length * 100}%`;
    const each = 100 / slides.length;
    slides.forEach((s) => {
      s.style.width = `${each}%`;
      s.style.flex = `0 0 ${each}%`;
    });
  };
  applyTrackLayout();
  window.addEventListener("resize", applyTrackLayout, { passive: true });
  let index = 0;
  // ✅ Move by one-slide fraction of the track: 100/N
  const goTo = (i) => {
    index = Math.max(0, Math.min(i, slides.length - 1));
    const perSlide = 100 / slides.length;
    track.style.transform = `translateX(${-index * perSlide}%)`;
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  };
  prev?.addEventListener("click", () => goTo(index - 1));
  next?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((d, di) => d.addEventListener("click", () => goTo(di)));
  // Touch
  let startX = 0, dx = 0, touching = false;
  track.addEventListener("touchstart", (e) => { touching = true; startX = e.touches[0].clientX; dx = 0; }, { passive: true });
  track.addEventListener("touchmove", (e) => { if (!touching) return; dx = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener("touchend", () => { touching = false; if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1)); }, { passive: true });
  goTo(0);
}

// --- INSTANT Property Loading with Full Carousel - User-First Approach ---
async function loadProperty() {
  const propertyCards = document.getElementById("propertyCards");
  if (!activeSwipePool || currentPropertyIndex >= activeSwipePool.length) {
    showSwipeResults();
    return;
  }
  
  const p = activeSwipePool[currentPropertyIndex];
  
  // INSTANT display with placeholder carousel structure
  propertyCards.innerHTML = `
    <div class="property-card big" id="currentCard">
      <div class="property-carousel" id="property-carousel">
        <div class="carousel-track" id="carousel-track">
          <div class="carousel-slide">
            <img class="property-image-placeholder loading" 
                 src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' dy='.3em' fill='%23666'%3E🏠%3C/text%3E%3C/svg%3E"
                 alt="Loading property...">
          </div>
        </div>
        <button class="carousel-nav carousel-prev" type="button" aria-label="Previous" style="opacity: 0.3;">&#10094;</button>
        <button class="carousel-nav carousel-next" type="button" aria-label="Next" style="opacity: 0.3;">&#10095;</button>
        <div class="carousel-dots" id="carousel-dots">
          <button class="carousel-dot active" aria-label="slide 1"></button>
        </div>
      </div>
      
      <div class="property-info" dir="rtl">
        <div class="property-title">${p.title || "נכס מעולה"}</div>
        <div class="property-meta" style="margin-top:.2rem; color:#666; font-size:.95rem;">
          ${p.rooms ?? "-"} חד׳ · ${p.sqm ?? "-"} מ״ר ${p.floor != null ? "· קומה " + p.floor : ""}
        </div>
        <div class="property-price">${fmtNIS(p.price)} ₪</div>
        ${renderFeaturePills(p)}
        ${renderDescription(p)}
      </div>
    </div>`;

  // Load ALL images and build carousel (but prioritize first image)
  loadPropertyCarouselAsync(p);
}

// INSTANT carousel loading - hero first, rest progressively
async function loadPropertyCarouselAsync(property) {
  console.log(`⚡ INSTANT carousel for property:`, property.id);
  
  const carouselTrack = document.getElementById("carousel-track");
  const carouselDots = document.getElementById("carousel-dots");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  
  if (!carouselTrack || !carouselDots) return;

  // STEP 1: INSTANT hero display (from cache or quick manifest lookup)
  let heroUrl = null;
  if (imageCache.has(property.id)) {
    const cachedUrls = imageCache.get(property.id);
    heroUrl = cachedUrls[0];
    console.log(`💨 Using cached hero: ${heroUrl}`);
  } else {
    // Fast manifest lookup for hero only
    try {
      const manifest = await loadManifest();
      const entry = manifest[property.id];
      if (entry && entry.ext && entry.hero) {
        heroUrl = `/prop_pics/${property.id}/${entry.hero}.${entry.ext}`;
        console.log(`📋 Hero from manifest: ${heroUrl}`);
      }
    } catch (e) {
      console.log('⚠️ Manifest lookup failed, using placeholder');
    }
  }

  // Show hero IMMEDIATELY
  if (heroUrl) {
    carouselTrack.innerHTML = `
      <div class="carousel-slide">
        <img src="${heroUrl}" alt="${property.title || "property"}" 
             loading="eager"
             fetchpriority="high"
             style="aspect-ratio:4/3;width:100%;height:auto;"
             onload="smartImageResize(this)"/>
      </div>`;
    carouselDots.innerHTML = `<button class="carousel-dot active" aria-label="slide 1"></button>`;
    console.log(`✨ Hero displayed instantly`);
  } else {
    // Fallback placeholder
    carouselTrack.innerHTML = `
      <div class="carousel-slide">
        <div class="property-image placeholder">
          <i class="${property.image || "fas fa-building"}" style="font-size:4rem;color:#ccc;"></i>
        </div>
      </div>`;
    carouselDots.innerHTML = `<button class="carousel-dot active" aria-label="slide 1"></button>`;
    console.log(`🏠 No hero available, showing placeholder`);
  }

  // STEP 2: Load remaining images progressively (non-blocking)
  requestAnimationFrame(async () => {
    try {
      const imgs = await getPropertyImages(property);
      console.log(`📸 Progressive: got ${imgs.length} total images`);
      
      if (imgs.length > 1) {
        // Build remaining slides
        const remainingSlides = imgs.slice(1).map(src => `
          <div class="carousel-slide">
            <img src="${src}" alt="${property.title || "property"}" 
                 loading="lazy"
                 fetchpriority="low"
                 style="aspect-ratio:4/3;width:100%;height:auto;"
                 onload="smartImageResize(this)"/>
          </div>
        `).join("");
        
        // Append to existing track (hero stays first)
        carouselTrack.innerHTML += remainingSlides;
        
        // Update dots for all images
        const allDots = imgs.map((_, index) => 
          `<button class="carousel-dot${index === 0 ? ' active' : ''}" aria-label="slide ${index + 1}"></button>`
        ).join("");
        carouselDots.innerHTML = allDots;
        
        // Enable navigation
        if (prevBtn && nextBtn) {
          prevBtn.style.opacity = "1";
          nextBtn.style.opacity = "1";
        }
        
        // Wire up carousel functionality
        const currentCard = document.getElementById("currentCard");
        if (currentCard) wireCarousel(currentCard);
        
        console.log(`🎠 Progressive carousel complete: ${imgs.length} slides`);
      } else {
        // Single image - disable navigation
        if (prevBtn && nextBtn) {
          prevBtn.style.opacity = "0.3";
          nextBtn.style.opacity = "0.3";
        }
        console.log(`🖼️ Single image property`);
      }
    } catch (error) {
      console.log('❌ Progressive loading failed:', error);
      // Hero already displayed, so this is graceful degradation
    }
  });
}


// Lightweight preloading - just warm next property's hero images
function warmNextProperty() {
  const nextIndex = currentPropertyIndex + 1;
  if (nextIndex >= activeSwipePool.length) return;
  
  const nextProp = activeSwipePool[nextIndex];
  if (imageCache.has(nextProp.id)) return; // Already cached
  
  // Warm just the next property's first few images
  getPropertyImages(nextProp).then(urls => {
    if (urls && urls.length > 0) {
      warmImages(urls, 3); // Only first 3 images
      console.log(`🔥 Warmed next property: ${nextProp.id} (${Math.min(3, urls.length)} images)`);
    }
  }).catch(e => {
    console.log(`⚠️ Warm failed for ${nextProp.id}:`, e);
  });
}

////// SWIPE ENDS HERE

// Handle swipe action (like/dislike) and advance
function swipeProperty(action) {
  const currentCard = document.getElementById("currentCard");
  if (!currentCard) return;

  if (action === "like") {
    likedProperties.push(activeSwipePool[currentPropertyIndex]);
    currentCard.style.transform = "translateX(-100%) rotate(-10deg)";
  } else {
    currentCard.style.transform = "translateX(100%) rotate(10deg)";
  }
  currentCard.style.opacity = "0";

  setTimeout(() => {
    currentPropertyIndex++;
    loadProperty();
    // Warm next property after advancing (post-click preloading)
    warmNextProperty();
  }, 300);
}

// Show end-of-deck results
function showSwipeResults() {
  const propertyCards = document.getElementById("propertyCards");
  if (!likedProperties.length) {
    propertyCards.innerHTML = `
      <div style="text-align:center; color:white; padding:2rem;">
        <i class="fas fa-heart-broken" style="font-size:4rem; margin-bottom:1rem; opacity:.7;"></i>
        <h3>לא מצאתם משהו שמתאים?</h3>
        <p style="margin:1rem 0;">אין בעיה! בואו נדבר עם היועצים שלנו</p>
        <button data-open-contact class="cta-button">דברו עם יועץ</button>
      </div>`;
  } else {
    propertyCards.innerHTML = `
      <div style="text-align:center; color:white; padding:2rem;">
        <i class="fas fa-heart" style="font-size:4rem; margin-bottom:1rem; color:#e74c3c;"></i>
        <h3>מצוין! מצאתם ${likedProperties.length} נכסים שאהבתם</h3>
        <p style="margin:1rem 0;">היועצים שלנו ייצרו איתכם קשר בקרוב</p>
        <button data-open-contact class="cta-button">קבעו פגישה</button>
      </div>`;
  }
  const actions = document.querySelector(".swipe-actions");
  if (actions) actions.style.display = "none";
}

/* ==== Unicorn UI helpers (no HTML edits required) ==== */
function ensureUIRoot() {
  let toast = document.getElementById("toastContainer");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastContainer";

    // mount right after the button area
    const btnArea =
      document.querySelector("#verifyCodeBtn")?.parentNode ||
      document.querySelector("#sendCodeBtn")?.parentNode ||
      document.body;
    btnArea.insertAdjacentElement("afterend", toast);
  }
  return toast;
}

function showToast(message, kind = "info") {
  ensureUIRoot();
  const container = document.getElementById("toastContainer");
  const el = document.createElement("div");
  el.className =
    "toast" +
    (kind === "error"
      ? " toast--error"
      : kind === "success"
        ? " toast--success"
        : "");
  el.textContent = message;

  // Dismiss on click
  el.addEventListener("click", () => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 250);
  });

  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

function ensureInlineError(hostSelector = "#onboardingContent") {
  // Attach a single shared inline error under your onboarding content
  const host = document.querySelector(hostSelector) || document.body;
  let err = host.querySelector("#formError");
  if (!err) {
    err = document.createElement("p");
    err.id = "formError";
    err.className = "form-error";
    host.appendChild(err);
  }
  return err;
}

function showInlineError(msg, hostSelector) {
  const el = ensureInlineError(hostSelector);
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
}

function setLoading(btn, isLoading) {
  if (!btn) return;
  btn.disabled = !!isLoading;
  btn.classList.toggle("btn-loading", !!isLoading);
}