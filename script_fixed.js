// @ts-nocheck
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
  //////////////////////////////// USED CATEGORIES

  /////////////// TOP-BAR

  /// RIGHT OF LOGO

  // מורשת בכתב
  about: {
  title: "Legacy Protocol | פרוטוקול המורשת",
  content: `
    <style>
      /* ===== A. FRAME & THEME ===== */
      .quantum-about {
        background: linear-gradient(135deg, #141414 0%, #0f0f0f 60%, #0b0b0b 100%);
        color: #ffffff;
        position: relative;
        overflow: hidden;
        padding: 0;
        margin: -2rem;
        min-height: 90vh;
        direction: rtl;
        font-family: 'Heebo', Arial, sans-serif;
      }

      .about-content {
        position: relative;
        z-index: 1;
        padding: 3rem 2rem;
        max-width: 1100px;
        margin: 0 auto;
      }

      /* ===== B. HERO ===== */
      .about-hero {
        text-align: center;
        margin-bottom: 2rem;
      }

      .about-title {
        font-size: 2.8rem;
        font-weight: 900;
        line-height: 1.1;
        background: linear-gradient(135deg, #FF7A00 0%, #FF4D00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 0.5rem 0;
      }

      .about-subtitle {
        font-size: 1.15rem;
        color: #cfcfcf;
        max-width: 780px;
        margin: 0.5rem auto 0;
        line-height: 1.6;
      }

      /* ===== C. STORY PANEL ===== */
      .legacy-story {
        background: linear-gradient(135deg, rgba(255,122,0,0.06), rgba(255,77,0,0.04));
        border: 1px solid rgba(255,122,0,0.25);
        border-radius: 14px;
        padding: 1.5rem;
        margin: 2rem 0 2.5rem 0;
      }

      .story-text {
        font-size: 1.05rem;
        line-height: 1.75;
        color: #e8e8e8;
        margin: 0 0 0.8rem 0;
        text-align: justify;
      }
      .story-text:last-child { margin-bottom: 0; }

      /* ===== D. TIMELINE TOGGLE (THE COLORED BAR) ===== */
      .timeline-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .75rem;
        cursor: pointer;
        user-select: none;
        border-radius: 12px;
        padding: 1rem 1.25rem;
        margin: 0 auto 0.75rem auto;
        width: 100%;
        max-width: 860px;

        /* The brand orange appears here; timeline opens only on click */
        background: linear-gradient(135deg, #FF7A00 0%, #FF4D00 100%);
        color: #fff;
        font-weight: 800;
        font-size: 1.1rem;
        letter-spacing: .02em;
        box-shadow: 0 6px 20px rgba(255,122,0,0.25);
        transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
      }
      .timeline-toggle:hover { transform: translateY(-1px); filter: brightness(1.05); }
      .timeline-toggle:active { transform: translateY(0); filter: brightness(0.98); }

      .toggle-icon {
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        background: rgba(255,255,255,0.18);
        position: relative;
      }
      .toggle-icon::before, .toggle-icon::after{
        content:"";
        position:absolute;
        background:#fff;
        left:50%; top:50%;
        transform:translate(-50%,-50%);
        transition: opacity .2s ease, transform .2s ease;
      }
      .toggle-icon::before{ width: 60%; height: 2px; }
      .toggle-icon::after{ width: 2px; height: 60%; }
      .timeline-toggle[aria-expanded="true"] .toggle-icon::after{ opacity: 0; transform: translate(-50%,-50%) scaleY(0); }

      /* ===== E. TIMELINE WRAPPER (COLLAPSED BY DEFAULT) ===== */
      .timeline-wrapper {
        overflow: hidden;
        max-height: 0;               /* collapsed */
        padding: 0;                  /* collapsed */
        transition: max-height .45s ease, padding .35s ease, opacity .35s ease;
        opacity: 0;
      }
      .timeline-wrapper.open {
        max-height: 3000px;          /* large enough to reveal all items */
        padding: 1rem 0 0;
        opacity: 1;
      }

      /* ===== F. TIMELINE LAYOUT ===== */
      .quantum-timeline {
        position: relative;
        max-width: 1100px;
        margin: 0 auto;
      }

      .timeline-header {
        text-align: center;
        margin-bottom: 1.25rem;
      }

      .timeline-title {
        font-size: 2rem;
        font-weight: 800;
        color: #f3f3f3;
        margin: 0;
      }

      .timeline-container {
        position: relative;
        padding: 1rem 0 0 0;
      }

      /* central line (subtle) */
      .timeline-line {
        position: absolute;
        right: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(to bottom, rgba(255,122,0,.7), rgba(255,77,0,.7));
        transform: translateX(50%);
        border-radius: 2px;
        opacity: .5;
      }

      .timeline-item {
        display: flex;
        margin-bottom: 2.5rem;
        position: relative;
      }
      .timeline-item:nth-child(even) { flex-direction: row-reverse; }

      .timeline-content {
        background: linear-gradient(135deg, rgba(255,122,0,0.08), rgba(255,77,0,0.06));
        border: 1px solid rgba(255,122,0,0.25);
        border-radius: 14px;
        padding: 1.25rem 1.5rem;
        width: 46%;
        position: relative;
        transition: border-color .2s ease, background .2s ease, transform .2s ease, box-shadow .2s ease;
      }
      .timeline-content:hover {
        transform: translateY(-3px);
        border-color: rgba(255,122,0,0.5);
        background: linear-gradient(135deg, rgba(255,122,0,0.12), rgba(255,77,0,0.1));
        box-shadow: 0 12px 28px rgba(255,122,0,0.15);
      }

      .timeline-dot {
        position: absolute;
        right: 50%;
        top: 50%;
        width: 14px;
        height: 14px;
        background: linear-gradient(135deg, #FF7A00, #FF4D00);
        border-radius: 50%;
        transform: translate(50%, -50%);
        border: 3px solid rgba(255,122,0,0.35);
        box-shadow: 0 0 18px rgba(255,122,0,0.6);
        z-index: 5;
      }

      .timeline-year {
        font-size: 1.4rem;
        font-weight: 900;
        color: #ff9a4a;
        margin-bottom: .25rem;
        text-align: center;
      }

      .timeline-milestone {
        font-size: 1.2rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 .5rem 0;
        text-align: center;
      }

      .timeline-description {
        font-size: 0.98rem;
        line-height: 1.65;
        color: #dcdcdc;
        text-align: center;
        margin: 0;
      }

      .timeline-item.current .timeline-content {
        border-color: rgba(255,255,255,0.5);
        background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,122,0,0.10));
      }

      /* ===== G. FOOTER CTA ===== */
      .legacy-footer {
        text-align: center;
        margin-top: 2.25rem;
        padding: 1rem 0 0;
      }

      .legacy-cta {
        background: transparent;
        color: #ffffff;
        border: 2px solid rgba(255,255,255,0.6);
        padding: 0.9rem 2rem;
        font-size: 1.05rem;
        font-weight: 800;
        border-radius: 10px;
        cursor: pointer;
        transition: background .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
      }
      .legacy-cta:hover {
        background: rgba(255,255,255,0.12);
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(0,0,0,0.25);
      }

      /* ===== H. RESPONSIVE ===== */
      @media (max-width: 900px) {
        .about-title { font-size: 2.3rem; }
      }
      @media (max-width: 768px) {
        .about-content { padding: 2rem 1.25rem; }
        .timeline-line { display: none; }
        .timeline-item { flex-direction: column !important; margin-bottom: 1.5rem; }
        .timeline-content { width: 100%; }
        .timeline-dot { position: relative; right: auto; top: auto; transform: none; margin: .75rem auto 0; }
      }
    </style>

    <div class="quantum-about">
      <div class="about-content">
        <!-- HERO -->
        <div class="about-hero">
          <h1 class="about-title">Legacy Protocol</h1>
          <p class="about-subtitle">
            מסורת שמציבה סטנדרט. מקצוענות שאינה מתפשרת. 28 שנים של יציבות, תבונה והובלה.
          </p>
        </div>

        <!-- STORY -->
        <div class="legacy-story">
          <p class="story-text">
            בעולם שמשתנה ללא הרף, נדיר למצוא עסק אשר חי, נושם ומתרחב זה 28 שנים. כדי לפעול מתוך תשוקה, אשר רק הולכת ומתחזקת, לאורך תקופת זמן שכזו, מוכרחת להיות כמיהה אמיתית.
          </p>
          <p class="story-text">
            עבורנו, נדל"ן מהווה שליחות. המסע שלנו התחיל ברצון לגעת בכל אדם דרך האנרגיה הקיומית המרתקת של הנדל"ן, בתצורה של חיבור למרחב ההגשמה המדויק עבורו.
          </p>
          <p class="story-text">
            בהמשך, אף להגשים את חזון בניין ארץ ישראל ולבנות בתים חדשים.
          </p>
          <p class="story-text">
            למעשה, זו זכות להגיד כי אנו כאן. ענפים יותר, חדשניים יותר, חזקים יותר, והזרוע עוד נטויה.
          </p>
        </div>

        <!-- TIMELINE TOGGLE (COLORED) -->
        <button class="timeline-toggle" type="button" aria-expanded="false" data-timeline-toggle>
          <span>פתחו את מסלול הזמן</span>
          <span class="toggle-icon" aria-hidden="true"></span>
        </button>

        <!-- TIMELINE (COLLAPSED UNTIL CLICK) -->
        <div id="timelineWrapper" class="timeline-wrapper" aria-hidden="true">
          <div class="quantum-timeline">
            <div class="timeline-header">
              <h2 class="timeline-title">מסלול הזמן הקוונטי</h2>
            </div>

            <div class="timeline-container">
              <div class="timeline-line"></div>

              <div class="timeline-item">
                <div class="timeline-content">
                  <div class="timeline-year">1997</div>
                  <h3 class="timeline-milestone">בית מסחר נכסים</h3>
                  <p class="timeline-description">כניסה לעולם העסקאות, מיקוד בתמחור מדויק ובמצוינות משא ומתן. הונחו היסודות לאמון ארוך טווח.</p>
                </div>
                <div class="timeline-dot"></div>
              </div>

              <div class="timeline-item">
                <div class="timeline-content">
                  <div class="timeline-year">2006</div>
                  <h3 class="timeline-milestone">יזמות</h3>
                  <p class="timeline-description">הרחבת הפעילות לפיתוח פרויקטים: מימון, תכנון ורישוי, ניהול קצה לקצה.</p>
                </div>
                <div class="timeline-dot"></div>
              </div>

              <div class="timeline-item">
                <div class="timeline-content">
                  <div class="timeline-year">2008</div>
                  <h3 class="timeline-milestone">שיווק פרויקטים</h3>
                  <p class="timeline-description">בניית מנוע שיווקי עם דאטת שוק, קהלים וחוויית לקוח, על מנת להאיץ קליטה ומכירות.</p>
                </div>
                <div class="timeline-dot"></div>
              </div>

              <div class="timeline-item">
                <div class="timeline-content">
                  <div class="timeline-year">2012</div>
                  <h3 class="timeline-milestone">חיזוק תשתיות</h3>
                  <p class="timeline-description">בניית יכולות פנימיות, שיפור תהליכים, והרחבת הידע והמומחיות המקצועית.</p>
                </div>
                <div class="timeline-dot"></div>
              </div>

              <div class="timeline-item">
                <div class="timeline-content">
                  <div class="timeline-year">2020</div>
                  <h3 class="timeline-milestone">דיגיטליזציה</h3>
                  <p class="timeline-description">מתודות מבוססות דאטה, אוטומציה וניתוח קבלת החלטות, מכפילי ביצוע ותשואה.</p>
                </div>
                <div class="timeline-dot"></div>
              </div>

              <div class="timeline-item current">
                <div class="timeline-content">
                  <div class="timeline-year">2025</div>
                  <h3 class="timeline-milestone">עתיד חכם</h3>
                  <p class="timeline-description">יוזמת השקעות ממוקדת. מסגרות קפיטליות, תהליכי סינון ושותפויות. בשלבי פריסה והרחבה.</p>
                </div>
                <div class="timeline-dot"></div>
              </div>
            </div>
          </div>

          <div class="legacy-footer">
            <button class="legacy-cta" data-start-journey>על מה אתם חולמים?</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      // Toggle the timeline on click of the colored bar
      (function(){
        const toggle = document.querySelector('[data-timeline-toggle]');
        const wrapper = document.getElementById('timelineWrapper');
        if (!toggle || !wrapper) return;

        function setState(open){
          wrapper.classList.toggle('open', open);
          wrapper.setAttribute('aria-hidden', open ? 'false' : 'true');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        toggle.addEventListener('click', () => {
          const willOpen = toggle.getAttribute('aria-expanded') !== 'true';
          setState(willOpen);
        });

        // start collapsed
        setState(false);
      })();
    </script>
  `,
  },
  // שירותי הפירמה
  services: {
    title: "Innovation Hub | רכזת החדשנות",
    content: `
      <style>
        .quantum-services {
          background: linear-gradient(135deg, #1a0a0a 0%, #2e1a0a 50%, #3e2010 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
          padding: 0;
          margin: -2rem;
          min-height: 85vh;
        }
        
        .services-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .service-particle {
          position: absolute;
          width: 1px;
          height: 1px;
          background: #ff8c42;
          border-radius: 50%;
          opacity: 0.6;
          animation: serviceFloat 6s infinite linear;
        }
        
        .service-particle:nth-child(2n) { background: #ff6b35; animation-delay: -1.5s; }
        .service-particle:nth-child(3n) { background: #ff9a56; animation-delay: -3s; }
        .service-particle:nth-child(4n) { background: #ffb377; animation-delay: -4.5s; }
        
        @keyframes serviceFloat {
          0% { transform: translateY(100vh) translateX(0px) scale(0); opacity: 0; }
          15% { opacity: 0.8; transform: scale(1); }
          85% { opacity: 0.8; }
          100% { transform: translateY(-100px) translateX(30px) scale(0); opacity: 0; }
        }
        
        .services-content {
          position: relative;
          z-index: 10;
          padding: 3rem 2rem;
          backdrop-filter: blur(3px);
        }
        
        .services-hero {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .services-title {
          font-size: 2.8rem;
          font-weight: 700;
          background: linear-gradient(45deg, #ff8c42, #ff6b35, #ffb377);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          animation: servicesPulse 3s infinite alternate;
        }
        
        @keyframes servicesPulse {
          0% { transform: scale(1) rotateZ(0deg); filter: brightness(1); }
          100% { transform: scale(1.03) rotateZ(1deg); filter: brightness(1.3); }
        }
        
        .services-subtitle {
          font-size: 1.3rem;
          color: #d8b8a8;
          max-width: 700px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin: 3rem 0;
        }
        
        .service-hexagon {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 140, 66, 0.3);
          border-radius: 20px;
          padding: 3rem;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        
        .service-hexagon:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: #ff8c42;
          box-shadow: 
            0 20px 40px rgba(255, 140, 66, 0.3),
            0 0 50px rgba(255, 107, 53, 0.2);
        }
        
        .service-hexagon::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #ff8c42, #ff6b35, #ffb377, #ff9a56);
          z-index: -1;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .service-hexagon:hover::before {
          opacity: 1;
        }
        
        .service-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .service-icon {
          font-size: 3rem;
          margin-left: 1.5rem;
          color: #ff8c42;
          text-shadow: 0 0 20px rgba(255, 140, 66, 0.6);
        }
        
        .service-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        .service-title-en {
          font-size: 1rem;
          color: #ff8c42;
          font-weight: 400;
          display: block;
          margin-top: 0.2rem;
        }
        
        .service-description {
          color: #d8b8a8;
          line-height: 1.7;
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .service-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .feature-tag {
          background: rgba(255, 140, 66, 0.15);
          border: 1px solid rgba(255, 140, 66, 0.4);
          padding: 0.6rem 1rem;
          border-radius: 20px;
          text-align: center;
          color: #ffffff;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .feature-tag:hover {
          background: rgba(255, 140, 66, 0.25);
          transform: scale(1.05);
          box-shadow: 0 3px 10px rgba(255, 140, 66, 0.4);
        }
        
        .tech-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
          text-align: center;
        }
        
        .tech-stat {
          background: rgba(255, 255, 255, 0.02);
          padding: 1rem;
          border-radius: 15px;
          border: 1px solid rgba(255, 140, 66, 0.2);
        }
        
        .tech-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ff8c42;
          display: block;
        }
        
        .tech-label {
          color: #d8b8a8;
          font-size: 0.8rem;
          margin-top: 0.3rem;
        }
        
        .cta-section {
          text-align: center;
          margin-top: 4rem;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 25px;
          border: 1px solid rgba(255, 140, 66, 0.2);
        }
        
        .quantum-cta-services {
          background: linear-gradient(45deg, #ff8c42, #ff6b35);
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 25px;
          color: #000;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .quantum-cta-services:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 140, 66, 0.5);
        }
        
        .quantum-cta-services::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s ease;
        }
        
        .quantum-cta-services:hover::before {
          left: 100%;
        }
        
        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          }
        }
      </style>
      
      <div class="quantum-services">
        <!-- Service Particles Background -->
        <div class="services-particles">
          <div class="service-particle" style="left: 15%; animation-duration: 5s;"></div>
          <div class="service-particle" style="left: 25%; animation-duration: 6s;"></div>
          <div class="service-particle" style="left: 35%; animation-duration: 4.5s;"></div>
          <div class="service-particle" style="left: 45%; animation-duration: 5.5s;"></div>
          <div class="service-particle" style="left: 55%; animation-duration: 4s;"></div>
          <div class="service-particle" style="left: 65%; animation-duration: 6.5s;"></div>
          <div class="service-particle" style="left: 75%; animation-duration: 5.2s;"></div>
          <div class="service-particle" style="left: 85%; animation-duration: 4.8s;"></div>
        </div>
        
        <div class="services-content">
          <!-- Hero Section -->
          <div class="services-hero">
            <h1 class="services-title">פתרונות מתקדמים</h1>
            <p class="services-subtitle">
              אנחנו משלבים טכנולוגיות עתידניות עם מומחיות נדל"נית עמוקה כדי ליצור פתרונות שמעצבים את השוק המחר.
              כל שירות שלנו בנוי על בסיס של חדשנות, דאטה ותוצאות מוכחות.
            </p>
            
            <div class="tech-stats">
              <div class="tech-stat">
                <span class="tech-number">AI</span>
                <span class="tech-label">Powered Analytics</span>
              </div>
              <div class="tech-stat">
                <span class="tech-number">24/7</span>
                <span class="tech-label">Real-time Data</span>
              </div>
              <div class="tech-stat">
                <span class="tech-number">95%</span>
                <span class="tech-label">Accuracy Rate</span>
              </div>
              <div class="tech-stat">
                <span class="tech-number">∞</span>
                <span class="tech-label">Possibilities</span>
              </div>
            </div>
          </div>
          
          <!-- Services Grid -->
          <div class="services-grid">
            <div class="service-hexagon">
              <div class="service-header">
                <div class="service-icon">🏗️</div>
                <div>
                  <h3 class="service-title">
                    יזמות נדל"ן
                    <span class="service-title-en">Real Estate Entrepreneurship</span>
                  </h3>
                </div>
              </div>
              <p class="service-description">
                איתור קרקעות מדויק באמצעות מודלים מבוססי למידת מכונה, פרדיקציות ובינה מלאכותית. 
                ניתוח תב"ע ותכנון מותאם, לצד ניהול רישוי וביצוע מוקפד. יצירת ערך אמיתי כבר מהרעיון ועד המפתח.
              </p>
              <div class="service-features">
                <div class="feature-tag">Machine Learning Models</div>
                <div class="feature-tag">AI Predictions</div>
                <div class="feature-tag">Zoning Analysis</div>
                <div class="feature-tag">Licensing Management</div>
              </div>
            </div>
            
            <div class="service-hexagon">
              <div class="service-header">
                <div class="service-icon">📈</div>
                <div>
                  <h3 class="service-title">
                    שיווק מתקדם
                    <span class="service-title-en">Advanced Marketing</span>
                  </h3>
                </div>
              </div>
              <p class="service-description">
                אסטרטגיה מונחית דאטה, בהשראה משיווק קוואנטי. חווית לקוח מותאמת אישית לצורך פילוח שוק מבוסס בינה מלאכותית. 
                מיתוג עוצמתי בעולמות הפרויקטים והיד-שנייה.
              </p>
              <div class="service-features">
                <div class="feature-tag">Data-Driven Strategy</div>
                <div class="feature-tag">Quantum Marketing</div>
                <div class="feature-tag">AI Market Segmentation</div>
                <div class="feature-tag">Powerful Branding</div>
              </div>
            </div>
            
            <div class="service-hexagon">
              <div class="service-header">
                <div class="service-icon">💰</div>
                <div>
                  <h3 class="service-title">
                    המחלקה הפיננסית
                    <span class="service-title-en">Financial Department</span>
                  </h3>
                </div>
              </div>
              <p class="service-description">
                מודלי תשואה מתקדמים, פתרונות מימון מותאמים ועסקאות מיזוגים ורכישות מנוהלות בקפדנות. 
                בקרת סיכונים רציפה להבטחת יציבות וצמיחה בכל שלב.
              </p>
              <div class="service-features">
                <div class="feature-tag">Advanced ROI Models</div>
                <div class="feature-tag">Custom Financing</div>
                <div class="feature-tag">M&A Management</div>
                <div class="feature-tag">Risk Control</div>
              </div>
            </div>
          </div>
          
          <!-- CTA Section -->
          <div class="cta-section">
            <h2 style="color: #ffffff; margin-bottom: 1rem; font-size: 1.8rem;">Experience The Future</h2>
            <p style="color: #b8d8b8; margin-bottom: 2rem;">
              מוכנים לחוות את הדור הבא של שירותי הנדל"ן? <br>
               בואו נראה איך הטכנולוגיה שלנו יכולה לשנות את הכללים עבורכם.
            </p>
            <button class="quantum-cta-services" data-modal="team" type="button">
              <i class="fas fa-users" style="margin-left: 0.5rem;"></i>
              Meet The Team | פגשו את הצוות
            </button>
            <button class="quantum-cta-services" data-modal="contact" type="button">
              <i class="fas fa-rocket" style="margin-left: 0.5rem;"></i>
              Start Your Journey | התחילו את המסע
            </button>
          </div>
        </div>
      </div>
      
      <script>
        // Initialize service effects
        setTimeout(() => {
          const particles = document.querySelectorAll('.service-particle');
          particles.forEach((particle, i) => {
            particle.style.animationDelay = (i * 0.4) + 's';
            particle.style.left = (10 + Math.random() * 80) + '%';
          });
          
          // Add enhanced hover effects
          const hexagons = document.querySelectorAll('.service-hexagon');
          hexagons.forEach(hex => {
            hex.addEventListener('mouseenter', () => {
              hex.style.transform = 'translateY(-12px) scale(1.03) rotateX(2deg)';
            });
            hex.addEventListener('mouseleave', () => {
              hex.style.transform = 'translateY(0) scale(1) rotateX(0)';
            });
          });
        }, 100);
      </script>
    `,
  },
  // הצוות שלנו
  team: {
  title: "Neural Network | הרשת הנוירונית",
  content: `
<style>
  .quantum-team {
    background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #2e1a3e 100%);
    color: #ffffff;
    position: relative;
    overflow: hidden;
    padding: 0;
    margin: -2rem;
    min-height: 90vh;
  }
  .team-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
  .team-particle { position: absolute; width: 1.5px; height: 1.5px; background: #8a2be2; border-radius: 50%; opacity: 0.6; animation: teamFloat 7s infinite linear; }
  .team-particle:nth-child(2n) { background: #da70d6; animation-delay: -2s; }
  .team-particle:nth-child(3n) { background: #9370db; animation-delay: -4s; }
  .team-particle:nth-child(4n) { background: #6a5acd; animation-delay: -6s; }
  @keyframes teamFloat { 0% { transform: translateY(100vh) translateX(-20px) scale(0); opacity: 0; } 20% { opacity: 0.6; transform: scale(1); } 80% { opacity: 0.6; } 100% { transform: translateY(-100px) translateX(20px) scale(0); opacity: 0; } }
  .team-content { position: relative; z-index: 10; padding: 2rem; backdrop-filter: blur(2px); }
  .team-hero { text-align: center; margin-bottom: 3rem; }
  .team-title { font-size: 2.5rem; font-weight: 700; background: linear-gradient(45deg, #8a2be2, #da70d6, #9370db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; animation: teamPulse 4s infinite alternate; }
  @keyframes teamPulse { 0% { transform: scale(1); filter: brightness(1); } 100% { transform: scale(1.02); filter: brightness(1.4); } }
  .team-subtitle { font-size: 1.1rem; color: #d8b8d8; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6; }
  .executive-progress { display: flex; align-items: center; justify-content: center; margin: 2rem 0; gap: 1rem; }
  .exec-counter { background: rgba(138,43,226,.1); border: 1px solid rgba(138,43,226,.3); padding: .5rem 1rem; border-radius: 25px; color: #da70d6; font-weight: 600; font-size: 1rem; }
  .progress-track { width: 200px; height: 6px; background: rgba(255,255,255,.1); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg,#8a2be2,#da70d6); border-radius: 3px; transition: width .5s ease; box-shadow: 0 0 10px rgba(138,43,226,.5); }
  .executive-showcase { background: rgba(255,255,255,.02); border: 1px solid rgba(138,43,226,.2); border-radius: 25px; padding: 3rem; margin: 2rem 0; backdrop-filter: blur(5px); transition: all .3s ease; }
  .executive-showcase:hover { border-color: #8a2be2; box-shadow: 0 15px 35px rgba(138,43,226,.2); }
  .exec-profile { display: flex; align-items: flex-start; gap: 2rem; margin-bottom: 2rem; }
  .exec-photo-container { position: relative; flex-shrink: 0; }
  .exec-photo { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 3px solid #8a2be2; box-shadow: 0 0 20px rgba(138,43,226,.4); transition: all .3s ease; }
  .exec-photo:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(138,43,226,.6); }
  .exec-info { flex: 1; }
  .exec-name { font-size: 1.8rem; font-weight: 600; color: #fff; margin-bottom: .5rem; }
  .exec-title { font-size: 1rem; color: #da70d6; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; }
  .exec-description { color: #d8b8d8; line-height: 1.7; font-size: .95rem; text-align: justify; }
  .exec-skills { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.5rem; }
  .skill-chip { background: rgba(138,43,226,.15); border: 1px solid rgba(138,43,226,.3); padding: .3rem .8rem; border-radius: 15px; font-size: .8rem; color: #da70d6; transition: all .3s ease; }
  .skill-chip:hover { background: rgba(138,43,226,.25); transform: scale(1.05); }
  .navigation-controls { display: flex; justify-content: center; align-items: center; gap: 2rem; margin: 3rem 0; }
  .nav-btn { background: linear-gradient(45deg,#8a2be2,#da70d6); border: none; width: 50px; height: 50px; border-radius: 50%; color: #fff; font-size: 1.2rem; cursor: pointer; transition: all .3s ease; position: relative; overflow: hidden; }
  .nav-btn:hover { transform: scale(1.1); box-shadow: 0 5px 15px rgba(138,43,226,.4); }
  .nav-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent); transition: left .5s ease; }
  .nav-btn:hover::before { left: 100%; }
  .team-dots { display: flex; justify-content: center; gap: .5rem; margin-top: 1rem; }
  .team-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(138,43,226,.3); transition: all .3s ease; cursor: pointer; }
  .team-dot.active { background: #8a2be2; transform: scale(1.3); box-shadow: 0 0 10px rgba(138,43,226,.5); }
  @media (max-width: 768px) {
    .exec-profile { flex-direction: column; text-align: center; }
    .exec-photo { width: 120px; height: 120px; margin: 0 auto; }
    .team-content { padding: 1rem; }
    .executive-showcase { padding: 2rem 1rem; }
  }
</style>

<div class="quantum-team">
  <div class="team-particles">
    <div class="team-particle" style="left: 12%; animation-duration: 6s;"></div>
    <div class="team-particle" style="left: 22%; animation-duration: 7s;"></div>
    <div class="team-particle" style="left: 32%; animation-duration: 5.5s;"></div>
    <div class="team-particle" style="left: 42%; animation-duration: 6.5s;"></div>
    <div class="team-particle" style="left: 52%; animation-duration: 5s;"></div>
    <div class="team-particle" style="left: 62%; animation-duration: 7.5s;"></div>
    <div class="team-particle" style="left: 72%; animation-duration: 6.2s;"></div>
    <div class="team-particle" style="left: 82%; animation-duration: 5.8s;"></div>
  </div>

  <div class="team-content">
    <div class="team-hero">
      <h1 class="team-title">The Brain Trust</h1>
      <p class="team-subtitle">
        צוות מובילים שמשלב חדשנות טכנולוגית עם מומחיות עמוקה. כל אחד מחברי הצוות מביא פרספקטיבה ייחודית
        שמעצבת יחד את עתיד הנדל"ן בישראל.
      </p>
    </div>

    <div class="executive-progress">
      <div class="exec-counter" id="executive-counter">1/8</div>
      <div class="progress-track">
        <div class="progress-fill" id="progress-bar" style="width: 12.5%;"></div>
      </div>
    </div>

    <div class="executive-showcase" id="executive-showcase">
      <div class="exec-profile">
        <div class="exec-photo-container">
          <img src="board_pics/David.jpg" alt="דוד דור" class="exec-photo" id="exec-photo" />
        </div>
        <div class="exec-info">
          <h2 class="exec-name" id="exec-name">דוד דור</h2>
          <div class="exec-title" id="exec-title">Chief Executive Officer | מנכ"ל</div>
          <p class="exec-description" id="exec-description">
            דוד דור עומד בחזית הפירמה מאז היום הראשון, ומוביל אותה במשך 28 שנים עם אינטליגנציה רגשית ועם דיוק קר ברגעי משא ומתן. הוא מחבר בין קריאות שוק מהירות, עם תמחור מדויק ועם סגירת עסקאות ברף הגבוה בענף.
          </p>
          <div class="exec-skills" id="exec-skills">
            <div class="skill-chip">Strategic Leadership</div>
            <div class="skill-chip">Market Intelligence</div>
            <div class="skill-chip">Deal Negotiation</div>
            <div class="skill-chip">28 Years Experience</div>
          </div>
        </div>
      </div>
    </div>

    <div class="navigation-controls">
        <button class="nav-btn" onclick="DorTeam.prev()" aria-label="Previous">‹</button>
      <div class="team-dots" id="team-dots"></div>
        <button class="nav-btn" onclick="DorTeam.next()" aria-label="Next">›</button>
    </div>
  </div>
</div>

  `
  },
  // קריירה ב-Dor Israel
  join: {
    title: "Shape The Future | עצב את העתיד",
    content: `
      <style>
        .quantum-career {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
          padding: 0;
          margin: -2rem;
          min-height: 80vh;
        }
        
        .quantum-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #00ff88;
          border-radius: 50%;
          opacity: 0.7;
          animation: quantumFloat 4s infinite linear;
        }
        
        .particle:nth-child(2n) { background: #0084ff; animation-delay: -1s; }
        .particle:nth-child(3n) { background: #ff6b6b; animation-delay: -2s; }
        .particle:nth-child(4n) { background: #feca57; animation-delay: -3s; }
        
        @keyframes quantumFloat {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        
        .career-content {
          position: relative;
          z-index: 10;
          padding: 3rem 2rem;
          backdrop-filter: blur(5px);
        }
        
        .quantum-hero {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .quantum-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #00ff88, #0084ff, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          animation: quantumPulse 2s infinite alternate;
        }
        
        @keyframes quantumPulse {
          0% { transform: scale(1); filter: brightness(1); }
          100% { transform: scale(1.02); filter: brightness(1.2); }
        }
        
        .quantum-subtitle {
          font-size: 1.2rem;
          color: #b0b3b8;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        
        .opportunities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .opportunity-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 15px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .opportunity-card:hover {
          transform: translateY(-5px);
          border-color: #00ff88;
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
        }
        
        .opportunity-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00ff88, #0084ff, #ff6b6b);
          z-index: -1;
          border-radius: 15px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .opportunity-card:hover::before {
          opacity: 1;
        }
        
        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #00ff88;
        }
        
        .card-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }
        
        .card-description {
          color: #b0b3b8;
          line-height: 1.5;
          font-size: 0.95rem;
        }
        
        .skills-section {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          padding: 2rem;
          margin: 3rem 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .skills-title {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 2rem;
          color: #ffffff;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .skill-tag {
          background: linear-gradient(45deg, rgba(0, 255, 136, 0.1), rgba(0, 132, 255, 0.1));
          border: 1px solid rgba(0, 255, 136, 0.3);
          padding: 0.8rem 1rem;
          border-radius: 25px;
          text-align: center;
          color: #ffffff;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .skill-tag:hover {
          background: linear-gradient(45deg, rgba(0, 255, 136, 0.2), rgba(0, 132, 255, 0.2));
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
        }
        
        .cta-section {
          text-align: center;
          margin-top: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .quantum-cta {
          background: linear-gradient(45deg, #00ff88, #0084ff);
          border: none;
          padding: 1rem 3rem;
          border-radius: 30px;
          color: #000;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin: 0.5rem;
        }
        
        .quantum-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 255, 136, 0.4);
        }
        
        .quantum-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .quantum-cta:hover::before {
          left: 100%;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
          text-align: center;
        }
        
        .stat-item {
          padding: 1rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #00ff88;
          display: block;
        }
        
        .stat-label {
          color: #b0b3b8;
          font-size: 0.9rem;
        }
      </style>
      
      <div class="quantum-career">
        <!-- Quantum Particle Background -->
        <div class="quantum-particles">
          <div class="particle" style="left: 10%; animation-duration: 3s;"></div>
          <div class="particle" style="left: 20%; animation-duration: 4s;"></div>
          <div class="particle" style="left: 30%; animation-duration: 5s;"></div>
          <div class="particle" style="left: 40%; animation-duration: 3.5s;"></div>
          <div class="particle" style="left: 50%; animation-duration: 4.5s;"></div>
          <div class="particle" style="left: 60%; animation-duration: 3.8s;"></div>
          <div class="particle" style="left: 70%; animation-duration: 4.2s;"></div>
          <div class="particle" style="left: 80%; animation-duration: 5.5s;"></div>
          <div class="particle" style="left: 90%; animation-duration: 3.2s;"></div>
        </div>
        
        <div class="career-content">
          <!-- Hero Section -->
          <div class="quantum-hero">
            <h1 class="quantum-title">הדור הבא של הנדל"ן</h1>
            <p class="quantum-subtitle">
              בואו תהיו חלק מהמהפכה שמעצבת את עתיד הנדל"ן בישראל. 
              אנחנו מחפשים חזונאים, חדשנים ומובילי שינוי שרוצים לבנות משהו גדול.
            </p>
            
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">5B+</span>
                <span class="stat-label">₪ בעסקאות</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">5,000+</span>
                <span class="stat-label">לקוחות מרוצים</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">25+</span>
                <span class="stat-label">פרויקטים פעילים</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">250+</span>
                <span class="stat-label">נכסים בשיווק</span>
              </div>
            </div>
          </div>
          
          <!-- Opportunities -->
          <div class="opportunities-grid">
            <div class="opportunity-card">
              <div class="card-icon">🚀</div>
              <h3 class="card-title">Real Estate Innovation</h3>
              <p class="card-description">
                הובל את המהפכה הטכנולוגית בנדל"ן. פתח פתרונות חדשניים שישנו את הדרך שבה אנשים קונים ומוכרים נכסים.
              </p>
            </div>
            
            <div class="opportunity-card">
              <div class="card-icon">💡</div>
              <h3 class="card-title">Strategic Partnerships</h3>
              <p class="card-description">
                בנה קשרים אסטרטגיים עם השחקנים המובילים בשוק. צור שותפויות שיניבו תוצאות מדהימות.
              </p>
            </div>
            
            <div class="opportunity-card">
              <div class="card-icon">📊</div>
              <h3 class="card-title">Data-Driven Growth</h3>
              <p class="card-description">
                השתמש בביג דאטה ובינה מלאכותית כדי לזהות הזדמנויות חדשות ולהוביל את השוק קדימה.
              </p>
            </div>
            
            <div class="opportunity-card">
              <div class="card-icon">🎯</div>
              <h3 class="card-title">Market Leadership</h3>
              <p class="card-description">
                הובל פרויקטים פורצי דרך שיקבעו את הסטנדרטים החדשים של התעשייה בישראל ובעולם.
              </p>
            </div>
          </div>
          
          <!-- Skills Section -->
          <div class="skills-section">
            <h2 class="skills-title">What We're Looking For</h2>
            <div class="skills-grid">
              <div class="skill-tag">חשיבה אסטרטגית</div>
              <div class="skill-tag">מנהיגות טבעית</div>
              <div class="skill-tag">יכולות אנליטיות</div>
              <div class="skill-tag">חדשנות דיגיטלית</div>
              <div class="skill-tag">ניהול פרויקטים</div>
              <div class="skill-tag">תקשורת מצוינת</div>
              <div class="skill-tag">חזון עסקי</div>
              <div class="skill-tag">מוטיבציה עצמית</div>
            </div>
          </div>
          
          <!-- CTA Section -->
          <div class="cta-section">
            <h2 style="color: #ffffff; margin-bottom: 1rem;">Ready to Build the Future?</h2>
            <p style="color: #b0b3b8; margin-bottom: 2rem;">
              אם אתה מוכן לקחת את הקריירה שלך לשלב הבא ולהיות חלק ממשהו מהפכני, בוא נדבר.
            </p>
            <button class="quantum-cta contact" data-modal="contact" type="button">
              <i class="fas fa-rocket" style="margin-left: 0.5rem;"></i>
              Apply Now | הגש מועמדות
            </button>
            <button class="quantum-cta" onclick="window.open('https://wa.me/972505534488?text=היי, אני מעוניין לשמוע עוד על הזדמנויות קריירה ב-Dor Israel', '_blank')" style="background: linear-gradient(45deg, #25d366, #128c7e);">
              <i class="fab fa-whatsapp" style="margin-left: 0.5rem;"></i>
              WhatsApp Chat
            </button>
          </div>
        </div>
      </div>
      
      <script>
        // Initialize quantum effects
        setTimeout(() => {
          const particles = document.querySelectorAll('.particle');
          particles.forEach((particle, i) => {
            particle.style.animationDelay = (i * 0.3) + 's';
            particle.style.left = Math.random() * 100 + '%';
          });
          
          // Add interactive hover effects
          const cards = document.querySelectorAll('.opportunity-card');
          cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
              card.style.transform = 'translateY(-8px) rotateX(5deg)';
            });
            card.addEventListener('mouseleave', () => {
              card.style.transform = 'translateY(0) rotateX(0)';
            });
          });
        }, 100);
      </script>
    `,
  },

  /// LEFT OF LOGO

  // ליזמים
  assets: {
  title: "ליזמים",
  content: `
    <style>
      .developer-portal {
        background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #0f0f0f 100%);
        color: #ffffff;
        position: relative;
        overflow: hidden;
        padding: 0;
        margin: -2rem;
        min-height: 100vh;
        direction: rtl;
        font-family: 'Heebo', Arial, sans-serif;
      }
      
      .background-section {
        background: linear-gradient(135deg, #FF7A00 0%, #FF4D00 100%);
        padding: 4rem 2rem;
        text-align: center;
        position: relative;
      }
      
      .background-section::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to bottom, transparent, #2c2c2c);
      }
      
      .background-title {
        font-size: 3.2rem;
        font-weight: 900;
        color: white;
        margin-bottom: 1.5rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      
      .background-text {
        font-size: 1.4rem;
        color: rgba(255,255,255,0.95);
        max-width: 900px;
        margin: 0 auto;
        line-height: 1.6;
        font-weight: 500;
      }
      
      .main-content {
        padding: 2rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .vision-mission {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin: 2rem 0;
      }
      
      @media (max-width: 768px) {
        .vision-mission { grid-template-columns: 1fr; }
      }
      
      .bracket-block {
        position: relative;
        padding: 2.5rem;
        background: rgba(255, 122, 0, 0.05);
        border-radius: 8px;
      }
      
      .bracket-block::before {
        content: '[';
        position: absolute;
        top: 0;
        right: 0;
        font-size: 4rem;
        color: #FF7A00;
        font-weight: 900;
        line-height: 1;
      }
      
      .bracket-block::after {
        content: ']';
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 4rem;
        color: #FF7A00;
        font-weight: 900;
        line-height: 1;
      }
      
      .bracket-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: #FF7A00;
        margin-bottom: 1rem;
      }
      
      .bracket-content {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #e0e0e0;
      }
      

      .stats-section {
        margin: 2rem 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
        width: 100%;          /* use the full .main-content width */
        max-width: none;      /* remove the 1000px cap */
        margin: 2rem 0;       /* no auto-centering */
        text-align: center;
        direction: rtl;       /* first card starts at the right edge */
      }
 
      @media (max-width: 768px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
      }
      
      .stat-item {
        background: linear-gradient(135deg, rgba(255, 122, 0, 0.1), rgba(255, 77, 0, 0.1));
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        border: 1px solid rgba(255, 122, 0, 0.2);
      }
      
      .stat-number {
        font-size: 2.5rem;
        font-weight: 900;
        color: #FF7A00;
        display: block;
        margin-bottom: 0.5rem;
      }
      
      .stat-label {
        font-size: 1rem;
        color: #b0b0b0;
        font-weight: 600;
      }
      
      .projects-section {
        margin: 2rem 0;
      }
      
      .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #FF7A00;
        margin-bottom: 2rem;
        text-align: center;
      }
      
      .projects-slider {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
      }
      
      .projects-track {
        display: flex;
        transition: transform 0.3s ease;
        gap: 1rem;
        padding: 0 1rem;
        /* FIX: make slider physics LTR so translateX(-N) always moves left */
        direction: ltr;
      }
      
      .project-slide {
        flex: 0 0 300px;
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .project-slide:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(255, 122, 0, 0.3);
      }
      
      .project-slide img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      .project-slide:hover img {
        transform: scale(1.05);
      }
      
      .project-info {
        padding: 1.5rem;
        text-align: center;
      }
      
      .project-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: #e0e0e0;
        margin-bottom: 0.5rem;
      }
      
      .project-status {
        display: inline-block;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      
      .project-status.sold {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
      }
      
      .project-status.active {
        background: rgba(255, 122, 0, 0.2);
        color: #FF7A00;
        border: 1px solid rgba(255, 122, 0, 0.4);
      }
      
      .slider-controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
      }
      
      .slider-btn {
        background: rgba(255, 122, 0, 0.1);
        border: 1px solid rgba(255, 122, 0, 0.3);
        color: #FF7A00;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
      }
      
      .slider-btn:hover {
        background: rgba(255, 122, 0, 0.2);
        transform: translateY(-2px);
      }
      
      .slider-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .service-model {
        margin: 2rem 0;
      }
      
      .pillars-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin: 2rem 0;
      }
      
      @media (max-width: 768px) {
        .pillars-grid { grid-template-columns: 1fr; }
      }
      
      .pillar-bracket {
        position: relative;
        padding: 2rem;
        background: rgba(255, 122, 0, 0.05);
        border-radius: 8px;
      }
      
      .pillar-bracket::before {
        content: '{';
        position: absolute;
        top: 0;
        right: 0;
        font-size: 3rem;
        color: #FF7A00;
        font-weight: 900;
        line-height: 1;
      }
      
      .pillar-bracket::after {
        content: '}';
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 3rem;
        color: #FF7A00;
        font-weight: 900;
        line-height: 1;
      }
      
      .pillar-title {
        font-size: 1.6rem;
        font-weight: 800;
        color: #FF7A00;
        margin-bottom: 1rem;
      }
      
      .pillar-content {
        font-size: 1rem;
        line-height: 1.5;
        color: #d0d0d0;
      }
      
      .marketing-system {
        margin: 2rem 0;
      }
      
      .steps-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .step-item {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        border: 1px solid rgba(255, 122, 0, 0.2);
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .step-header {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        cursor: pointer;
        background: rgba(255, 122, 0, 0.05);
      }
      
      .step-header:hover {
        background: rgba(255, 122, 0, 0.1);
      }
      
      .step-number {
        background: linear-gradient(135deg, #FF7A00, #FF4D00);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 1.2rem;
        margin-left: 1rem;
      }
      
      .step-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: #ffffff;
        flex-grow: 1;
      }
      
      .step-toggle {
        color: #FF7A00;
        font-size: 1.5rem;
        transition: transform 0.3s ease;
      }
      
      .step-content {
        padding: 0 1.5rem;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
      }
      
      .step-content.expanded {
        max-height: 300px;
        padding: 1.5rem;
      }
      
      .step-description {
        color: #ffffff;
        line-height: 1.6;
      }
      
      .cta-section {
        background: linear-gradient(135deg, #FF7A00 0%, #FF4D00 100%);
        padding: 2rem;
        text-align: center;
        margin: 2rem -2rem -2rem -2rem;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 300px;
      }
      
      .cta-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to top, transparent, #2c2c2c);
        transform: translateY(-20px);
      }
      
      .cta-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: white;
        margin-bottom: 1rem;
        margin-top: -2rem;
      }
      
      .cta-button {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 2px solid white;
        padding: 1.2rem 3rem;
        border-radius: 8px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      
      .cta-button:hover {
        background: white;
        color: #FF4D00;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
    </style>
    
    <div class="developer-portal">
      <!-- Background Section -->
      <div class="background-section">
        <h1 class="background-title">קבוצת דור נכסים</h1>
        <p class="background-text">
        מזה כשלושה עשורים, אנו מובילים את שוק הנדל"ן בגוש דן, מציבים סטנדרט של מצוינות ומעניקים ליזמים מעטפת שיווקית שלמה ומגוונת.
        </p>
      </div>
      
      <div class="main-content">
        <!-- Vision & Mission -->
        <div class="vision-mission">
          <div class="bracket-block">
            <h3 class="bracket-title">חזון</h3>
            <p class="bracket-content">
              להיות השותף הבלעדי ליזמים מובילים. לייצר סיפורי הצלחה נדל"ניים שמגדירים מחדש את הסטנדרט בתחום.
            </p>
          </div>
          
          <div class="bracket-block">
            <h3 class="bracket-title">משימה</h3>
            <p class="bracket-content">
              לרתום את המערכת השיווקית הייחודית שלנו ליצירת הפרויקט המצליח הבא שלכם. כל עסקה היא התחייבות אישית למצוינות.
            </p>
          </div>
        </div>
        
        <!-- Stats Section -->
        <div class="stats-section">
          <h2 class="section-title">במספרים</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">5B+</span>
              <span class="stat-label">₪ בעסקאות</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5,000+</span>
              <span class="stat-label">לקוחות מרוצים</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">25+</span>
              <span class="stat-label">פרויקטים פעילים</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">250+</span>
              <span class="stat-label">נכסים משווקים</span>
            </div>
          </div>
        </div>
        
        <!-- Flagship Projects -->
        <div class="projects-section">
          <h2 class="section-title">פרויקטי דגל</h2>
          <div class="projects-slider" id="projectsSlider">
            <div class="projects-track" id="projectsTrack">
              <!-- Sold Projects -->
              <div class="project-slide">
                <img src="firm_projects/hamaayan_7_givatayim.png" alt="המעיין 7, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">המעיין 7, גבעתיים</div>
                  <div class="project-status sold">נמכר</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects/yitzchak_sade_3_givatayim.jpg" alt="יצחק שדה 3, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">יצחק שדה 3, גבעתיים</div>
                  <div class="project-status sold">נמכר</div>
                </div>
              </div>
              
              <!-- Active Projects -->
              <div class="project-slide">
                <img src="firm_projects/golomb_54_givatayim.jpeg" alt="גולומב 54, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">גולומב 54, גבעתיים</div>
                  <div class="project-status active">פעיל</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects/yitzchak_sade_5_givatayim.jpg" alt="יצחק שדה 5, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">יצחק שדה 5, גבעתיים</div>
                  <div class="project-status active">פעיל</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects/zabo_37_givatayim.jpg" alt="ז'בוטינסקי 37, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ז'בוטינסקי 37, גבעתיים</div>
                  <div class="project-status active">פעיל</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects/reines_23_givatayim.jpg" alt="ריינס 23, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ריינס 23, גבעתיים</div>
                  <div class="project-status active">פעיל</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects/yitzchak_sade_7_givatayim.jpg" alt="יצחק שדה 7, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">יצחק שדה 7, גבעתיים</div>
                  <div class="project-status active">פעיל</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects/berdiv_37_givatayim.jpg" alt="ברדיצ'בסקי 37, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ברדיצ'בסקי 37, גבעתיים</div>
                  <div class="project-status active">פעיל</div>
                </div>
              </div>
            </div>
          </div>
          <div class="slider-controls">
            <button class="slider-btn" id="prevBtn">← הקודם</button>
            <button class="slider-btn" id="nextBtn">הבא →</button>
          </div>
        </div>
        
        <!-- 360° Service Model -->
        <div class="service-model">
          <h2 class="section-title">מודל השירות 360°</h2>
          <div class="pillars-grid">
            <div class="pillar-bracket">
              <h3 class="pillar-title">שיווק קוונטי</h3>
              <p class="pillar-content">
              מחקר שוק מעמיק וזיהוי מאפייני הצלחה ייחודיים.
              אסטרטגיה שיווקית מדויקת המותאמת לפרויקט, לעידן ה-AI ולעולם ה-Big Data.
              </p>
            </div>
            
            <div class="pillar-bracket">
              <h3 class="pillar-title">תשתית טרנזקציות</h3>
              <p class="pillar-content">
                צוות מכירות מומחה ומשרד מכירות יוקרתי.
                בסיס נתונים של אלפי לקוחות פוטנציאליים.
              </p>
            </div>
            
            <div class="pillar-bracket">
              <h3 class="pillar-title">קפיטל אנושי</h3>
              <p class="pillar-content">
                מעטפת אינטלקטואלית יוצאת דופן עם שאיפה למצוינות.
                יחידה מובחרת העובדת סביב השעון על הפרויקט.
              </p>
            </div>
            
            <div class="pillar-bracket">
              <h3 class="pillar-title">אופטימיזציית תהליכים</h3>
              <p class="pillar-content">
                מערכת ניהול ומעקב מתקדמת אחר כל לקוח.
                דוחות שקופים וליווי עד סגירת העסקה.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Marketing System -->
        <div class="marketing-system">
          <h2 class="section-title">מערכת השיווק</h2>
          <div class="steps-container">
            <div class="step-item">
              <div class="step-header" onclick="toggleStep(this)">
                <div class="step-number">01</div>
                <div class="step-title">איתור הזדמנויות</div>
                <div class="step-toggle">+</div>
              </div>
              <div class="step-content">
                <div class="step-description">
                  בדיקה מעמיקה של רמות המחירים באזור, מיפוי המתחרים בהווה ובעתיד, פילוח ואיפיון קהלי היעד. זיהוי הערך המוסף הייחודי של הפרויקט והתנגדויות פוטנציאליות.
                </div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-header" onclick="toggleStep(this)">
                <div class="step-number">02</div>
                <div class="step-title">בניית אסטרטגיה</div>
                <div class="step-toggle">+</div>
              </div>
              <div class="step-content">
                <div class="step-description">  
                  בניית תוכנית שיווקית מותאמת-דאטה, הכוללת תקציבי פרסום מדויקים, הקצאת צוותי מכירה ייעודיים, KPI’s ברורים ולוחות זמנים דינמיים. הגדרת אופי וסוג הפרסום מבוססי אנליטיקה.
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-header" onclick="toggleStep(this)">
                <div class="step-number">03</div>
                <div class="step-title">אפיון מעמיק</div>
                <div class="step-toggle">+</div>
              </div>
              <div class="step-content">
                <div class="step-description">
                  תכנון המפרט, מאפייני הבניין ותמהיל הדירות הנכונים ביותר להצלחת הפרויקט בשיתוף היזם והאדריכל.
                </div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-header" onclick="toggleStep(this)">
                <div class="step-number">04</div>
                <div class="step-title">עיצוב זהות חזותית</div>
                <div class="step-toggle">+</div>
              </div>
              <div class="step-content">
                <div class="step-description">
                  עבודה עם חברות המיתוג המובילות בנדל"ן, יצירת זהות ויזואלית ייחודית ובניית קמפיין פרסומי מבוסס תוצאות.
                </div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-header" onclick="toggleStep(this)">
                <div class="step-number">05</div>
                <div class="step-title">אקסלרציית מכירות</div>
                <div class="step-toggle">+</div>
              </div>
              <div class="step-content">
                <div class="step-description">
                  העברת הפרויקט לצוות מכירות מוכשר לאחר תהליך חפיפה מעמיק וכלים מתקדמים לטיפול בהתנגדויות.
                </div>
              </div>
            </div>
            
            <div class="step-item">
              <div class="step-header" onclick="toggleStep(this)">
                <div class="step-number">06</div>
                <div class="step-title">ניהול ביצועים</div>
                <div class="step-toggle">+</div>
              </div>
              <div class="step-content">
                <div class="step-description">
                  מעקב רציף אחר ביצועים, אופטימיזציה של קמפיינים ודוחות שבועיים מפורטים. ליווי מו"מ משפטי עד סגירת העסקה. ניתוח בזמן אמת של כל נתוני המכירה.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA Section -->
      <div class="cta-section">
        <h2 class="cta-title">בואו נבנה את סיפור ההצלחה הבא</h2>
        <button class="cta-button" data-modal="contact">
          הצטרפו ליזמים שכבר איתנו
        </button>
      </div>
    </div>
    
    <script>
      // Global function for marketing system toggle
      window.toggleStep = function(header) {
        const content = header.nextElementSibling;
        const toggle = header.querySelector('.step-toggle');
        const isExpanded = content.classList.contains('expanded');
        
        // Close all other steps
        const portal = document.querySelector('.developer-portal');
        if (portal) {
          portal.querySelectorAll('.step-content.expanded').forEach(item => {
            if (item !== content) {
              item.classList.remove('expanded');
              const prevToggle = item.previousElementSibling.querySelector('.step-toggle');
              if (prevToggle) prevToggle.textContent = '+';
            }
          });
        }
        
        // Toggle current step
        if (isExpanded) {
          content.classList.remove('expanded');
          toggle.textContent = '+';
        } else {
          content.classList.add('expanded');
          toggle.textContent = '−';
        }
      };
      
      // Initialize developer portal functionality when modal opens
      setTimeout(() => {
        const initDeveloperPortal = () => {
          const portal = document.querySelector('.developer-portal');
          if (!portal) return;
          
          // Projects slider functionality (FIXED)
          const track = document.getElementById('projectsTrack');
          const prevBtn = document.getElementById('prevBtn');
          const nextBtn = document.getElementById('nextBtn');
          
          if (track && prevBtn && nextBtn) {
            let currentIndex = 0;
            const slides = Array.from(track.children).filter(el => el.classList.contains('project-slide'));
            const totalSlides = slides.length;

            function parseGap(cs) {
              const raw = cs.gap || cs.columnGap || '16px';
              const n = parseFloat(raw);
              return Number.isFinite(n) ? n : 16;
            }

            function getSizes() {
              const first = slides[0];
              const slideWidth = first ? first.getBoundingClientRect().width : 300;
              const gap = parseGap(getComputedStyle(track));
              const containerWidth = track.parentElement.getBoundingClientRect().width;

              // how many full slides fit
              const slidesPerView = Math.max(1, Math.floor((containerWidth + gap) / (slideWidth + gap)));
              const maxIndex = Math.max(0, totalSlides - slidesPerView);

              return { slideWidth, gap, slidesPerView, maxIndex };
            }

            function updateSlider() {
              const { slideWidth, gap, maxIndex } = getSizes();

              if (currentIndex < 0) currentIndex = 0;
              if (currentIndex > maxIndex) currentIndex = maxIndex;

              // track is forced LTR in CSS, so negative X moves left to reveal next slides
              const offset = currentIndex * (slideWidth + gap);
              track.style.transform = 'translateX(' + (-offset) + 'px)';

              prevBtn.disabled = currentIndex === 0;
              nextBtn.disabled = currentIndex >= maxIndex;
            }
            
            prevBtn.onclick = () => { currentIndex--; updateSlider(); };
            nextBtn.onclick = () => { currentIndex++; updateSlider(); };

            // Keep indices correct on resize
            if (window.ResizeObserver) {
              const ro = new ResizeObserver(updateSlider);
              ro.observe(track.parentElement);
            } else {
              window.addEventListener('resize', updateSlider);
            }

            // Initialize after paint
            requestAnimationFrame(updateSlider);
          }
        };
        
        // Try to initialize immediately and also after a short delay
        initDeveloperPortal();
        setTimeout(initDeveloperPortal, 100);
      }, 50);
    </script>
  `,
  },
  // פרויקטים
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

        /* شכבת כהות בפרויקטים רגילים – רק בהובר */
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
    // צור קשר
  contact: {
    title: "Communication Hub | מרכז תקשורת",
    content: `
      <style>
        .quantum-contact {
          background: linear-gradient(135deg, #0a0a1a 0%, #001a33 50%, #003d66 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
          padding: 0;
          margin: -2rem;
          min-height: 85vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .contact-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        
        .contact-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #00bcd4;
          border-radius: 50%;
          opacity: 0.7;
          animation: contactFloat 8s infinite linear;
        }
        
        .contact-particle:nth-child(2n) { 
          background: #4fc3f7; 
          animation-delay: -1s; 
          animation-duration: 6s;
        }
        .contact-particle:nth-child(3n) { 
          background: #ff8a65; 
          animation-delay: -3s; 
          animation-duration: 7s;
        }
        .contact-particle:nth-child(4n) { 
          background: #ff7043; 
          animation-delay: -2s; 
          animation-duration: 9s;
        }
        .contact-particle:nth-child(5n) { 
          background: #ff5722; 
          animation-delay: -4s; 
          animation-duration: 5s;
        }
        
        @keyframes contactFloat {
          0% { 
            transform: translateY(100vh) translateX(-30px) scale(0) rotate(0deg); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.7; 
            transform: scale(1); 
          }
          90% { 
            opacity: 0.7; 
          }
          100% { 
            transform: translateY(-100px) translateX(30px) scale(0) rotate(360deg); 
            opacity: 0; 
          }
        }
        
        .contact-content {
          position: relative;
          z-index: 10;
          padding: 2rem;
          backdrop-filter: blur(3px);
        }
        
        .contact-hero {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .contact-title {
          font-size: 2.8rem;
          font-weight: 700;
          background: linear-gradient(45deg, #00bcd4, #4fc3f7, #ff8a65);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          animation: contactPulse 3s infinite alternate;
          text-shadow: 0 0 30px rgba(0, 188, 212, 0.3);
        }
        
        @keyframes contactPulse {
          0% { 
            transform: scale(1) rotateY(0deg); 
            filter: brightness(1); 
          }
          100% { 
            transform: scale(1.03) rotateY(2deg); 
            filter: brightness(1.2); 
          }
        }
        
        .contact-subtitle {
          font-size: 1.2rem;
          color: #b3e5fc;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        .communication-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .contact-methods {
          background: rgba(0, 188, 212, 0.03);
          border: 1px solid rgba(0, 188, 212, 0.2);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        
        .contact-methods:hover {
          border-color: #00bcd4;
          box-shadow: 0 10px 30px rgba(0, 188, 212, 0.2);
          transform: translateY(-5px);
        }
        
        .methods-title {
          font-size: 1.5rem;
          color: #00bcd4;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
        
        .method-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 15px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .method-item:hover {
          background: rgba(0, 188, 212, 0.1);
          transform: translateX(10px);
          box-shadow: 0 5px 15px rgba(0, 188, 212, 0.15);
        }
        
        .method-icon {
          font-size: 1.8rem;
          color: #ff8a65;
          min-width: 40px;
          text-align: center;
          text-shadow: 0 0 10px rgba(255, 138, 101, 0.5);
        }
        
        .method-details {
          flex: 1;
        }
        
        .method-label {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.3rem;
        }
        
        .method-value {
          color: #4fc3f7;
          font-size: 0.95rem;
          direction: ltr;
          text-align: left;
        }
        
        .contact-form-section {
          background: rgba(255, 138, 101, 0.03);
          border: 1px solid rgba(255, 138, 101, 0.2);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        
        .contact-form-section:hover {
          border-color: #ff8a65;
          box-shadow: 0 10px 30px rgba(255, 138, 101, 0.2);
          transform: translateY(-5px);
        }
        
        .form-title {
          font-size: 1.5rem;
          color: #ff8a65;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
        
        .quantum-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .input-group {
          position: relative;
        }
        
        .quantum-input, .quantum-textarea {
          width: 100%;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 188, 212, 0.3);
          border-radius: 15px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
        }
        
        .quantum-input::placeholder, .quantum-textarea::placeholder {
          color: #4fc3f7;
          opacity: 0.7;
        }
        
        .quantum-input:focus, .quantum-textarea:focus {
          outline: none;
          border-color: #00bcd4;
          box-shadow: 
            0 0 20px rgba(0, 188, 212, 0.3),
            inset 0 0 20px rgba(0, 188, 212, 0.1);
          transform: scale(1.02);
          background: rgba(255, 255, 255, 0.08);
        }
        
        .quantum-input:valid, .quantum-textarea:valid {
          border-color: #ff8a65;
          box-shadow: 0 0 15px rgba(255, 138, 101, 0.2);
        }
        
        .quantum-input:invalid:not(:placeholder-shown), 
        .quantum-textarea:invalid:not(:placeholder-shown) {
          border-color: #ff5722;
          box-shadow: 0 0 15px rgba(255, 87, 34, 0.3);
        }
        
        .submit-btn {
          background: linear-gradient(45deg, #00bcd4, #ff8a65);
          border: none;
          padding: 1rem 3rem;
          border-radius: 25px;
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          align-self: center;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        
        .submit-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 
            0 10px 25px rgba(0, 188, 212, 0.3),
            0 0 30px rgba(255, 138, 101, 0.2);
          background: linear-gradient(45deg, #4fc3f7, #ff7043);
        }
        
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .submit-btn:hover::before {
          left: 100%;
        }
        
        .contact-methods-quick {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .quick-contact-btn {
          background: rgba(0, 188, 212, 0.1);
          border: 1px solid rgba(0, 188, 212, 0.3);
          border-radius: 15px;
          padding: 1rem;
          color: #ffffff;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quick-contact-btn:hover {
          background: rgba(0, 188, 212, 0.2);
          border-color: #00bcd4;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 188, 212, 0.25);
        }
        
        .quick-contact-icon {
          font-size: 1.5rem;
          color: #ff8a65;
        }
        
        .quick-contact-text {
          font-size: 0.9rem;
          color: #4fc3f7;
          font-weight: 500;
        }
        
        .success-message {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(45deg, #00bcd4, #4fc3f7);
          color: #ffffff;
          padding: 2rem 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 188, 212, 0.3);
          z-index: 1000;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
          transition: all 0.4s ease;
        }
        
        .success-message.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .quantum-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: quantumGlow 6s infinite ease-in-out;
          z-index: 2;
        }
        
        @keyframes quantumGlow {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.3; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.5); 
            opacity: 0.1; 
          }
        }
        
        @media (max-width: 768px) {
          .contact-title {
            font-size: 2.2rem;
          }
          
          .communication-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .contact-content {
            padding: 1.5rem;
          }
          
          .contact-methods,
          .contact-form-section {
            padding: 1.5rem;
          }
          
          .method-item {
            padding: 0.8rem;
          }
          
          .contact-methods-quick {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .contact-title {
            font-size: 1.8rem;
          }
          
          .contact-methods-quick {
            grid-template-columns: 1fr;
          }
          
          .method-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
        }
      </style>
      
      <div class="quantum-contact">
        <!-- Background Elements -->
        <div class="quantum-glow"></div>
        
        <!-- Floating Particles -->
        <div class="contact-particles">
          <div class="contact-particle" style="left: 10%; animation-duration: 7s;"></div>
          <div class="contact-particle" style="left: 20%; animation-duration: 8s;"></div>
          <div class="contact-particle" style="left: 30%; animation-duration: 6s;"></div>
          <div class="contact-particle" style="left: 40%; animation-duration: 9s;"></div>
          <div class="contact-particle" style="left: 50%; animation-duration: 5s;"></div>
          <div class="contact-particle" style="left: 60%; animation-duration: 7.5s;"></div>
          <div class="contact-particle" style="left: 70%; animation-duration: 6.5s;"></div>
          <div class="contact-particle" style="left: 80%; animation-duration: 8.5s;"></div>
          <div class="contact-particle" style="left: 90%; animation-duration: 5.5s;"></div>
        </div>
        
        <div class="contact-content">
          <!-- Hero Section -->
          <div class="contact-hero">
            <h1 class="contact-title">Communication Hub</h1>
            <p class="contact-subtitle">
              המסלול שלך מתחיל כאן.
            </p>
          </div>
          
          <!-- Main Communication Grid -->
          <div class="communication-grid">
            <!-- Contact Information -->
            <div class="contact-methods">
              <h3 class="methods-title">📡 Contact Information</h3>
              
              <div class="method-item" onclick="copyToClipboard('ויצמן 37, גבעתיים')">
                <div class="method-icon">📍</div>
                <div class="method-details">
                  <div class="method-label">כתובת</div>
                  <div class="method-value">ויצמן 37, גבעתיים</div>
                </div>
              </div>
              
              <div class="method-item" onclick="callPhone('050-5534488')">
                <div class="method-icon">📞</div>
                <div class="method-details">
                  <div class="method-label">טלפון</div>
                  <div class="method-value">050-5534488</div>
                </div>
              </div>
              
              <div class="method-item" onclick="sendEmail('inquiries@dorealestate.com')">
                <div class="method-icon">📧</div>
                <div class="method-details">
                  <div class="method-label">אימייל</div>
                  <div class="method-value">inquiries@dorealestate.com</div>
                </div>
              </div>
              
              <!-- Quick Contact Methods -->
              <div class="contact-methods-quick">
                <div class="quick-contact-btn" onclick="callPhone('050-5534488')">
                  <div class="quick-contact-icon">📱</div>
                  <div class="quick-contact-text">התקשר עכשיו</div>
                </div>
                
                <div class="quick-contact-btn" onclick="openWhatsApp('972505534488')">
                  <div class="quick-contact-icon">💬</div>
                  <div class="quick-contact-text">WhatsApp</div>
                </div>
              </div>
            </div>
            
            <!-- Contact Form -->
            <div class="contact-form-section">
              <h3 class="form-title">🚀 Send Message</h3>
              
              <form id="contactForm" class="quantum-form">
                <div class="input-group">
                  <input 
                    id="contactName" 
                    type="text" 
                    placeholder="שם מלא *"
                    class="quantum-input"
                    required>
                </div>
                
                <div class="input-group">
                  <input 
                    id="contactEmail" 
                    type="email" 
                    placeholder="כתובת אימייל *"
                    class="quantum-input"
                    required>
                </div>
                
                <div class="input-group">
                  <input 
                    id="contactPhone" 
                    type="tel" 
                    placeholder="מספר טלפון"
                    class="quantum-input">
                </div>
                
                <div class="input-group">
                  <textarea 
                    id="contactMsg" 
                    placeholder="הודעה *" 
                    rows="4"
                    class="quantum-textarea"
                    required></textarea>
                </div>
                
                <button type="submit" class="submit-btn">
                  🚀 שלח הודעה
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Success Message Template -->
        <div id="successMessage" class="success-message">
          ✅ ההודעה נשלחה בהצלחה!<br>
          <small style="opacity: 0.8;">נחזור אליך בהקדם</small>
        </div>
      </div>
      
      <script>
        // Enhanced form submission with validation and success feedback
        document.getElementById("contactForm").addEventListener("submit", function(e) {
          e.preventDefault();
          
          // Get form values
          const name = document.getElementById("contactName").value.trim();
          const email = document.getElementById("contactEmail").value.trim();
          const phone = document.getElementById("contactPhone").value.trim();
          const message = document.getElementById("contactMsg").value.trim();
          
          // Basic validation
          if (!name || !email || !message) {
            showValidationError("אנא מלא את כל השדות הנדרשים");
            return;
          }
          
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            showValidationError("כתובת האימייל אינה תקינה");
            return;
          }
          
          // Show success message
          showSuccessMessage();
          
          // Reset form
          document.getElementById("contactForm").reset();
          
          // Redirect after success message
          setTimeout(() => {
            window.location.href = "/";
          }, 2500);
        });
        
        function showSuccessMessage() {
          const successMsg = document.getElementById("successMessage");
          successMsg.classList.add("show");
          
          setTimeout(() => {
            successMsg.classList.remove("show");
          }, 2000);
        }
        
        function showValidationError(message) {
          // Create temporary error message
          const errorDiv = document.createElement("div");
          errorDiv.style.cssText = \`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff5722, #ff7043);
            color: white;
            padding: 1rem 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(255, 87, 34, 0.3);
            z-index: 1001;
            font-weight: 600;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          \`;
          errorDiv.textContent = message;
          document.body.appendChild(errorDiv);
          
          // Show error
          setTimeout(() => errorDiv.style.opacity = "1", 100);
          
          // Hide and remove error
          setTimeout(() => {
            errorDiv.style.opacity = "0";
            setTimeout(() => document.body.removeChild(errorDiv), 300);
          }, 3000);
        }
        
        function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            showCopySuccess("כתובת הועתקה ללוח");
          }).catch(() => {
            showCopySuccess("כתובת: " + text);
          });
        }
        
        function callPhone(phone) {
          window.open(\`tel:\${phone}\`, '_self');
        }
        
        function sendEmail(email) {
          window.open(\`mailto:\${email}?subject=פנייה מאתר DorEstate\`, '_blank');
        }
        
        function openWhatsApp(phone) {
          const message = encodeURIComponent("שלום, אני מעוניין לקבל מידע נוסף על השירותים שלכם");
          window.open(\`https://wa.me/\${phone}?text=\${message}\`, '_blank');
        }
        
        function showCopySuccess(message) {
          const copyMsg = document.createElement("div");
          copyMsg.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #00bcd4, #4fc3f7);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 188, 212, 0.3);
            z-index: 1002;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
          \`;
          copyMsg.textContent = message;
          document.body.appendChild(copyMsg);
          
          // Show message
          setTimeout(() => {
            copyMsg.style.opacity = "1";
            copyMsg.style.transform = "translateX(0)";
          }, 100);
          
          // Hide and remove message
          setTimeout(() => {
            copyMsg.style.opacity = "0";
            copyMsg.style.transform = "translateX(100px)";
            setTimeout(() => document.body.removeChild(copyMsg), 300);
          }, 2500);
        }
        
        // Add real-time validation styling
        document.addEventListener('DOMContentLoaded', function() {
          const inputs = document.querySelectorAll('.quantum-input, .quantum-textarea');
          
          inputs.forEach(input => {
            input.addEventListener('input', function() {
              if (this.checkValidity() && this.value.trim()) {
                this.style.borderColor = '#ff8a65';
                this.style.boxShadow = '0 0 15px rgba(255, 138, 101, 0.2)';
              } else if (this.value.trim() && !this.checkValidity()) {
                this.style.borderColor = '#ff5722';
                this.style.boxShadow = '0 0 15px rgba(255, 87, 34, 0.3)';
              } else {
                this.style.borderColor = 'rgba(0, 188, 212, 0.3)';
                this.style.boxShadow = 'none';
              }
            });
            
            input.addEventListener('focus', function() {
              this.style.borderColor = '#00bcd4';
              this.style.boxShadow = '0 0 20px rgba(0, 188, 212, 0.3), inset 0 0 20px rgba(0, 188, 212, 0.1)';
            });
            
            input.addEventListener('blur', function() {
              if (!this.value.trim()) {
                this.style.borderColor = 'rgba(0, 188, 212, 0.3)';
                this.style.boxShadow = 'none';
              }
            });
          });
        });
      </script>
        `,
  },

  /////////////// BOTTOM-BAR

  // תנאי שימוש
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
                 עודכן לאחרונה: <span id="terms-updated">01/09/2025</span>
               </p>
             `,
  },
  // מדיניות פרטיות
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
                       עודכן לאחרונה: <span id="privacy-updated">01/09/2025</span>
                     </p>
                   `,
  },
  // נגישות
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
                           <p style="margin: .25rem 0;"><strong>טלפון:</strong> 050-5534488</p>
                           <p style="margin: .25rem 0;"><strong>דוא"ל:</strong> accessibility@dorealestate.com</p>
                           <p style="margin: .25rem 0;"><strong>ימי מענה:</strong> א'–ה', 9:00–17:00</p>
                         </div>
                       </div>

                       <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                         עודכן לאחרונה: <span id="accessibility-updated">01/09/2025</span>
                       </p>
                     `,
  },
  // כללי אתיקה
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
                  עודכן לאחרונה: <span id="ethics-updated">01/09/2025</span>
                </p>
              `,
  },

  // UNUSED CATEGORIES (for future use)

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
  }
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

    // 🔹 Init the Team widget when that modal is opened
    if (type === "team" && window.DorTeam && typeof window.DorTeam.init === "function") {
      // ensure DOM nodes are in place
      queueMicrotask(() => window.DorTeam.init());
      // (optional) bridge if your buttons still call the old handlers:
      window.switchExecutive = (dir) => (dir < 0 ? window.DorTeam.prev() : window.DorTeam.next());
      window.goToExecutive = (i) => window.DorTeam.goTo ? window.DorTeam.goTo(i) : null;
    }

    // (re)bind inside the modal
    initContactForm(modalContent);

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
      // Initialize developer portal functionality
      setTimeout(() => {
        initDeveloperPortal();
      }, 100);
    } catch (e) { console.warn(e); }
  }

  if (
    type === "team" || type === "join" || type === "knowledge" || type === "picks" ||
    type === "assets" || type === "projects" || type === "about" || type === "services" ||
    type === "contact" || type === "accessibility" || type === "privacy" ||
    type === "ethics" || type === "terms"
  ) {
    if (type === "about") { try { initAboutTimeline(); } catch (_) {} }
    if (type === "services") { try { initServicesTimeline(); } catch (_) {} }
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

// ---- Team widget (global, executed always) ----
window.DorTeam = (function () {
  const executiveData = [
    { name: "דוד דור", title: "Chief Executive Officer | מנכ\"ל", image: "board_pics/David.jpg",
      description: "דוד דור עומד בחזית הפירמה מאז היום הראשון, ומוביל אותה במשך 28 שנים עם אינטליגנציה רגשית ועם דיוק קר ברגעי משא ומתן. הוא מחבר בין קריאות שוק מהירות, עם תמחור מדויק ועם סגירת עסקאות ברף הגבוה בענף.",
      skills: ["Strategic Leadership", "Market Intelligence", "Deal Negotiation", "28 Years Experience"] },
    { name: "טליה קמינסקי", title: "Chief Sales Officer | סמנכ\"לית מכירות", image: "board_pics/Talya.jpg",
      description: "טליה קמינסקי היא הלב הפועם של הפירמה ברובד המכירות. בעברה היוות יזמית בתחומי המוזיקה והיצירה, והצליחה לשלב רבדים אנושיים עם מומחיות נדל\"נית באופן יוצא דופן.",
      skills: ["Sales Leadership", "Customer Experience", "Creative Strategy", "Human Psychology"] },
    { name: "דין דור", title: "Chief Financial Officer | סמנכ\"ל כספים", image: "board_pics/Din.jpeg",
      description: "דין דור גדל בתוך הפירמה והפך לעמוד תווך פיננסי עם אסטרטגיה מדויקת. הוא משלב חוש טבעי למנהיגות עם שליטה במספרים ובקיאות במיסוי ובניהול סיכונים.",
      skills: ["Financial Strategy", "Risk Management", "Tax Optimization", "Leadership"] },
    { name: "רויטל דור", title: "Chief Operations Officer | סמנכ\"לית תפעול", image: "board_pics/Revital.png",
      description: "רויטל דור מהווה, יחד עם דוד, את שלד הפירמה מראשית דרכה ומנהלת את המערך התפעולי מקצה לקצה. היא מיישרת תהליכים, עם הגדרת סטנדרטים ועם אימות שכל הבטחה שיווקית מתממשת בשטח ברמת דיוק גבוהה.",
      skills: ["Operations Excellence", "Process Optimization", "Quality Assurance", "Strategic Planning"] },
    { name: "רון דור", title: "Chief Business Development | סמנכ\"ל פיתוח עסקי", image: "board_pics/Ron.jpg",
      description: "רון דור מביא תפיסה אינטגרטיבית המבוססת על מתודולוגיות איתור שפיתח בספורט, בדגש על זיהוי אסימטריות ודפוסים חבויים בקנה מידה עולמי, יחד עם ניתוח פילוסופיות התנהגות.",
      skills: ["Business Intelligence", "Data Analytics", "Pattern Recognition", "Global Strategy"] },
    { name: "שחר צור", title: "Chief Marketing Officer | סמנכ\"לית שיווק", image: "board_pics/Shahar.jpg",
      description: "שחר צור מובילה את המותג משלב האסטרטגיה ועד הביצוע בפועל. היא מייצרת ביקוש אורגני ויוצרת חיבור רגשי עמוק עם קהלים מגוונים.",
      skills: ["Brand Strategy", "Digital Marketing", "Content Creation", "Organic Growth"] },
    { name: "ארי גבאי", title: "Head of Investor Relations | ראש קהילות המשקיעים", image: "board_pics/Ari.jpg",
      description: "ארי גבאי מוביל קהילות משקיעים עם תפיסה קהילתית עוצמתית. הוא מתרגם דאטה לאינפורמציה פרקטית ומחבר בין אנשים להזדמנויות השקעה מותאמות.",
      skills: ["Investor Relations", "Community Building", "Data Translation", "Strategic Partnerships"] },
    { name: "ניב שירזי", title: "Head of Finance | ראש המחלקה הפיננסית", image: "board_pics/Niv.jpeg",
      description: "ניב שירזי משמש יד ימינו של הדרג הבכיר עם מומחיות גבוהה במימון עסקאות ובדיקות נאותות. הוא ממזג בין ניתוח קר ובין גמישות מחשבתית.",
      skills: ["Deal Financing", "Due Diligence", "Strategic Analysis", "Financial Solutions"] }
  ];

  let idx = 0;
  const total = () => executiveData.length;
  const mod = (n, m) => ((n % m) + m) % m;

  function render() {
    const t = total();
    const counter = document.getElementById('executive-counter');
    const bar = document.getElementById('progress-bar');
    if (!t) { if (counter) counter.textContent = '0/0'; if (bar) bar.style.width = '0%'; return; }

    const e = executiveData[idx = Math.max(0, Math.min(idx, t - 1))];

    const photo = document.getElementById('exec-photo');
    const name  = document.getElementById('exec-name');
    const title = document.getElementById('exec-title');
    const desc  = document.getElementById('exec-description');
    const skills= document.getElementById('exec-skills');

    if (photo) { photo.src = e.image; photo.alt = e.name; }
    if (name)  name.textContent = e.name;
    if (title) title.textContent = e.title;
    if (desc)  desc.textContent  = e.description;
    if (skills) skills.innerHTML = e.skills.map(s => '<div class="skill-chip">' + s + '</div>').join('');

    if (counter) counter.textContent = (idx + 1) + '/' + t;
    if (bar)     bar.style.width = (((idx + 1) / t) * 100) + '%';

    document.querySelectorAll('.team-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  function buildDots() {
    const wrap = document.getElementById('team-dots');
    if (!wrap) return;
    let html = '';
    for (let i = 0; i < total(); i++) {
      html += '<div class="team-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '"></div>';
    }
    wrap.innerHTML = html;
    wrap.addEventListener('click', (ev) => {
      const el = ev.target.closest('[data-dot]');
      if (!el) return;
      idx = Number(el.getAttribute('data-dot')) || 0;
      render();
    });
  }

  function init() { buildDots(); render(); }

  return {
    init,
    next() { if (total()) { idx = mod(idx + 1, total()); render(); } },
    prev() { if (total()) { idx = mod(idx - 1, total()); render(); } }
  };
})();

// Developer Portal Functionality
function initDeveloperPortal() {
  // Marketing system toggle functionality
  window.toggleStep = function(header) {
    const content = header.nextElementSibling;
    const toggle = header.querySelector('.step-toggle');
    if (!content || !toggle) return;
    
    const isExpanded = content.classList.contains('expanded');
    
    // Close all other steps
    const portal = document.querySelector('.developer-portal');
    if (portal) {
      portal.querySelectorAll('.step-content.expanded').forEach(item => {
        if (item !== content) {
          item.classList.remove('expanded');
          const prevToggle = item.previousElementSibling.querySelector('.step-toggle');
          if (prevToggle) prevToggle.textContent = '+';
        }
      });
    }
    
    // Toggle current step
    if (isExpanded) {
      content.classList.remove('expanded');
      toggle.textContent = '+';
    } else {
      content.classList.add('expanded');
      toggle.textContent = '−';
    }
  };
  
  // Projects slider functionality
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const slides = Array.from(track.children);
    const totalSlides = slides.length;
    
    function updateSlider() {
      const containerWidth = track.parentElement.offsetWidth || 800;
      const slideWidth = 300;
      const gap = 16;
      const slidesPerView = Math.max(1, Math.floor(containerWidth / (slideWidth + gap)));
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      
      currentIndex = Math.min(currentIndex, maxIndex);
      
      const offset = -(currentIndex * (slideWidth + gap));
      track.style.transform = 'translateX(' + offset + 'px)';
      
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
      
      // Update button styles
      if (prevBtn.disabled) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
      }
      
      if (nextBtn.disabled) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
      }
    }
    
    // Remove existing event listeners
    prevBtn.onclick = null;
    nextBtn.onclick = null;
    
    prevBtn.onclick = function() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    };
    
    nextBtn.onclick = function() {
      const containerWidth = track.parentElement.offsetWidth || 800;
      const slideWidth = 300;
      const gap = 16;
      const slidesPerView = Math.max(1, Math.floor(containerWidth / (slideWidth + gap)));
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    };
    
    // Initialize
    updateSlider();
    
    // Handle window resize
    const handleResize = function() {
      updateSlider();
    };
    
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
  }
}