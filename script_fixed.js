// @ts-nocheck
console.log("🚀 SCRIPT LOADED - New registration flow active!", new Date().toISOString());
import { PropertyDatabase } from "./propertyDatabase.js";

// ========================================
// URL REFRESH HANDLING - CRITICAL FOR UX
// ========================================

// Handle page refresh on modal URLs - redirect to homepage to prevent 404 errors
(function handleModalUrlRefresh() {
  // Only run this for online environments, not localhost
  if (window.location.protocol.startsWith('http') && window.location.hostname !== 'localhost') {
    const currentPath = window.location.pathname;

    // If user is on a modal URL path (not root), check if it's valid
    if (currentPath !== '/' && currentPath !== '/index.html') {
      const modalPath = currentPath.replace('/', '');

      // List of valid modal paths - these should match the data-modal attributes
      const validModalPaths = [
        'about', 'services', 'join', 'assets', 'projects', 'contact',
        'accessibility', 'privacy', 'ethics', 'terms', 'team'
      ];

      // If it's not a valid modal path, redirect to home immediately
      if (!validModalPaths.includes(modalPath)) {
        console.log(`🔄 Invalid URL path: ${currentPath}, redirecting to home`);
        window.location.replace('/');
        return;
      }

      // If it's a valid modal path, the modal will be opened by the regular initialization code
      console.log(`✅ Valid modal URL detected: ${modalPath}, will open modal after page loads`);
    }
  }
})();

// Firebase removed - no longer needed

// Firebase authentication removed

// All Firebase authentication functions removed

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
const floatingCtaContainer = document.getElementById("floating-cta");
const floatingCtaBtn = document.getElementById("floating-cta-btn");

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
    <div class="quantum-about">
      <div class="about-particles"></div>
      
      <div class="about-content">
        <div class="about-hero">
          <h1 class="about-title">הסיפור שלנו</h1>
        </div>
        
        <div class="legacy-story" dir="rtl">
          <p class="story-text">בעולם שמשתנה ללא הרף,</p>
          <p class="story-text">נדיר למצוא עסק אשר חי,</p>
          <p class="story-text">נושם ומתרחב זה שלושה עשורים,</p>
          <p class="story-text">מתוך תשוקה שרק הולכת ומתחזקת.</p>
          <p class="story-text">עבורנו נדל"ן מהווה שליחות,</p>
          <p class="story-text">דרך לחבר כל פרט למרחב המדויק.</p>
        </div>


        <div class="executives-section">
          <h2 class="executives-title">חבר הבכירים</h2>

          <div class="executive-progress">
            <div class="exec-counter" id="about-executive-counter">1/8</div>
            <div class="progress-track">
              <div class="progressteam-fill" id="about-progress-bar" style="width: 12.5%;"></div>
            </div>
          </div>

          <div class="executive-showcase" id="about-executive-showcase">
            <div class="exec-profile">
              <div class="exec-photo-container"> <img src="" class="exec-photo" id="about-exec-photo"> </div>
              <div class="exec-info">
                <h3 class="exec-name" id="about-exec-name"></h3>
                <div class="exec-title" id="about-exec-title"></div>
                <p class="exec-description" id="about-exec-description"></p>
              </div>
            </div>
          </div>

          <div class="navigation-controls">
              <button class="projects-nav-btn team-prev" onclick="AboutTeam.prev()" aria-label="Previous">
                  <i class="fas fa-chevron-right"></i>
              </button>
            <div class="team-dots" id="about-team-dots"></div>
              <button class="projects-nav-btn team-next" onclick="AboutTeam.next()" aria-label="Next">
                  <i class="fas fa-chevron-left"></i>
              </button>
          </div>
        </div>

        <div class="quantum-timeline">
          <div class="timeline-header">
            <h2 class="timeline-title">ציר הזמן</h2>
          </div>
          
          <div class="timeline-container">
            <div class="timeline-line"></div>
            
            <div class="timeline-item">
              <div class="timeline-content">
                <div class="timeline-year">1997</div>
                <h3 class="timeline-milestone">לידת החזון</h3>
              </div>
              <div class="timeline-dot"></div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-content">
                <div class="timeline-year">2002</div>
                <h3 class="timeline-milestone">שיווק פרויקטים</h3>
              </div>
              <div class="timeline-dot"></div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-content">
                <div class="timeline-year">2006</div>
                <h3 class="timeline-milestone">יזמות</h3>
              </div>
              <div class="timeline-dot"></div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-content">
                <div class="timeline-year">2012</div>
                <h3 class="timeline-milestone">נדל"ן מסחרי</h3>
              </div>
              <div class="timeline-dot"></div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-content">
                <div class="timeline-year">2018</div>
                <h3 class="timeline-milestone">טרסנפורמציה טכנולוגית</h3>
              </div>
              <div class="timeline-dot"></div>
            </div>
            
            <div class="timeline-item current">
              <div class="timeline-content">
                <div class="timeline-year">2022</div>
                <h3 class="timeline-milestone">השקעות גלובליות</h3>
              </div>
              <div class="timeline-dot"></div>
            </div>
          </div>
        </div>
        
        <div class="legacy-footer">
          <button class="legacy-cta" data-start-journey>
            <div class="btn-hero-content-container">
              <span class="button-text">על מה אתם חולמים?</span>
              <i class="fas fa-arrow-left"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <script>
      // Create floating particles
      (function() {
        const particlesContainer = document.querySelector('.about-particles');
        if (!particlesContainer) return;
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          particle.className = 'about-particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 12 + 's';
          particle.style.animationDuration = (12 + Math.random() * 8) + 's';
          particlesContainer.appendChild(particle);
        }
      })();
    </script>
  `,
  },
  // שירותי הפירמה
  services: {
    title: "Innovation Hub | רכזת החדשנות",
    content: `      
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
            <h1 class="services-title">נדל"ן עם חזון</h1>
            <p class="services-subtitle">
            אנחנו משלבים מומחיות נדל"נית עמוקה וחדשנות טכנולוגית כדי לבנות עבורך עתיד פיננסי יציב ומלא בהזדמנויות.
            </p>
            
            <div class="tech-stats">
              <div class="tech-stat">
                <span class="tech-number">AI</span>
                <span class="tech-label">אנליטיקה מבוססת</span>
              </div>
              <div class="tech-stat">
                <span class="tech-number">24/7</span>
                <span class="tech-label">דאטה בזמן אמת</span>
              </div>
              <div class="tech-stat">
                <span class="tech-number">∞</span>
                <span class="tech-label">אפשרויות</span>
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
                <div class="feature-tag">מודלי למידת מכונה</div>
                <div class="feature-tag">פרדיקציות מבוססות AI</div>
                <div class="feature-tag">ניתוח תב״ע</div>
              </div>
            </div>

          <div class="service-hexagon">
              <div class="service-header">
                <div class="service-icon">🧠</div>
                <div>
                  <h3 class="service-title">
                    ייעוץ אסטרטגי
                    <span class="service-title-en">Strategic Advisory</span>
                  </h3>
                </div>
              </div>
              <p class="service-description">
              ליווי אסטרטגי צמוד ליזמים ולמשקיעים. ניתוח שווקים ואזורים, תכניות ROI/IRR ממוקדות והכוונה ברמת הניואנסים. מיזמים חדשים זוכים לתכנון ובקרה קפדניים, ומשקיעים נהנים מהבנת שוק, מבנה עסקה ונתיבי יציאה ברורים.
              </p>
              <div class="service-features">
                <div class="feature-tag">מודיעין שוק</div>
                <div class="feature-tag">מידול ROI / IRR</div>
                <div class="feature-tag">אסטרטגיית יציאה</div>
              </div>
            </div>

            <div class="service-hexagon">
              <div class="service-header">
                <div class="service-icon">📈</div>
                <div>
                  <h3 class="service-title">
                    שיווק חכם
                    <span class="service-title-en">Quantum Marketing</span>
                  </h3>
                </div>
              </div>
              <p class="service-description">
                אסטרטגיה מונחית דאטה, בהשראה משיווק קוונטי. חווית לקוח מותאמת אישית לצורך פילוח שוק מבוסס בינה מלאכותית. 
                מיתוג עוצמתי בעולמות הפרויקטים והיד-שנייה.
              </p>
              <div class="service-features">
                <div class="feature-tag">פילוח שוק מבוסס AI</div>
                <div class="feature-tag">ארכיטקטורת מותג</div>
                <div class="feature-tag">אינטליגנציית המרה</div>
              </div>
            </div>

          </div>
          
          <!-- CTA Section -->
          <div class="cta-section">
            <h2 style="color: #ffffff; margin-bottom: 1rem; font-size: 1.8rem;">העתיד כבר כאן</h2>
            <p style="margin-bottom: 1rem;">
            בוא נשנה יחד את כללי המשחק שלך.
            </p>
            <button class="quantum-cta-services" data-modal="team" type="button">
              <div class="btn-hero-content-container" style="color:#ffffff;">
                <span class="button-text" style="color:#ffffff;">פגשו את הצוות</span>
                <i class="fas fa-users"></i>
              </div>
            </button>
            <button class="quantum-cta-services" data-modal="contact" type="button">
              <div class="btn-hero-content-container" style="color:#ffffff;">
                <span class="button-text" style="color:#ffffff;">פתחו במסע</span>
                <i class="fas fa-rocket"></i>
              </div>
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
      <h1 class="team-title">חבר הבכירים</h1>
      <p class="team-subtitle">
        צוות מובילים שמשלב חדשנות טכנולוגית עם מומחיות עמוקה. כל אחד מחברי הצוות מביא פרספקטיבה ייחודית
        שמעצבת יחד את עתיד הנדל"ן בישראל.
      </p>
    </div>

    <div class="executive-progress">
      <div class="exec-counter" id="executive-counter">1/8</div>
      <div class="progress-track">
        <div class="progressteam-fill" id="progress-bar" style="width: 12.5%;"></div>
      </div>
    </div>

    <div class="executive-showcase" id="executive-showcase">
      <div class="exec-profile">
        <div class="exec-photo-container"> <img src="" class="exec-photo" id="exec-photo"> </div>
        <div class="exec-info">
          <h2 class="exec-name" id="exec-name"></h2>
          <div class="exec-title" id="exec-title"></div>
          <p class="exec-description" id="exec-description"></p>
        </div>
      </div>
    </div>

    <div class="navigation-controls">
        <button class="projects-nav-btn team-prev" onclick="DorTeam.prev()" aria-label="Previous">
            <i class="fas fa-chevron-right"></i>
        </button>
      <div class="team-dots" id="team-dots"></div>
        <button class="projects-nav-btn team-next" onclick="DorTeam.next()" aria-label="Next">
            <i class="fas fa-chevron-left"></i>
        </button>
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
          background: #FF7A00;
          border-radius: 50%;
          opacity: 0.7;
          animation: quantumFloat 4s infinite linear;
        }
        
        .particle:nth-child(2n) { background: #FF4D00; animation-delay: -1s; }
        .particle:nth-child(3n) { background: #FF7A00; animation-delay: -2s; }
        .particle:nth-child(4n) { background: #ffffff; animation-delay: -3s; }
        
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
          background: linear-gradient(45deg, #FF7A00, #FF4D00, #ffffff);
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
          color: #ffffff;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        
        .opportunities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
          padding: 0 1rem;
        }
        
        .opportunity-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 122, 0, 0.2);
          border-radius: 15px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .opportunity-card:hover {
          transform: translateY(-5px);
          border-color: #FF7A00;
          box-shadow: 0 10px 30px rgba(255, 122, 0, 0.3);
        }
        
        .opportunity-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
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
          color: #FF7A00;
        }
        
        .card-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #FF7A00, #FF4D00, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .card-description {
          color: #ffffff;
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
          color: var(--primary-color);
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .skill-tag {
          background: linear-gradient(45deg, rgba(255, 122, 0, 0.1), rgba(255, 77, 0, 0.1));
          border: 1px solid rgba(255, 122, 0, 0.3);
          padding: 0.8rem 1rem;
          border-radius: 25px;
          text-align: center;
          color: #ffffff;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .skill-tag:hover {
          background: linear-gradient(45deg, rgba(255, 122, 0, 0.2), rgba(255, 77, 0, 0.2));
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(255, 122, 0, 0.3);
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
          background: linear-gradient(45deg, #FF7A00, #FF4D00);
          border: none;
          padding: 1rem 3rem;
          border-radius: 30px;
          color: #ffffff;
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
          box-shadow: 0 10px 25px rgba(255, 122, 0, 0.4);
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
          color: #FF7A00;
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
               הצטרפו אלינו למסע שמגדיר מחדש את עולם הנדל״ן בישראל.  
  אנחנו מחפשים מוחות יוצאי דופן, יזמים בנשמה ומובילי שינוי שרוצים להשפיע באמת.
            </p>
            
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">5B+</span>
                <span class="stat-label">₪ רכישות</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">25,000+</span>
                <span class="stat-label">לקוחות מרוצים</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">2,500+</span>
                <span class="stat-label">נכסים ששווקו</span>
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
              <h3 class="card-title">חדשנות נדל"נית</h3>
              <p class="card-description">
                הובל את המהפכה הטכנולוגית בנדל"ן. פתח פתרונות חדשניים שישנו את הדרך שבה אנשים קונים ומוכרים נכסים.
              </p>
            </div>
            
            <div class="opportunity-card">
              <div class="card-icon">💡</div>
              <h3 class="card-title">שת"פים אסטרטגיים</h3>
              <p class="card-description">
                בנה קשרים אסטרטגיים עם השחקנים המובילים בשוק. צור שותפויות שיניבו תוצאות מדהימות.
              </p>
            </div>
            
            <div class="opportunity-card">
              <div class="card-icon">📊</div>
              <h3 class="card-title">צמיחה מבוססת-דאטה</h3>
              <p class="card-description">
                השתמש בביג דאטה ובינה מלאכותית כדי לזהות הזדמנויות חדשות ולהוביל את השוק קדימה.
              </p>
            </div>
            
            <div class="opportunity-card">
              <div class="card-icon">🎯</div>
              <h3 class="card-title">הובלה בשוק</h3>
              <p class="card-description">
                הובל פרויקטים פורצי דרך שיקבעו את הסטנדרטים החדשים של התעשייה בישראל ובעולם.
              </p>
            </div>
          </div>
          
          <!-- Skills Section -->
          <div class="skills-section">
            <h2 class="skills-title">הפרופיל האידיאלי</h2>
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
          
          <button class="quantum-cta contact" data-modal="contact" type="button">
              <div class="btn-hero-content-container">
                <span class="button-text">הגש מועמדות</span>
                <i class="fas fa-rocket"></i>
              </div>
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
        padding: 3rem 2rem;
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
        font-size: 2.3rem;
        font-weight: 900;
        color: white;
        margin-bottom: 1.5rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      
      .background-text {
        font-size: 1.3rem;
        color: rgba(255,255,255,0.95);
        max-width: 900px;
        margin: 0 auto;
        line-height: 1.6;
        font-weight: 500;
      }
      
      .main-content {
        padding: 1rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .vision-mission {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin: 2rem 0;
        padding: 0 1rem;
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
        color: #ffffff;
        font-weight: 500;
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
        color: #ffffff;
        font-weight: 600;
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
        color: #ffffff;
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
        background: var(--primary-color);
        color: #ffffff;
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
        padding: 0 1rem;
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
        color: #ffffff;
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
            <h3 class="bracket-title">חזון | Vision</h3>
            <p class="bracket-content">
              להיות השותף הבלעדי ליזמים מובילים. לייצר סיפורי הצלחה נדל"ניים שמגדירים מחדש את הסטנדרט בתחום.
            </p>
          </div>
          
          <div class="bracket-block">
            <h3 class="bracket-title">משימה | Mission</h3>
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
              <span class="stat-label">₪ רכישות</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">25,000+</span>
              <span class="stat-label">לקוחות מרוצים</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">2,500+</span>
              <span class="stat-label">נכסים ששווקו</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">250+</span>
              <span class="stat-label">נכסים בשיווק</span>
            </div>
          </div>
        </div>
        
        <!-- Flagship Projects -->
        <div class="projects-menu-section">
          <h2 class="section-title">פרויקטי דגל</h2>
          <div class="projects-slider" id="projectsSlider">
            <div class="projects-track" id="projectsTrack">

              <div class="project-slide">
                <img src="firm_projects_optimized/yitzchak_sade_3_givatayim_640w.webp" alt="יצחק שדה 3, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">יצחק שדה 3, גבעתיים</div>
                  <div class="project-status sold">סולד אאוט</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects_optimized/michal_6_tel_aviv_640w.webp" alt="מיכל 6, תל אביב" />
                <div class="project-info">
                  <div class="project-name">מיכל 6, תל אביב</div>
                  <div class="project-status sold">בשיווק</div>
                </div>
              </div>

              <div class="project-slide">
                <img src="firm_projects_optimized/hamaayan_7_givatayim_640w.webp" alt="המעיין 7, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">המעיין 7, גבעתיים</div>
                  <div class="project-status sold">סולד אאוט</div>
                </div>
              </div>  
              
              <div class="project-slide">
                <img src="firm_projects_optimized/remez_35_tel_aviv_640w.webp" alt="רמז 35, תל אביב" />
                <div class="project-info">
                  <div class="project-name">רמז 35, תל אביב</div>
                  <div class="project-status sold">בשיווק</div>
                </div>
              </div>           
              

              <div class="project-slide">
                <img src="firm_projects_optimized/reines_30_givatayim_640w.webp" alt="ריינס 30, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ריינס 30, גבעתיים</div>
                  <div class="project-status sold">בקרוב</div>
                </div>
              </div>                

              <div class="project-slide">
                <img src="firm_projects_optimized/reines_23_givatayim_640w.webp" alt="ריינס 23, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ריינס 23, גבעתיים</div>
                  <div class="project-status sold">בשיווק</div>
                </div>
              </div>                    
              
              <div class="project-slide">
                <img src="firm_projects_optimized/yitzchak_sade_5_givatayim_640w.webp" alt="יצחק שדה 5, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">יצחק שדה 5, גבעתיים</div>
                  <div class="project-status sold">בשיווק</div>
                </div>
              </div>
              
              <div class="project-slide">
                <img src="firm_projects_optimized/zabo_37_givatayim_640w.webp" alt="ז'בוטינסקי 37, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ז'בוטינסקי 37, גבעתיים</div>
                  <div class="project-status sold">בשיווק</div>                  
                </div>
              </div>  
              
              <div class="project-slide">
                <img src="firm_projects_optimized/yitzchak_sade_7_givatayim_640w.webp" alt="יצחק שדה 7, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">יצחק שדה 7, גבעתיים</div>
                  <div class="project-status sold">בשיווק</div>                  
                </div>
              </div>              
                            
              <div class="project-slide">
                <img src="firm_projects_optimized/golomb_54_givatayim_640w.webp" alt="גולומב 54, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">גולומב 54, גבעתיים</div>
                  <div class="project-status sold">בשיווק</div>                  
                </div>
              </div>

              <div class="project-slide">
                <img src="firm_projects_optimized/berdiv_37_givatayim_640w.webp" alt="ברדיצ'בסקי 37, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ברדיצ'בסקי 37, גבעתיים</div>
                  <div class="project-status sold">בשיווק</div>                  
                </div> 
              </div>             
                        
              <div class="project-slide">
                <img src="firm_projects_optimized/soon_640w.webp" alt="קקל 17, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">קק"ל, גבעתיים</div>
                  <div class="project-status sold">בקרוב</div>                  
                </div>
              </div>
            
                <div class="project-slide">
                <img src="firm_projects_optimized/soon_640w.webp" alt="ברדיצ'בסקי 10, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ברדיצ'בסקי, גבעתיים</div>
                  <div class="project-status sold">בקרוב</div>                  
                </div>
              </div>

              <div class="project-slide">
                <img src="firm_projects_optimized/soon_640w.webp" alt="ברדיצ'בסקי 12, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">ברדיצ'בסקי, גבעתיים</div>
                  <div class="project-status sold">בקרוב</div>                  
                </div>
              </div>

                <div class="project-slide">
                <img src="firm_projects_optimized/soon_640w.webp" alt="שדה בוקר 1, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">שדה בוקר, גבעתיים</div>
                  <div class="project-status sold">בקרוב</div>                  
                </div>
              </div>

                <div class="project-slide">
                <img src="firm_projects_optimized/soon_640w.webp" alt="שדה בוקר 3, גבעתיים" />
                <div class="project-info">
                  <div class="project-name">שדה בוקר, גבעתיים</div>
                  <div class="project-status sold">בקרוב</div>                  
                </div>
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
          <h2 class="section-title">מודל 360°</h2>
          <div class="pillars-grid">
            <div class="pillar-bracket">
              <h3 class="pillar-title">שיווק חכם</h3>
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
          <h2 class="section-title">מתודולוגיית השיווק</h2>
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
      <div class="ctasset-section">
        <h2 class="ctasset-title">בואו נבנה את סיפור ההצלחה הבא</h2>
        <button class="ctasset-button" data-modal="contact">
          <div class="btn-hero-content-container">
            <span class="button-text">הצטרפו ליזמים שכבר איתנו</span>
            <i class="fas fa-arrow-left"></i>
          </div>
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
    <div class="quantum-projects">
        <div class="projects-grid">



          <a class="project-card project-sold">
            <img src="firm_projects_optimized/yitzchak_sade_3_givatayim_640w.webp" alt="יצחק שדה 3, גבעתיים" />
            <div class="project-overlay show-always">יצחק שדה 3, גבעתיים</div>
          </a>

          <a class="project-card project-ongoing">
              <img src="firm_projects_optimized/michal_6_tel_aviv_640w.webp" alt="מיכל 6, תל אביב" />
              <div class="project-overlay">מיכל 6, תל אביב</div>
            </a>            

         <a class="project-card project-sold">
            <img src="firm_projects_optimized/hamaayan_7_givatayim_640w.webp" alt="המעיין 7, גבעתיים" />
            <div class="project-overlay show-always">המעיין 7, גבעתיים</div>
          </a>

            <a class="project-card project-ongoing">
              <img src="firm_projects_optimized/remez_35_tel_aviv_640w.webp" alt="רמז 35, תל אביב" />
              <div class="project-overlay">רמז 35, תל אביב</div>
            </a>     
            
            <a class="project-card project-soon">
            <img src="firm_projects_optimized/reines_30_givatayim_640w.webp" alt="ריינס 30, גבעתיים" />
            <div class="project-overlay">ריינס 30, גבעתיים</div>
          </a>

          <a class="project-card project-ongoing">
            <img src="firm_projects_optimized/reines_23_givatayim_640w.webp" alt="ריינס 23, גבעתיים" />
            <div class="project-overlay">ריינס 23, גבעתיים</div>
          </a>
                      
          <a class="project-card project-ongoing">
            <img src="firm_projects_optimized/yitzchak_sade_5_givatayim_640w.webp" alt="יצחק שדה 5, גבעתיים" />
            <div class="project-overlay">יצחק שדה 5, גבעתיים</div>
          </a>

          <a class="project-card project-ongoing">
            <img src="firm_projects_optimized/zabo_37_givatayim_640w.webp" alt="ז'בוטינסקי 37, גבעתיים" />
            <div class="project-overlay">ז'בוטינסקי 37, גבעתיים</div>
          </a>
  
          <a class="project-card project-ongoing">
              <img src="firm_projects_optimized/yitzchak_sade_7_givatayim_640w.webp" alt="יצחק שדה 7, גבעתיים" />
              <div class="project-overlay">יצחק שדה 7, גבעתיים</div>
          </a>

            <a class="project-card project-ongoing">
              <img src="firm_projects_optimized/golomb_54_givatayim_640w.webp" alt="גולומב 54, גבעתיים" />
              <div class="project-overlay">גולומב 54, גבעתיים</div>
            </a>

            <a class="project-card project-ongoing">
                <img src="firm_projects_optimized/berdiv_37_givatayim_640w.webp" alt="ברדיצ'בסקי 37, גבעתיים" />
                <div class="project-overlay">ברדיצ'בסקי 37, גבעתיים</div>
            </a>

          <a class="project-card project-soon">
            <img src="firm_projects_optimized/soon_640w.webp" alt="קקל 17, גבעתיים" />
            <div class="project-overlay">קק"ל, גבעתיים</div>
          </a>

          <a class="project-card project-soon">
            <img src="firm_projects_optimized/soon_640w.webp" alt="ברדיצ'בסקי 10, גבעתיים" />
            <div class="project-overlay">ברדיצ'בסקי, גבעתיים</div>
          </a>

          <a class="project-card project-soon">
            <img src="firm_projects_optimized/soon_640w.webp" alt="ברדיצ'בסקי 12, גבעתיים" />
            <div class="project-overlay">ברדיצ'בסקי, גבעתיים</div>
          </a>

          <a class="project-card project-soon">
            <img src="firm_projects_optimized/soon_640w.webp" alt="שדה בוקר 1, גבעתיים" />
            <div class="project-overlay">שדה בוקר, גבעתיים</div>
          </a>

          <a class="project-card project-soon">
            <img src="firm_projects_optimized/soon_640w.webp" alt="שדה בוקר 3, גבעתיים" />
            <div class="project-overlay">שדה בוקר, גבעתיים</div>
          </a>

        </div>
      </div>
      `,
  },
    // צור קשר
  contact: {
    title: "Communication Hub | מרכז תקשורת",
    content: `      
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
          <!-- Main Communication Grid -->
          <div class="communication-grid">
            <!-- Contact Information -->
            <div class="contact-methods">
              <h3 class="methods-title">פרטי התקשרות</h3>
              
              <div class="method-item">
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
              
              <div class="method-item" onclick="sendEmail('inquiries@dorestates.com')">
                <div class="method-icon">📧</div>
                <div class="method-details">
                  <div class="method-label">אימייל</div>
                  <div class="method-value">inquiries@dorestates.com</div>
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
              <h3 class="form-title">טופס פנייה</h3>
              
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
                  שלח הודעה 🚀
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
          
          // Create email body with form data
          const emailBody = 'שם: ' + name + '\n' +
                           'אימייל: ' + email + '\n' +
                           'טלפון: ' + (phone || 'לא צוין') + '\n\n' +
                           'הודעה:\n' + message + '\n\n' +
                           '---\nהודעה זו נשלחה מאתר DorEstate';
          
          // Open email client with form data
          const emailSubject = encodeURIComponent('פנייה חדשה מאתר DorEstate');
          const encodedBody = encodeURIComponent(emailBody);
          window.open('mailto:inquiries@dorestates.com?subject=' + emailSubject + '&body=' + encodedBody, '_blank');
          
          // Show success message
          showSuccessMessage();
          
          // Reset form
          document.getElementById("contactForm").reset();
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
          errorDiv.style.cssText = 
            "position: fixed;" +
            "top: 50%;" +
            "left: 50%;" +
            "transform: translate(-50%, -50%);" +
            "background: linear-gradient(45deg, #ff5722, #ff7043);" +
            "color: white;" +
            "padding: 1rem 2rem;" +
            "border-radius: 15px;" +
            "box-shadow: 0 10px 25px rgba(255, 87, 34, 0.3);" +
            "z-index: 1001;" +
            "font-weight: 600;" +
            "text-align: center;" +
            "opacity: 0;" +
            "transition: opacity 0.3s ease;";
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
                this.style.borderColor = 'rgba(255, 122, 0, 0.3)';
                this.style.boxShadow = 'none';
              }
            });
            
            input.addEventListener('focus', function() {
              this.style.borderColor = '#FF7A00';
              this.style.boxShadow = '0 0 20px rgba(255, 122, 0, 0.3), inset 0 0 20px rgba(255, 122, 0, 0.1)';
            });
            
            input.addEventListener('blur', function() {
              if (!this.value.trim()) {
                this.style.borderColor = 'rgba(255, 122, 0, 0.3)';
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
                 עודכן לאחרונה: <span id="terms-updated">19/09/2025</span>
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

                     <div style="border:1px solid #eee; border-radius:10px; padding: .75rem 1rem; margin-top: 1rem;">
                       <p style="margin: .25rem 0;"><strong>כתובת לפניות פרטיות:</strong> privacy@dorestates.com</p>
                       <p style="margin: .25rem 0;"><strong>טלפון:</strong> 050-5534488</p>
                       <p style="margin: .25rem 0;"><strong>מענה:</strong> א'–ה', 9:00–17:00</p>
                     </div>

                     <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                       עודכן לאחרונה: <span id="privacy-updated">19/09/2025</span>
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
                         <div style="border:1px solid #eee; border-radius:10px; padding: .75rem 1rem; margin-top: 1rem;">
                           <p style="margin: .25rem 0;"><strong>טלפון:</strong> 050-5534488</p>
                           <p style="margin: .25rem 0;"><strong>דוא"ל:</strong> accessibility@dorestates.com</p>
                           <p style="margin: .25rem 0;"><strong>ימי מענה:</strong> א'–ה', 9:00–17:00</p>
                         </div>
                       </div>

                       <p style="font-size: .9rem; color: var(--text-secondary); margin-top: 1rem;">
                         עודכן לאחרונה: <span id="accessibility-updated">19/09/2025</span>
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
                  עודכן לאחרונה: <span id="ethics-updated">19/09/2025</span>
                </p>
              `,
  },

  //////////// UNUSED CATEGORIES (for future use)

  // מאגר ידע  
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
  // הנבחרים שלנו
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

// Global contact functions
window.callPhone = function(phone) {
  window.open('tel:' + phone, '_self');
};

// Email with pre-filled subject
window.sendEmail = function(email) {
  window.open('mailto:' + email + '?subject=פנייה מאתר DorEstate', '_blank');
};

// WhatsApp with pre-filled message
window.openWhatsApp = function(phone) {
  const message = encodeURIComponent("שלום, אני מעוניין לקבל מידע נוסף על השירותים שלכם");
  window.open('https://wa.me/' + phone + '?text=' + message, '_blank');
};


// Onboarding Steps Configuration
function initializeOnboardingSteps() {
  onboardingSteps = [
    // 1) Micro Questionnaire (single screen)
    {
      type: "quick-qs",
      title: "שאלון קצר",
      subtitle: "כדי שנוכל להתאים לכם נכסים מדויקים",
      content: `
                <div class="question-container" dir="rtl">
                  <!-- Q1: Area -->
                  <h2 class="question-title">איפה תרצו לגור?</h2>
                  <div class="options-grid" data-group="area">
                    <div class="option-card" data-value="givatayim"><div class="option-title">גבעתיים</div></div>
                    <div class="option-card" data-value="ramat-gan"><div class="option-title">רמת גן</div></div>
                    <div class="option-card" data-value="tel-aviv"><div class="option-title">תל אביב</div></div>
                  </div>

                  <!-- Q2: Budget -->
                  <h2 class="question-title" style="margin-top:0.6rem;">מה התקציב?</h2>
                  <div class="options-grid" data-group="budget">
                    <div class="option-card" data-value="budget-low"><div class="option-title">₪0-2M</div></div>
                    <div class="option-card" data-value="budget-mid"><div class="option-title">₪2-4M</div></div>
                    <div class="option-card" data-value="budget-high"><div class="option-title">₪4M+</div></div>
                  </div>

                  <!-- Q3: Rooms -->
                  <h2 class="question-title" style="margin-top:0.6rem;">כמה חדרים יתאים לכם?</h2>
                  <div class="options-grid" data-group="rooms">
                    <!-- We store the minimum rooms as a number in data-value -->
                    <div class="option-card" data-value="2">
                      <div class="option-title">2 חדרים</div>
                    </div>
                    <div class="option-card" data-value="3">
                      <div class="option-title">3 חדרים</div>
                    </div>
                    <div class="option-card" data-value="4">
                      <div class="option-title">4 חדרים</div>
                    </div>
                    <div class="option-card" data-value="5">
                      <div class="option-title">5 חדרים</div>
                    </div>
                    <div class="option-card" data-value="6">
                      <div class="option-title">6 חדרים</div>
                    </div>
                    <div class="option-card" data-value="7">
                      <div class="option-title">7+ חדרים</div>
                    </div>
                  </div>

                  <!-- Q4: Type -->
                  <h2 class="question-title" style="margin-top:0.6rem;">איזה סוג נכס מדבר אליכם?</h2>
                  <div class="options-grid" data-group="type">
                    <!-- Store slugs that match the DB directly -->
                    <div class="option-card" data-value="apartment"><div class="option-title">דירה</div></div>
                    <div class="option-card" data-value="garden_apartment"><div class="option-title">דירת גן</div></div>
                    <div class="option-card" data-value="penthouse"><div class="option-title">פנטהאוז</div></div>
                    <div class="option-card" data-value="townhouse"><div class="option-title">בית פרטי</div></div>
                    <div class="option-card" data-value="rooftop"><div class="option-title">דירת גג</div></div>
                    <div class="option-card" data-value="cottage"><div class="option-title">קוטג</div></div>
                  </div>

                <div style="text-align:center; margin-top:0.8rem;">
                  <button id="toSwiping" style="background:var(--primary-color); color:white; border:none; padding:1rem 3rem; border-radius:50px; font-size:1.1rem; cursor:pointer; font-weight: 600;">
                    מצאו את הבית שלכם
                  </button>
                </div>

                </div>
                `,
    },
  ];
}

// Load a specific step by index
function goToStepType(type) {
  const i = onboardingSteps.findIndex((s) => s.type === type);
  if (i === -1) return;
  currentStep = i;
  loadStep(currentStep);
}
 
// hasAuth function removed - no longer needed without Firebase

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

// Projects Horizontal Scrolling Functionality
function initProjectsScrolling() {
  const scrollTrack = document.getElementById('projectsScrollTrack');
  const prevBtn = document.getElementById('projectsPrev');
  const nextBtn = document.getElementById('projectsNext');
  const dotsContainer = document.getElementById('projectsNavDots');
  
  if (!scrollTrack || !prevBtn || !nextBtn || !dotsContainer) return;
  
  const projectCards = scrollTrack.querySelectorAll('.project-card');
  // Calculate actual card width including gap (350px card + 2rem gap)
  const cardWidth = 350 + 32; // 350px card + 32px gap (2rem)
  let currentIndex = 0;
  
  // Create navigation dots
  function createDots() {
    dotsContainer.innerHTML = '';
    projectCards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `projects-nav-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => scrollToProject(index));
      dotsContainer.appendChild(dot);
    });
  }
  
  // Update dots active state
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.projects-nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Scroll to specific project (fixed for RTL layout)
  function scrollToProject(index) {
    const oldIndex = currentIndex;
    currentIndex = Math.max(0, Math.min(index, projectCards.length - 1));
    
    // For RTL layouts, we need to scroll in the opposite direction
    // Calculate scroll position - in RTL, positive scroll moves right (backward)
    const scrollPosition = -(currentIndex * cardWidth);
    
    console.log(`📍 Scrolling from ${oldIndex} to ${currentIndex}, RTL position: ${scrollPosition}px, cardWidth: ${cardWidth}px`);
    console.log('ScrollTrack current scrollLeft:', scrollTrack.scrollLeft);
    
    // Use direct scrollLeft assignment for RTL compatibility
    scrollTrack.scrollLeft = scrollPosition;
    
    // Fallback with scrollTo if direct assignment doesn't work
    setTimeout(() => {
      if (Math.abs(scrollTrack.scrollLeft - scrollPosition) > 10) {
        console.log('⚠️ Direct scroll failed, trying scrollTo method');
        scrollTrack.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
    
    updateDots();
    updateNavButtons();
    
    console.log(`🎯 Scrolled to project ${currentIndex}, RTL target position: ${scrollPosition}px`);
  }
  
  // Update navigation button states
  function updateNavButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= projectCards.length - 1;
  }
  
  // Navigation event listeners - Fixed for RTL layout
  prevBtn.addEventListener('click', () => {
    console.log('Previous button clicked, currentIndex:', currentIndex);
    if (currentIndex > 0) {
      scrollToProject(currentIndex - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    console.log('Next button clicked, currentIndex:', currentIndex);
    if (currentIndex < projectCards.length - 1) {
      scrollToProject(currentIndex + 1);
    }
  });
  
  // Touch/swipe support
  let startX = 0;
  let scrollLeft = 0;

  scrollTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    scrollLeft = scrollTrack.scrollLeft;
  });

  scrollTrack.addEventListener('touchmove', (e) => {
    if (!startX) return;

    const x = e.touches[0].clientX;
    const diff = startX - x;
      scrollTrack.scrollLeft = scrollLeft + diff;
  });

  scrollTrack.addEventListener('touchend', () => {
    startX = 0;
      // Snap to closest project (RTL compatible)
      const newIndex = Math.round(Math.abs(scrollTrack.scrollLeft) / cardWidth);
      scrollToProject(newIndex);
  });
  
  // Mouse wheel horizontal scrolling
  scrollTrack.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollTrack.scrollLeft += e.deltaY;
    }
  });
  
  // Sync with manual scroll events (RTL compatible)
  scrollTrack.addEventListener('scroll', () => {
    const newIndex = Math.round(Math.abs(scrollTrack.scrollLeft) / cardWidth);
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateDots();
      updateNavButtons();
    }
  });
  
  // Initialize
  createDots();
  updateNavButtons();
  
  console.log(`🎨 Projects horizontal scrolling initialized with ${projectCards.length} cards, cardWidth: ${cardWidth}px`);
}

// Initialize all event listeners
function initializeEventListeners() {
  // Modal triggers (original functionality + URL updates)
  document.querySelectorAll("[data-modal]").forEach((trigger) => {
    trigger.addEventListener("click", async function (e) {
      e.preventDefault();
      const modalType = this.getAttribute("data-modal");

      // Original modal opening
      await openModal(modalType);
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', async function(e) {
    const currentPath = window.location.pathname;
    const path = currentPath.replace('/', '') || 'home';
    const validPaths = ['about', 'services', 'join', 'assets', 'projects', 'contact', 'terms', 'accessibility', 'privacy', 'ethics', 'team', ...Object.keys(modalContents)];

    if (validPaths.includes(path)) {
      await openModal(path);
      updateMetaTags(path);
    } else if (path === 'home' || path === 'homepage') {
      closeModal();
      updateMetaTags('home');
    }
  });

  // Handle initial page load with URL
  const currentPath = window.location.pathname;
  if (currentPath !== '/') {
    const path = currentPath.replace('/', '') || 'home';
    const validPaths = ['about', 'services', 'join', 'assets', 'projects', 'contact', 'terms', 'accessibility', 'privacy', 'ethics', 'team', ...Object.keys(modalContents)];

    if (validPaths.includes(path)) {
      // Valid modal path - open the modal
      setTimeout(async () => {
        await openModal(path);
        updateMetaTags(path);
      }, 100);
    } else if (path === 'homepage') {
      // Handle homepage URL - just update meta tags, no modal
      updateMetaTags('home');
    } else {
      // Invalid path - redirect to home
      console.log(`🔄 Invalid modal path: ${path}, redirecting to home`);
      window.history.replaceState({ modal: null }, '', '/');
      updateMetaTags('home');
    }
  }

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

  // Floating CTA button
  if (floatingCtaBtn) {
    floatingCtaBtn.addEventListener("click", startOnboarding);
  }

  // Escape key handling
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      closeOnboarding();
    }
  });
}

// Contact Form Handling
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
      window.location.href = `mailto:inquiries@dorestates.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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
async function openModal(type) {
  let contentLoaded = false;

  // List of modals that have separate HTML files
  const htmlPages = ['about', 'services', 'join', 'assets', 'projects', 'contact', 'terms', 'accessibility', 'privacy', 'ethics', 'team'];

  if (htmlPages.includes(type)) {
    try {
      // Fetch content from the HTML file
      const response = await fetch(`${type}.html`);
      if (response.ok) {
        const htmlContent = await response.text();
        // Extract content from body tag
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const bodyContent = doc.body.innerHTML;
        modalContent.innerHTML = bodyContent;
        contentLoaded = true;
      }
    } catch (error) {
      console.warn(`Failed to load ${type}.html, falling back to inline content:`, error);
    }
  }

  // Fallback to modalContents if HTML file failed or for other modals
  if (!contentLoaded) {
    const content = modalContents[type];
    if (content) {
      modalContent.innerHTML = content.content;
      contentLoaded = true;
    }
  }

  // Only proceed if content was loaded
  if (contentLoaded) {
    modalOverlay.classList.add("active");

    // Update URL for any modal opening
    window.history.pushState({ modal: type }, '', `/${type}`);
    updateMetaTags(type);

    // Enhanced scroll lock - prevents background scroll and scroll chaining
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    // Add legal-modal class for legal modals
    const legalModals = ['terms', 'privacy', 'accessibility', 'ethics'];
    const modalContainer = document.querySelector('.modal-container');
    if (legalModals.includes(type)) {
      modalContainer.classList.add('legal-modal');
    } else {
      modalContainer.classList.remove('legal-modal');
    }
    
    // Reset scroll position of modal content to top when opening modal
    modalContent.scrollTop = 0;

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
      trigger.addEventListener("click", async function (e) {
        e.preventDefault();
        const modalType = this.getAttribute("data-modal");
        await openModal(modalType);
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
    if (type === "about") {
      try { initAboutTimeline(); } catch (_) {}
      // Initialize AboutTeam carousel
      if (window.AboutTeam && typeof window.AboutTeam.init === "function") {
        queueMicrotask(() => window.AboutTeam.init());
      }
    }
    if (type === "services") { try { initServicesTimeline(); } catch (_) {} }
    const contactFixed = document.querySelector(".contact-fixed");
    if (contactFixed) contactFixed.style.display = "none";
  }
}

// Close modal
function closeModal() {
  modalOverlay.classList.remove("active");

  // Enhanced scroll unlock - restore background scroll
  document.body.classList.remove("modal-open");
  document.body.style.overflow = ""; // instead of "hidden"

  const contactFixed = document.querySelector(".contact-fixed");
  if (contactFixed) contactFixed.style.display = "block";

  // Remove legal-modal class when closing
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.classList.remove('legal-modal');

  // Update URL to home when closing modal
  if (window.location.pathname !== '/') {
    window.history.pushState({ modal: null }, '', '/');
    updateMetaTags('home');
  }
}

// Dynamic SEO Meta Tags Update
function updateMetaTags(page) {
  const metaData = {
    home: {
      title: "דף הבית - דור נכסים",
      description: "דור נכסים פועלת מזה כשלושה עשורים ומובילה פרויקטים מורכבים בנדל״ן. אנו מייצרים ערך ליזמים, למשקיעים ולרוכשים באמצעות מומחיות נדל״נית, חשיבה קפיטלית וטכנולוגיה מבוססת דאטה.",
      url: "https://dorealestate.co.il/"
    },
    about: {
      title: "מורשת בכתב - דור נכסים",
      description: "הסיפור של דור נכסים - שלושה עשורים של מצוינות בנדל״ן. חבר הבכירים, ציר הזמן והליבה שלנו בגבעתיים, ברמת גן ובתל אביב.",
      url: "https://dorealestate.co.il/about"
    },
    services: {
      title: "שירותי הפירמה - דור נכסים",
      description: "שירותי נדל״ן מתקדמים: מחקר שוק, מידול יציאה לשוק, האצה וביצועים. מתודולוגיית השיווק שלנו מבוססת על דאטה וטכנולוגיה.",
      url: "https://dorealestate.co.il/services"
    },
    projects: {
      title: "פרויקטים - דור נכסים",
      description: "פרויקטי נדל״ן מובילים בגבעתיים ותל אביב. גולומב 54, ברדיצ'בסקי 37, יצחק שדה ועוד פרויקטים איכותיים.",
      url: "https://dorealestate.co.il/projects"
    },
    assets: {
      title: "ליזמים - דור נכסים",
      description: "שירותים מקצועיים ליזמי נדל״ן: מתודולוגיית השיווק, זיהוי והתאמה, מידול יציאה לשוק והאצת ביצועים.",
      url: "https://dorealestate.co.il/assets"
    },
    contact: {
      title: "צור קשר - דור נכסים",
      description: "צור קשר עם דור נכסים. ויצמן 37, גבעתיים. טלפון: 050-553-4488. אימייל: inquiries@dorestates.com",
      url: "https://dorealestate.co.il/contact"
    },
    join: {
      title: "קריירה - דור נכסים",
      description: "הצטרף לצוות דור נכסים. הזדמנויות קריירה בתחום הנדל״ן, השיווק והפיתוח. בואו להיות חלק מהדור הבא.",
      url: "https://dorealestate.co.il/join"
    },
    team: {
      title: "חבר הבכירים - דור נכסים",
      description: "צוות דור נכסים - הכירו את הרשת הנוירונית של המומחים שלנו בתחום הנדל״ן והשיווק.",
      url: "https://dorealestate.co.il/team"
    },
    terms: {
      title: "תנאי שימוש - דור נכסים",
      description: "תנאי השימוש של דור נכסים - כללים ותקנות לשימוש באתר ובשירותים.",
      url: "https://dorealestate.co.il/terms"
    },
    privacy: {
      title: "מדיניות פרטיות - דור נכסים",
      description: "מדיניות הפרטיות של דור נכסים - איסוף, שימוש ושמירה על מידע אישי.",
      url: "https://dorealestate.co.il/privacy"
    },
    accessibility: {
      title: "הסדרי נגישות - דור נכסים",
      description: "הסדרי הנגישות של דור נכסים - מידע על נגישות האתר והשירותים לאנשים עם מוגבלויות.",
      url: "https://dorealestate.co.il/accessibility"
    },
    ethics: {
      title: "כללי אתיקה - דור נכסים",
      description: "כללי האתיקה של דור נכסים - עקרונות מוסריים ומקצועיים המנחים את פעילותנו.",
      url: "https://dorealestate.co.il/ethics"
    },
  };

  const data = metaData[page] || metaData.home;

  // Update title
  document.title = data.title;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', data.description);

  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', data.url);

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', data.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', data.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', data.url);

  // Update Twitter Card tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', data.title);

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', data.description);

  const twitterUrl = document.querySelector('meta[name="twitter:url"]');
  if (twitterUrl) twitterUrl.setAttribute('content', data.url);
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

// Close onboarding overlay
function closeOnboarding() {
  onboardingOverlay.classList.remove("active");
  setTimeout(() => {
    onboardingOverlay.style.display = "none";
  }, 300);
}

// Load a specific step by index
function loadStep(stepIndex) {
  const step = onboardingSteps[stepIndex];
  if (!step) return;

  // Firebase teardown removed - no longer needed

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
    // phone auth removed - no longer needed
  } else if (step.type === "quick-qs") {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.display = "none";
    progressText.textContent = ``;
    progressText.style.textAlign = "center";
    progressText.style.width = "100%";
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

    const questBtn = document.getElementById("toQuestionnaire");
    if (questBtn)
      questBtn.addEventListener("click", () => goToStepType("quick-qs"));

    const swipeBtn = document.getElementById("toSwiping");
    if (swipeBtn) {
      swipeBtn.addEventListener("click", () => {
        saveStepData();
        closeOnboarding();
        setTimeout(() => startPropertySwiping(), 300);
      });
    }
  }, 50);
}

// Add listeners to option cards for selection
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

// Navigation between steps
function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    loadStep(currentStep);
  }
}

// Next step with validation
function nextStep() {
  saveStepData();
  const next = currentStep + 1;
  const nextType = onboardingSteps[next]?.type;
  // Removed phone validation - users can proceed directly to questionnaire
  if (currentStep < onboardingSteps.length - 1) {
    currentStep = next;
    loadStep(currentStep);
  } else {
    closeOnboarding();
    setTimeout(() => startPropertySwiping(), 300);
  }
}

// Save data from the current step
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

// Load user data from localStorage
function loadUserData() {
  const saved = localStorage.getItem("dorRealEstate_userData");
  if (saved) {
    userData = JSON.parse(saved);
  }
}

// Send lead email with collected user data
async function sendLeadEmail() {
  try {
    // Prepare user data
    const fullName = userData?.auth?.name || "לא צוין";
    const phoneNumber = userData?.auth?.phone || "לא צוין";
    const whatsappPromotions = userData?.auth?.optionalConsent ? "כן" : "לא";
    
    // Get questionnaire answers
    const quickQs = userData?.quickQs || {};
    let preferredArea = "לא צוין";
    let budget = "לא צוין";
    let rooms = "לא צוין";
    
    // Convert area code to Hebrew
    if (quickQs.area === "givatayim") preferredArea = "גבעתיים";
    else if (quickQs.area === "ramat-gan") preferredArea = "רמת גן";
    else if (quickQs.area === "tel-aviv") preferredArea = "תל אביב";
    
    // Convert budget code to Hebrew
    if (quickQs.budget === "budget-low") budget = "₪0-2M";
    else if (quickQs.budget === "budget-mid") budget = "₪2-4M";
    else if (quickQs.budget === "budget-high") budget = "₪4M+";
    
    // Convert rooms to Hebrew
    if (quickQs.rooms) {
      rooms = quickQs.rooms === "7" ? "7+ חדרים" : `${quickQs.rooms} חדרים`;
    }
    
    // Prepare properties list
    let propertiesText = "";
    if (likedProperties && likedProperties.length > 0) {
      propertiesText = likedProperties.map(property => {
        const title = property.title || "נכס ללא שם";
        const price = property.price ? `${fmtNIS(property.price)} ₪` : "מחיר לא צוין";
        return `${title} - ${price}`;
      }).join("\n");
    } else {
      propertiesText = "לא נבחרו נכסים";
    } 
    
    // Prepare email content
    const subject = `New Lead: ${fullName}`;
    const body = `Full Name: ${fullName}
Phone Number: ${phoneNumber}
Confirms WhatsApp Promotions: ${whatsappPromotions}
Preferred Area: ${preferredArea}
Budget: ${budget}
No. of Rooms: ${rooms}

Properties he liked:

${propertiesText}`;
    
    // Send email automatically using EmailJS (200 free emails/month)
    console.log('🔄 Starting email sending process...');
    console.log('📊 Email data prepared:', { fullName, phoneNumber, whatsappPromotions, preferredArea, budget, rooms });
    
    if (typeof emailjs !== 'undefined') {
      console.log('✅ EmailJS is loaded');
      try {
        console.log('🚀 Sending email via EmailJS...');
        
        // Add timeout to catch hanging requests
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('EmailJS timeout after 10 seconds')), 10000);
        });
        
        const emailPromise = emailjs.send(
          'service_5kcf4en',    // Your EmailJS service ID
          'template_brfxd6n',   // Your EmailJS template ID
          {
            name: fullName,     // {{name}} in your template
            time: new Date().toLocaleString('he-IL', {
              timeZone: 'Asia/Jerusalem',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),                 // {{time}} in your template
            message: body       // {{message}} in your template - contains all the lead details
          },
          'QyYU0QOukPB3XS7xM'     // Your EmailJS public key
        );
        
        const result = await Promise.race([emailPromise, timeoutPromise]);
        console.log('✅ SUCCESS! Lead email sent via EmailJS:', result);
      } catch (error) {
        console.error('❌ EmailJS FAILED with error:', error);
        console.error('❌ Error details:', error.message, error.status, error.text);
        
        // Try a simple test to verify configuration
        console.log('🔧 Testing with simple parameters...');
        try {
          const testResult = await emailjs.send(
            'service_5kcf4en',
            'template_brfxd6n',
            { name: 'Test', time: 'Now', message: 'Test' },
            'QyYU0QOukPB3XS7xM'
          );
          console.log('✅ Simple test successful:', testResult);
        } catch (testError) {
          console.error('❌ Simple test also failed:', testError);
        }
      }
    } else {
      console.error('❌ EmailJS NOT LOADED! Check if script is included in HTML');
      console.error('❌ Available globals:', Object.keys(window).filter(key => key.includes('email')));
    }
    
    // Also log to console for debugging
    console.log('📧 NEW LEAD EMAIL (sent via mailto):', {
      subject: subject,
      body: body,
      timestamp: new Date().toISOString(),
      userData: {
        fullName,
        phoneNumber, 
        whatsappPromotions,
        preferredArea,
        budget,
        rooms,
        propertiesCount: likedProperties?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Error sending lead email:', error);
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
  initProjectsScrolling(); // גלילה אופקית של פרויקטים

  // Check for URL parameters (e.g., ?open=projects)
  const urlParams = new URLSearchParams(window.location.search);
  const openParam = urlParams.get('open');

  // Check if we need to reopen a modal after refresh redirect
  const modalToOpen = sessionStorage.getItem('openModal');

  const modalToOpenNow = openParam || modalToOpen;

  if (modalToOpenNow) {
    console.log('🎯 Opening modal:', modalToOpenNow);
    sessionStorage.removeItem('openModal');

    // Wait a bit for everything to initialize, then open the modal
    setTimeout(async () => {
      const validPaths = ['about', 'services', 'join', 'assets', 'projects', 'contact', 'terms', 'accessibility', 'privacy', 'ethics', 'team', ...Object.keys(modalContents)];
      if (validPaths.includes(modalToOpenNow)) {
        await openModal(modalToOpenNow);

        // Update URL without triggering navigation
        window.history.replaceState({ modal: modalToOpenNow }, '', `/${modalToOpenNow}`);
        updateMetaTags(modalToOpenNow);
      }
    }, 200);
  }
});

// === Navigation Submenus ===
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

  // Add flag to prevent duplicate email sending
  let isProcessingLead = false;

  // delegate clicks anywhere on the page
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-open-contact]");
    if (!btn) return;
    
    // Check if user found any properties
    if (!likedProperties.length) {
      // No properties found - show filtering page
      if (swipeInterface) swipeInterface.style.display = "none";
      onboardingOverlay.style.display = "flex";
      setTimeout(() => {
        onboardingOverlay.classList.add("active");
        goToStepType("quick-qs");
      }, 10);
    } else {
      // Prevent duplicate processing
      if (isProcessingLead) {
        console.log('⏳ Already processing lead, please wait...');
        return;
      }
      
      isProcessingLead = true;
      
      // Show immediate feedback to user
      const originalText = btn.textContent;
      btn.textContent = "זמן לאתר עבורך את הבית המושלם..";
      btn.style.opacity = "0.6";
      btn.style.pointerEvents = "none";
      
      console.log('🚀 Starting email send process...');
      try {
        await sendLeadEmail();
        console.log('✅ Email process completed, now redirecting...');
        
        // Update button to show success before redirect
        btn.textContent = "מושלם!";
        await new Promise(resolve => setTimeout(resolve, 1000)); // Show success for 1 second
        
      } catch (error) {
        console.error('❌ Email process failed:', error);
        
        // Show error state
        btn.textContent = "שגיאה - נסה שוב";
        btn.style.backgroundColor = "#e74c3c";
        await new Promise(resolve => setTimeout(resolve, 2000)); // Show error for 2 seconds
      }
      
      closeOnboarding();
      if (swipeInterface) swipeInterface.style.display = "none";
      location.reload(); // Reset to homepage state
    }
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

//  === About Timeline ===
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

//  === Services Timeline ===
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
    if (q.rooms === "2") {
      f.minRooms = 2;
      f.maxRooms = 2;
    } else if (q.rooms === "3") {
      f.minRooms = 3;
      f.maxRooms = 3;
    } else if (q.rooms === "4") {
      f.minRooms = 4;
      f.maxRooms = 4;
    } else if (q.rooms === "5") {
      f.minRooms = 5;
      f.maxRooms = 5;
    } else if (q.rooms === "6") {
      f.minRooms = 6; 
      f.maxRooms = 6;
    } else if (q.rooms === "7+") {
      f.minRooms = 7; /* no max */
    }
  }

  // Q4: type (slug: 'apartment' | 'garden_apartment' | 'penthouse' | 'townhouse' | 'rooftop' | 'cottage')
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
window.contactAdvisor = async () => await openModal("contact");

// Map Hebrew UI -> DB slugs
function hebTypeToSlug(t) {
  const map = {
    "דירה": "apartment",
    "דירת גן": "garden_apartment",
    "פנטהאוז": "penthouse",
    "בית פרטי": "townhouse",
    "דירת גג": "rooftop",
    "קוטג": "cottage"
  };
  return map[t] || "";
}

// Map Hebrew UI -> DB slugs
function hebAreaToSlug(a) {
  const map = {
    "תל אביב": "tel-aviv",
    "רמת גן": "ramat-gan",
    גבעתיים: "givatayim",
  };
  return map[a] || "";
}

// Initialize the Assets Modal with search functionality
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
  
  // Restore swipe actions visibility
  const actions = document.querySelector(".swipe-actions");
  if (actions) actions.style.display = "flex";
  
  loadProperty();
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  const exitBtn = document.getElementById("swipeExitBtn");
  
  if (likeBtn) likeBtn.onclick = () => swipeProperty("like");
  if (dislikeBtn) dislikeBtn.onclick = () => swipeProperty("dislike");
  if (exitBtn) exitBtn.onclick = () => exitSwipeInterface();
}

// Exit swipe interface function
function exitSwipeInterface() {
  const swipeInterface = document.getElementById("swipeInterface");
  if (swipeInterface) {
    swipeInterface.style.display = "none";
    
    // Reset swipe state
    swipeIndex = 0;
    likedProperties = [];
    
    // Return to onboarding or show results
    if (likedProperties.length > 0) {
      // Show results if user had likes
      showRegistrationForm();
    } else {
      // Return to previous onboarding step
      if (currentStep > 0) {
        currentStep--;
        renderOnboardingStep();
      }
    }
    
    console.log('🚪 Exited swipe interface');
  }
}

// --- Helpers: load images for a property (manifest-based, zero probing) ---

// Path to your generated manifest (you said you added it at project root)
const MANIFEST_URL = '/manifest.json';

// Use the imageCache you already declared above
// const imageCache = new Map();

let IMG_MANIFEST = null;

// Load and cache the manifest.json file
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

// Build URLs from a manifest entry
function urlsFromManifestEntry(propId, entry) {
  const base = `/prop_pics_optimized/${propId}`;
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
    // FIX: Use manifest.properties if present
    const entry = manifest.properties ? manifest.properties[p.id] : manifest[p.id];
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

// smartImageResize function removed - was causing errors

// --- Feature map to Hebrew labels and icons ---
const FEATURE_ICONS = {
  "safe-room": "fas fa-shield-alt",    // Safe room icon
  balcony: "fas fa-coffee",          // Balcony icon (custom or use fa-window)
  parking: "fas fa-parking",          // Parking icon
  elevator: "fas fa-elevator",        // Elevator icon
  ac: "fas fa-snowflake",             // Air conditioning icon
  accessible: "fas fa-wheelchair",    // Accessibility icon
};
const FEATURE_LABELS_HE = {
  "safe-room": 'ממ"ד',
  balcony: "מרפסת",
  parking: "חניה",
  elevator: "מעלית",
  ac: "מיזוג",
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
    const currentSlides = Array.from(track.querySelectorAll(".carousel-slide"));
    track.style.width = `${currentSlides.length * 100}%`;
    const each = 100 / currentSlides.length;
    currentSlides.forEach((s) => {
      s.style.width = `${each}%`;
      s.style.flex = `0 0 ${each}%`;
    });
  };
  
  applyTrackLayout();
  window.addEventListener("resize", applyTrackLayout, { passive: true });
  
  let index = 0;
  
  // ✅ Move by one-slide fraction of the track: 100/N
  const goTo = (i) => {
    const currentSlides = Array.from(track.querySelectorAll(".carousel-slide"));
    const currentDots = Array.from(cardEl.querySelectorAll(".carousel-dot"));
    if (currentSlides.length === 0) return;
    
    index = Math.max(0, Math.min(i, currentSlides.length - 1));
    const perSlide = 100 / currentSlides.length;
    track.style.transform = `translate3d(${-index * perSlide}%, 0, 0)`;
    currentDots.forEach((d, di) => d.classList.toggle("active", di === index));
  };
  
  prev?.addEventListener("click", () => goTo(index - 1));
  next?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((d, di) => d.addEventListener("click", () => goTo(di)));
  
  // Touch
  let startX = 0, dx = 0, touching = false;
  track.addEventListener("touchstart", (e) => { touching = true; startX = e.touches[0].clientX; dx = 0; }, { passive: true });
  track.addEventListener("touchmove", (e) => { if (!touching) return; dx = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener("touchend", () => { 
    touching = false; 
    if (Math.abs(dx) > 40) {
      const currentSlides = Array.from(track.querySelectorAll(".carousel-slide"));
      const newIndex = index + (dx < 0 ? 1 : -1);
      if (newIndex >= 0 && newIndex < currentSlides.length) {
        goTo(newIndex);
      }
    }
  }, { passive: true });
  
  goTo(0);
}

// --- Description Popup Functions ---
window.showDescription = function(propertyId) {
  if (!activeSwipePool) return;
  
  const property = activeSwipePool.find(p => p.id === propertyId);
  if (!property) return;
  
  if (!property.description?.trim()) {
    alert('אין תיאור זמין לנכס זה');
    return;
  }
  
  // Create popup HTML
  const popupHTML = `
    <div class="description-overlay" id="descriptionOverlay">
      <div class="description-popup">
        <button class="close-btn" onclick="hideDescription()">×</button>
        <h3>${property.location || 'תיאור הנכס'}</h3>
        <div class="description-text">${property.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.insertAdjacentHTML('beforeend', popupHTML);
  
  // Show with animation
  requestAnimationFrame(() => {
    const overlay = document.getElementById('descriptionOverlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  });
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
};

window.hideDescription = function() {
  const overlay = document.getElementById('descriptionOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 300);
  }
};

// Event delegation for description buttons
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('description-btn')) {
    const propertyId = e.target.getAttribute('data-property-id');
    if (propertyId) {
      showDescription(propertyId);
    }
  }
  
  // Close popup on overlay click
  if (e.target && e.target.classList.contains('description-overlay')) {
    hideDescription();
  }
});

// Close popup on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideDescription();
  }
});

// --- INSTANT Property Loading with Full Carousel - User-First Approach ---
async function loadProperty() {
  const propertyCards = document.getElementById("propertyCards");
  const exitBtn = document.getElementById("swipeExitBtn");

  if (!activeSwipePool || currentPropertyIndex >= activeSwipePool.length) {
    showSwipeResults();
    return;
  }

  // Ensure exit button is visible during normal property swiping
  if (exitBtn) exitBtn.style.display = "flex";

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
        <div class="property-meta" style="color:#666; font-size:.85rem;">
          ${p.rooms ?? "-"} חד׳ · ${p.sqm ?? "-"} מ״ר ${p.floor != null ? "· קומה " + p.floor : ""}
        </div>
        <div class="property-price">${fmtNIS(p.price)} ₪</div>
        ${renderFeaturePills(p)}
        <button class="description-btn" data-property-id="${p.id}" style="margin-top: 0.4rem; padding: 0.6rem 1.2rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s ease;" onmouseover="this.style.background='#e55a00'" onmouseout="this.style.background='var(--primary-color)'">📄 צפה בתיאור המלא</button>
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
      // FIX: Use manifest.properties if present
      const entry = manifest.properties ? manifest.properties[property.id] : manifest[property.id];
      if (entry && entry.ext && entry.hero) {
        heroUrl = `/prop_pics_optimized/${property.id}/${entry.hero}.${entry.ext}`;
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
             style="width:100%;"/>
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
                 style="width:100%;"/>
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
  const exitBtn = document.getElementById("swipeExitBtn");

  if (!likedProperties.length) {
    // Hide exit button when no properties found
    if (exitBtn) exitBtn.style.display = "none";

    propertyCards.innerHTML = `
      <div style="
  text-align:center;
  color:white;
  padding: 2rem;
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  ">
        <i class="fas fa-heart-broken" style="font-size:4rem; margin-bottom:1rem; opacity:.7;"></i>
        <h3>לא מצאתם משהו שמתאים?</h3>
        <p style="margin:1rem 0;">שווה לנסות שוב.</p>
        <button data-open-contact class="cta-endswipe-button">בחזרה לתהליך</button>
      </div>`;
  } else {
    // Show exit button for registration form
    if (exitBtn) exitBtn.style.display = "flex";
    showRegistrationForm();
  }
  const actions = document.querySelector(".swipe-actions");
  if (actions) actions.style.display = "none";
}

// Show registration form after successful swiping
function showRegistrationForm() {
  console.log("🔥 DEBUG: showRegistrationForm called with", likedProperties.length, "liked properties");
  const propertyCards = document.getElementById("propertyCards");
  propertyCards.innerHTML = `
    <div class="registration-form-wrapper" style="
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      width: 90%;
    ">
      <!-- Exit Button for Registration Form -->
      <button class="swipe-exit-btn registration-exit-btn" id="regFormExitBtn" title="יציאה מממשק החדר" aria-label="יציאה מממשק החדר" style="
        position: relative;
        order: -1;
        margin-bottom: 20px;
        align-self: center;
        z-index: 10000;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      ">
        <i class="fas fa-arrow-right"></i>
      </button>

      <div style="
    text-align:center;
    color:white;
    display: block;
    position: relative;
    width: 100%;
    background: rgba(0,0,0,0.9);
    border-radius: 16px;
    ">
        <i class="fas fa-heart" style="font-size:3rem; margin-top:0.6rem; margin-bottom:0.3rem; color:#e74c3c;"></i>
      <h3 style="margin-bottom:0.3rem;">מצוין! מצאתם ${likedProperties.length} נכסים שאהבתם</h3>
      <p style="margin-bottom:0.3rem; color:#ccc;">להמשך התהליך, נשמח לקבל את הפרטים שלכם</p>
      
      <div class="register-screen" style="text-align: right;">
        <input id="fullName" type="text" placeholder="שם מלא" style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:12px; margin-bottom:1rem; box-sizing: border-box;" />
        <input id="phoneNumber" type="tel" placeholder="מספר טלפון" style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:12px; margin-bottom:1rem; box-sizing: border-box;" />

      <div class="consent-container" id="consentContainer">

        <div class="consent-item">
          <div class="custom-checkbox">
            <input type="checkbox" id="mandatoryConsent" />
            <div class="checkbox-design">
              <span class="checkmark">✓</span>
            </div>
          </div>
          <label for="mandatoryConsent">
            <span style="color:red; margin-left:4px;">*</span>
            אני מאשר/ת שיפנו אליי בקשר לנכסים אותם אבחר, וכן בקשר לנכסים נוספים שעשויים להתאים לי, וזאת בהתאם
            <a href="https://www.gov.il/he/pages/guide_tikon13_professional" target="_blank" style="color:var(--primary-color); text-decoration:underline;">לתיקון 13 לחוק הגנת הפרטיות</a>.
          </label>
        </div>

        <div class="consent-item">
          <div class="custom-checkbox">
            <input type="checkbox" id="optionalConsent" />
            <div class="checkbox-design">
              <span class="checkmark">✓</span>
            </div>
          </div>
          <label for="optionalConsent">
            אני מאשר/ת קבלת עדכונים, דו״חות ותכנים שיווקיים.
          </label>
        </div>

      </div>


        <button id="submitRegistrationBtn" style="width:100%; background:var(--primary-color); color:white; border:none; padding:0.9rem; border-radius:30px; cursor:pointer; margin-bottom:1rem; font-weight:600; box-sizing: border-box;">
          !Showtime
        </button>

        <div id="smsStep" style="display:none;">
          <input id="smsCode" type="text" placeholder="הכניסו את הקוד שקיבלתם" style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:12px; margin-bottom:1rem; box-sizing: border-box;" />
          <button id="verifyCodeBtn" style="width:100%; background:green; color:white; border:none; padding:0.9rem; border-radius:30px; cursor:pointer; font-weight:600; box-sizing: border-box;">
            המשיכו
          </button>
        </div>

      </div>
      </div>
    </div>`;
    
    // Initialize checkbox interactions for the new registration form
    initializeRegistrationCheckboxes();

    // Add exit button event listener for registration form
    const regFormExitBtn = document.getElementById('regFormExitBtn');
    if (regFormExitBtn) {
      regFormExitBtn.addEventListener('click', () => {
        const swipeInterface = document.getElementById('swipeInterface');
        if (swipeInterface) {
          swipeInterface.style.display = 'none';
        }
      });
    }
    
    // Add input event listeners with validation
    const nameInput = document.getElementById("fullName");
    const phoneInput = document.getElementById("phoneNumber");
    
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        clearInputError(nameInput);
        // Optional: Show subtle hint if invalid characters are typed
        const value = e.target.value;
        if (value && !isValidFullName(value)) {
          nameInput.style.borderColor = '#ffa500'; // Orange warning
        } else if (value && isValidFullName(value)) {
          nameInput.style.borderColor = '#28a745'; // Green success
        }
      });
    }
    
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        clearInputError(phoneInput);
        const value = e.target.value;
        
        // Auto-format as user types
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length <= 10 && cleanPhone.startsWith('05')) {
          let formatted = cleanPhone;
          if (cleanPhone.length > 3) {
            formatted = cleanPhone.substring(0, 3) + '-' + cleanPhone.substring(3);
          }
          if (cleanPhone.length > 6) {
            formatted = cleanPhone.substring(0, 3) + '-' + cleanPhone.substring(3, 6) + '-' + cleanPhone.substring(6);
          }
          e.target.value = formatted;
        }
        
        // Show validation feedback
        if (value && !isValidIsraeliPhone(value)) {
          phoneInput.style.borderColor = '#ffa500'; // Orange warning
        } else if (value && isValidIsraeliPhone(value)) {
          phoneInput.style.borderColor = '#28a745'; // Green success
        }
      });
    }
    
    // Add event listener for the submit registration button
    const submitBtn = document.getElementById("submitRegistrationBtn");
    console.log("🔥 DEBUG: Setting up submitRegistrationBtn, found:", submitBtn);
    if (submitBtn) {
      submitBtn.onclick = async () => {
        console.log("🔥 DEBUG: Submit registration button clicked!");
        const phoneRaw = (document.getElementById("phoneNumber")?.value || "").trim();
        const fullName = (document.getElementById("fullName")?.value || "").trim();

        // Clear any existing error states
        clearInputErrors();

        // Validate full name
        if (!fullName) {
          const nameInput = document.getElementById("fullName");
          setInputError(nameInput);
          return;
        }
        if (!isValidFullName(fullName)) {
          const nameInput = document.getElementById("fullName");
          setInputError(nameInput);
          return;
        }

        // Validate phone number
        if (!phoneRaw) {
          const phoneInput = document.getElementById("phoneNumber");
          setInputError(phoneInput);
          return;
        }
        if (!isValidIsraeliPhone(phoneRaw)) {
          const phoneInput = document.getElementById("phoneNumber");
          setInputError(phoneInput);
          return;
        }

        // Check mandatory consent
        const mandatoryConsent = document.getElementById("mandatoryConsent");
        if (!mandatoryConsent?.checked) {
          // Make the consent item red instead of showing toast
          const consentItem = mandatoryConsent.closest('.consent-item');
          if (consentItem) {
            consentItem.style.border = '2px solid #e74c3c';
            consentItem.style.borderRadius = '8px';
            consentItem.style.padding = '0.5rem';
            consentItem.style.backgroundColor = '#fdf2f2';
            
            // Shake animation
            consentItem.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
              if (consentItem.style.animation) {
                consentItem.style.animation = '';
              }
            }, 500);
          }
          return;
        }

        // Show loading state
        submitBtn.textContent = "זמן לאתר עבורך את הבית המושלם";
        submitBtn.disabled = true;
        submitBtn.style.background = "#ccc";

        try {
          // Store user data with formatted phone
          const formattedPhone = formatIsraeliPhone(phoneRaw);
          userData.auth = {
            phone: formattedPhone,
            name: fullName,
            mandatoryConsent: mandatoryConsent?.checked || false,
            optionalConsent: document.getElementById("optionalConsent")?.checked || false,
          };
          
          // Send email using the existing functionality
          await sendLeadEmail();
          
          // Show success state
          submitBtn.textContent = "מושלם!";
          submitBtn.style.background = "#28a745";
          
          // Wait a moment and redirect to home
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        } catch (error) {
          console.error("Registration error:", error);
          submitBtn.textContent = "שלחו לי קוד אימות";
          submitBtn.disabled = false;
          submitBtn.style.background = "var(--primary-color)";
          showToast("שגיאה בשליחה. אנא נסו שוב", "error");
        }
      };
    }
    
    // Add event listener for skip registration button
    const skipBtn = document.getElementById("skipRegistrationBtn");
    if (skipBtn) {
      skipBtn.onclick = () => {
        console.log("🔥 DEBUG: Skip registration clicked");
        // Force reload to home page
        window.location.href = window.location.origin + window.location.pathname;
      };
    }
    
    // Hover effects removed via CSS above
}

// Initialize checkbox interactions for registration form
function initializeRegistrationCheckboxes() {
  console.log("🔥 DEBUG: Initializing registration checkboxes");
  
  const mandatoryCheckbox = document.getElementById("mandatoryConsent");
  const optionalCheckbox = document.getElementById("optionalConsent");
  
  [mandatoryCheckbox, optionalCheckbox].forEach((checkbox) => {
    if (checkbox) {
      const checkboxDesign = checkbox.parentNode.querySelector('.checkbox-design');
      const checkmark = checkboxDesign?.querySelector('.checkmark');
      
      checkbox.addEventListener('change', function() {
        const consentItem = this.closest('.consent-item');
        
        if (this.checked) {
          checkboxDesign.style.borderColor = 'var(--primary-color)';
          checkboxDesign.style.backgroundColor = 'var(--primary-color)';
          if (checkmark) checkmark.style.opacity = '1';
          
          // Clear error state if this is the mandatory consent
          if (this.id === 'mandatoryConsent' && consentItem) {
            consentItem.style.border = '';
            consentItem.style.borderRadius = '';
            consentItem.style.padding = '';
            consentItem.style.backgroundColor = '';
            consentItem.style.animation = '';
          }
        } else {
          checkboxDesign.style.borderColor = '#ddd';
          checkboxDesign.style.backgroundColor = 'white';
          if (checkmark) checkmark.style.opacity = '0';
        }
      });
      
      // Also handle clicks on the design element
      if (checkboxDesign) {
        checkboxDesign.addEventListener('click', function() {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        });
      }
    }
  });
}

// Helper functions for input validation styling
function setInputError(inputElement) {
  if (!inputElement) return;
  
  inputElement.style.border = '2px solid #e74c3c';
  inputElement.style.backgroundColor = '#fdf2f2';
  inputElement.style.animation = 'shake 0.5s ease-in-out';
  
  setTimeout(() => {
    if (inputElement.style.animation) {
      inputElement.style.animation = '';
    }
  }, 500);
}

function clearInputError(inputElement) {
  if (!inputElement) return;
  
  inputElement.style.border = '1px solid #ddd';
  inputElement.style.backgroundColor = '';
  inputElement.style.animation = '';
}

function clearInputErrors() {
  const nameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phoneNumber");
  
  clearInputError(nameInput);
  clearInputError(phoneInput);
  
  // Also clear consent error
  const mandatoryConsent = document.getElementById("mandatoryConsent");
  if (mandatoryConsent) {
    const consentItem = mandatoryConsent.closest('.consent-item');
    if (consentItem) {
      consentItem.style.border = '';
      consentItem.style.borderRadius = '';
      consentItem.style.padding = '';
      consentItem.style.backgroundColor = '';
      consentItem.style.animation = '';
    }
  }
}

// Validation helper functions
function isValidFullName(name) {
  // Check if name contains only letters, spaces, Hebrew characters, and common punctuation
  const nameRegex = /^[a-zA-Zאבגדהוזחטיכלמנסעפצקרשתךםןףץ\s'-]+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
}

function isValidIsraeliPhone(phone) {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits and starts with 05
  const phoneRegex = /^05[0-9]{8}$/;
  return phoneRegex.test(cleanPhone);
}

function formatIsraeliPhone(phone) {
  // Clean the phone number and return in format 05X-XXX-XXXX
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10 && cleanPhone.startsWith('05')) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return phone; // Return original if not valid format
}

// skipRegistration function moved to event listener in showRegistrationForm

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

// kind: "info" | "error" | "success"
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

// Inline error under form (singleton)
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

// Show or hide inline error message
function showInlineError(msg, hostSelector) {
  const el = ensureInlineError(hostSelector);
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
}

// Set button loading state (disable + spinner)
function setLoading(btn, isLoading) {
  if (!btn) return;
  btn.disabled = !!isLoading;
  btn.classList.toggle("btn-loading", !!isLoading);
}

// ---- Team widget (global, executed always) ----
window.DorTeam = (function () {
  // Executive image cache
  const imageCache = new Map();
  let IMAGES_MANIFEST = null;

  // Load images manifest
  async function loadImagesManifest() {
    if (IMAGES_MANIFEST) return IMAGES_MANIFEST;
    try {
      const res = await fetch('/images.manifest.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Images manifest fetch failed: ${res.status}`);
      IMAGES_MANIFEST = await res.json();
    } catch (e) {
      console.error('[images manifest] failed to load:', e);
      IMAGES_MANIFEST = { executives: {}, folders: { executives: 'board_pics_optimized/' } };
    }
    return IMAGES_MANIFEST;
  }

  // Get executive image URL from manifest
  function getExecutiveImageUrl(execId) {
    if (!IMAGES_MANIFEST) return null;
    const filename = IMAGES_MANIFEST.executives[execId];
    if (!filename) return null;
    const folder = IMAGES_MANIFEST.folders?.executives || 'board_pics_optimized/';
    return `${folder}${filename}`;
  }

  // Preload executive images
  async function preloadExecutiveImages() {
    await loadImagesManifest();
    executiveData.forEach((exec, index) => {
      const imageUrl = getExecutiveImageUrl(exec.imageId);
      if (!imageUrl) {
        console.warn(`⚠️ No image found for executive: ${exec.name} (${exec.imageId})`);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imageCache.set(exec.imageId, img);
        console.log(`🎯 Cached executive image: ${exec.name}`);
      };
      img.onerror = () => {
        console.warn(`⚠️ Failed to cache executive image: ${exec.name}`);
      };
      img.src = imageUrl;
    });
  }

  const executiveData = [
    { name: "דוד דור", title: "מנכ\"ל | Chief Executive Officer", imageId: "david",
      description: "דוד דור עומד בחזית הפירמה מאז היום הראשון, ומוביל אותה במשך שלושה עשורים. הוא מחבר בין קריאות שוק מהירות, תמחור מדויק וסגירת עסקאות ברף הגבוה בענף.",
    },
    { name: "טליה קמינסקי", title: "סמנכ\"לית מכירות | Chief Sales Officer", imageId: "talya",
      description: "טליה קמינסקי היא הלב הפועם של הפירמה. בעברה היוותה יזמית בתחומי המוזיקה והיצירה, והצליחה לשלב רבדים אנושיים עם מומחיות נדל\"נית באופן יוצא דופן.",
    },
    { name: "דין דור", title: "סמנכ\"ל כספים | Chief Financial Officer", imageId: "din",
      description: "דין דור גדל בתוך הפירמה והפך לעמוד תווך פיננסי עם אסטרטגיה מדויקת. הוא משלב חוש טבעי למנהיגות עם שליטה במספרים ובקיאות במיסוי ובניהול סיכונים.",
    },
    { name: "רויטל דור", title: "סמנכ\"לית תפעול | Chief Operations Officer", imageId: "revital",
      description: "רויטל דור מהווה, יחד עם דוד, את שלד הפירמה מראשית דרכה ומנהלת את המערך האופרטיבי. היא מיישרת תהליכים, מגדירה סטנדרטים ומבטיחה מימוש בשטח.",
    },
    { name: "רון דור", title: "סמנכ\"ל פיתוח עסקי | Chief Business Development Officer", imageId: "ron",
      description: "רון דור מביא תפיסה אינטגרטיבית המבוססת על מתודולוגיות איתור שפיתח בספורט, בדגש על זיהוי אסימטריות ודפוסים חבויים בקנה מידה עולמי.",
    },
    { name: "שחר דור", title: "סמנכ\"לית שיווק | Chief Marketing Officer", imageId: "shahar",
      description: "שחר דור מובילה את המותג משלב האסטרטגיה ועד הביצוע בפועל. היא מייצרת ביקוש אורגני ויוצרת חיבור רגשי עמוק עם קהלים שונים ומגוונים.",
    },
    { name: "ארי גבאי", title: "ראש קהילות המשקיעים | Head of Investor Relations", imageId: "ari",
      description: "ארי גבאי מוביל קהילות משקיעים עם חזון ברור. הוא מתרגם דאטה לאינפורמציה פרקטית ומאתר עבור אינדיבידואלים הזדמנויות השקעה ייחודיות.",
    },
    { name: "ניב שירזי", title: "ראש המחלקה הפיננסית | Head of Finance", imageId: "niv",
      description: "ניב שירזי משמש יד ימינו של הדרג הבכיר עם מומחיות גבוהה במימון עסקאות ובדיקות נאותות. הוא ממזג בין ניתוח קר ובין גמישות מחשבתית.",
    }
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

    if (photo) {
      // Use cached image if available for smoother loading
      const cachedImg = imageCache.get(e.imageId);
      if (cachedImg) {
        photo.src = cachedImg.src;
      } else {
        const imageUrl = getExecutiveImageUrl(e.imageId);
        photo.src = imageUrl || '/gen_pic/placeholder.jpg';
      }
      photo.alt = e.name;
    }
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

  async function init() {
    await loadImagesManifest();
    buildDots();
    render();
    preloadExecutiveImages(); // Cache all executive images on initialization
  }

  return {
    init,
    next() { if (total()) { idx = mod(idx + 1, total()); render(); } },
    prev() { if (total()) { idx = mod(idx - 1, total()); render(); } }
  };
})();

// ---- AboutTeam widget for About Modal ----
window.AboutTeam = (function () {
  // Executive image cache for About modal
  const imageCache = new Map();
  let IMAGES_MANIFEST = null;

  // Load images manifest
  async function loadImagesManifest() {
    if (IMAGES_MANIFEST) return IMAGES_MANIFEST;
    try {
      const res = await fetch('/images.manifest.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Images manifest fetch failed: ${res.status}`);
      IMAGES_MANIFEST = await res.json();
    } catch (e) {
      console.error('[images manifest] failed to load:', e);
      IMAGES_MANIFEST = { executives: {}, folders: { executives: 'board_pics_optimized/' } };
    }
    return IMAGES_MANIFEST;
  }

  // Get executive image URL from manifest
  function getExecutiveImageUrl(execId) {
    if (!IMAGES_MANIFEST) return null;
    const filename = IMAGES_MANIFEST.executives[execId];
    if (!filename) return null;
    const folder = IMAGES_MANIFEST.folders?.executives || 'board_pics_optimized/';
    return `${folder}${filename}`;
  }

  // Use same executive data as DorTeam
  const executiveData = [
    { name: "דוד דור", title: "מנכ\"ל | Chief Executive Officer", imageId: "david",
      description: "דוד דור עומד בחזית הפירמה מאז היום הראשון, ומוביל אותה במשך שלושה עשורים. הוא מחבר בין קריאות שוק מהירות, תמחור מדויק וסגירת עסקאות ברף הגבוה בענף.",
    },
    { name: "טליה קמינסקי", title: "סמנכ\"לית מכירות | Chief Sales Officer", imageId: "talya",
      description: "טליה קמינסקי היא הלב הפועם של הפירמה. בעברה היוותה יזמית בתחומי המוזיקה והיצירה, והצליחה לשלב רבדים אנושיים עם מומחיות נדל\"נית באופן יוצא דופן.",
    },
    { name: "דין דור", title: "סמנכ\"ל כספים | Chief Financial Officer", imageId: "din",
      description: "דין דור גדל בתוך הפירמה והפך לעמוד תווך פיננסי עם אסטרטגיה מדויקת. הוא משלב חוש טבעי למנהיגות עם שליטה במספרים ובקיאות במיסוי ובניהול סיכונים.",
    },
    { name: "רויטל דור", title: "סמנכ\"לית תפעול | Chief Operations Officer", imageId: "revital",
      description: "רויטל דור מהווה, יחד עם דוד, את שלד הפירמה מראשית דרכה ומנהלת את המערך האופרטיבי. היא מיישרת תהליכים, מגדירה סטנדרטים ומבטיחה מימוש בשטח.",
    },
    { name: "רון דור", title: "סמנכ\"ל פיתוח עסקי | Chief Business Development Officer", imageId: "ron",
      description: "רון דור מביא תפיסה אינטגרטיבית המבוססת על מתודולוגיות איתור שפיתח בספורט, בדגש על זיהוי אסימטריות ודפוסים חבויים בקנה מידה עולמי.",
    },
    { name: "שחר דור", title: "סמנכ\"לית שיווק | Chief Marketing Officer", imageId: "shahar",
      description: "שחר דור מובילה את המותג משלב האסטרטגיה ועד הביצוע בפועל. היא מייצרת ביקוש אורגני ויוצרת חיבור רגשי עמוק עם קהלים שונים ומגוונים.",
    },
    { name: "ארי גבאי", title: "ראש קהילות המשקיעים | Head of Investor Relations", imageId: "ari",
      description: "ארי גבאי מוביל קהילות משקיעים עם חזון ברור. הוא מתרגם דאטה לאינפורמציה פרקטית ומאתר עבור אינדיבידואלים הזדמנויות השקעה ייחודיות.",
    },
    { name: "ניב שירזי", title: "ראש המחלקה הפיננסית | Head of Finance", imageId: "niv",
      description: "ניב שירזי משמש יד ימינו של הדרג הבכיר עם מומחיות גבוהה במימון עסקאות ובדיקות נאותות. הוא ממזג בין ניתוח קר ובין גמישות מחשבתית.",
    }
  ];

  // Preload executive images
  async function preloadExecutiveImages() {
    await loadImagesManifest();
    executiveData.forEach((exec, index) => {
      const imageUrl = getExecutiveImageUrl(exec.imageId);
      if (!imageUrl) {
        console.warn(`⚠️ No image found for executive in About: ${exec.name} (${exec.imageId})`);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imageCache.set(exec.imageId, img);
        console.log(`🎯 Cached executive image for About: ${exec.name}`);
      };
      img.onerror = () => {
        console.warn(`⚠️ Failed to cache executive image for About: ${exec.name}`);
      };
      img.src = imageUrl;
    });
  }

  let idx = 0;
  const total = () => executiveData.length;
  const mod = (n, m) => ((n % m) + m) % m;

  function render() {
    const t = total();
    const counter = document.getElementById('about-executive-counter');
    const bar = document.getElementById('about-progress-bar');
    if (!t) { if (counter) counter.textContent = '0/0'; if (bar) bar.style.width = '0%'; return; }

    const e = executiveData[idx = Math.max(0, Math.min(idx, t - 1))];

    const photo = document.getElementById('about-exec-photo');
    const name  = document.getElementById('about-exec-name');
    const title = document.getElementById('about-exec-title');
    const desc  = document.getElementById('about-exec-description');

    if (photo) {
      // Use cached image if available for smoother loading
      const cachedImg = imageCache.get(e.imageId);
      if (cachedImg) {
        photo.src = cachedImg.src;
      } else {
        const imageUrl = getExecutiveImageUrl(e.imageId);
        photo.src = imageUrl || '/gen_pic/placeholder.jpg';
      }
      photo.alt = e.name;
    }
    if (name)  name.textContent = e.name;
    if (title) title.textContent = e.title;
    if (desc)  desc.textContent  = e.description;

    if (counter) counter.textContent = (idx + 1) + '/' + t;
    if (bar)     bar.style.width = (((idx + 1) / t) * 100) + '%';

    document.querySelectorAll('#about-team-dots .team-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  function buildDots() {
    const wrap = document.getElementById('about-team-dots');
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

  async function init() {
    await loadImagesManifest();
    buildDots();
    render();
    preloadExecutiveImages(); // Cache all executive images on initialization
  }

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

// Mobile Hamburger Menu Functionality
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
  
  if (!hamburgerBtn || !mobileMenuOverlay || !mobileMenuBackdrop) return;
  
  function openMenu() {
    hamburgerBtn.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    mobileMenuBackdrop.classList.add('active');
    document.body.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    mobileMenuBackdrop.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
    
    // Close all expanded submenus when closing main menu
    document.querySelectorAll('.mobile-submenu.expanded').forEach(submenu => {
      submenu.classList.remove('expanded');
    });
  }
  
  // Toggle menu on hamburger click
  hamburgerBtn.addEventListener('click', function() {
    if (hamburgerBtn.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close menu when clicking on backdrop
  mobileMenuBackdrop.addEventListener('click', closeMenu);
  
  // Handle mobile submenu toggles
  const mobileSubmenuTriggers = document.querySelectorAll('.mobile-submenu-trigger');
  mobileSubmenuTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const submenu = this.closest('.mobile-submenu');
      const isExpanded = submenu.classList.contains('expanded');
      
      // Close all other submenus
      document.querySelectorAll('.mobile-submenu.expanded').forEach(openSubmenu => {
        if (openSubmenu !== submenu) {
          openSubmenu.classList.remove('expanded');
        }
      });
      
      // Toggle current submenu
      submenu.classList.toggle('expanded', !isExpanded);
    });
  });
  
  // Close menu when clicking on a menu item (excluding submenu triggers)
  mobileMenuLinks.forEach(link => {
    if (!link.classList.contains('mobile-submenu-trigger')) {
      link.addEventListener('click', closeMenu);
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && hamburgerBtn.classList.contains('active')) {
      closeMenu();
    }
  });
}

// ========================================
// FLOATING CTA BUTTON VISIBILITY CONTROL
// ========================================

function updateFloatingCtaVisibility() {
  if (!floatingCtaContainer) return;

  // Check if mobile menu is open
  const isMobileMenuOpen = document.body.classList.contains('mobile-menu-open');

  // Check if any modal is open
  const isModalOpen = modalOverlay && modalOverlay.classList.contains('active');

  // Check if onboarding/property interface is active
  const isOnboardingActive = onboardingOverlay && onboardingOverlay.classList.contains('active');
  const isSwipeInterfaceActive = swipeInterface && swipeInterface.style.display !== 'none';

  // Hide button if any of these conditions are true
  const shouldHide = isMobileMenuOpen || isModalOpen || isOnboardingActive || isSwipeInterfaceActive;

  if (shouldHide) {
    floatingCtaContainer.classList.add('hidden');
  } else {
    floatingCtaContainer.classList.remove('hidden');
  }
}

// Initialize floating CTA visibility updates
function initFloatingCta() {
  if (!floatingCtaContainer) return;

  // Initial visibility check
  updateFloatingCtaVisibility();

  // Monitor for changes that affect visibility
  const observer = new MutationObserver(() => {
    updateFloatingCtaVisibility();
  });

  // Watch for class changes on body and overlay elements
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  if (modalOverlay) {
    observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  if (onboardingOverlay) {
    observer.observe(onboardingOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  if (swipeInterface) {
    observer.observe(swipeInterface, { attributes: true, attributeFilter: ['style'] });
  }
}

// ========================================
// ACCESSIBILITY TOOLBAR VISIBILITY CONTROL
// ========================================

function updateAccessibilityToolbarVisibility() {
  const toolbar = document.getElementById("a11y-toolbar");
  if (!toolbar) return;

  // Always ensure accessibility toolbar is visible regardless of mobile menu or modal state
  // This is critical for accessibility compliance - users must always have access to accessibility tools
  toolbar.style.display = '';
  toolbar.style.visibility = 'visible';
  toolbar.style.opacity = '1';
  toolbar.style.pointerEvents = 'auto';

  // Ensure proper z-index to stay above modals and mobile menu
  toolbar.style.zIndex = '10000';
}

// Initialize accessibility toolbar visibility management
function initAccessibilityToolbarVisibility() {
  const toolbar = document.getElementById("a11y-toolbar");
  if (!toolbar) return;

  // Initial visibility check
  updateAccessibilityToolbarVisibility();

  // Monitor for changes that might affect visibility
  const observer = new MutationObserver(() => {
    updateAccessibilityToolbarVisibility();
  });

  // Watch for class changes on body and overlay elements
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  if (modalOverlay) {
    observer.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  const onboardingOverlay = document.getElementById("onboardingOverlay");
  if (onboardingOverlay) {
    observer.observe(onboardingOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  const swipeInterface = document.getElementById("swipeInterface");
  if (swipeInterface) {
    observer.observe(swipeInterface, { attributes: true, attributeFilter: ['style'] });
  }
}

// Initialize mobile menu when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initCounterAnimation();
  initFloatingCta();
  initAccessibilityToolbarVisibility();
});

// ========================================
// ENHANCED COUNTER ANIMATION
// ========================================

function initCounterAnimation() {
  const counters = document.querySelectorAll('.animated-counter');
  const options = {
    threshold: 0.7,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counting')) {
        animateCounter(entry.target);
      }
    });
  }, options);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(counter) {
  const target = parseInt(counter.dataset.target);
  const suffix = counter.dataset.suffix || '';
  const duration = 2000; // 2 seconds
  const step = target / (duration / 16); // 60fps
  
  let current = 0;
  counter.classList.add('counting');
  
  const timer = setInterval(() => {
    current += step;
    
    if (current >= target) {
      // Format final number with commas if >= 1000
      let displayValue;
      if (target >= 1000) {
        displayValue = target.toLocaleString('he-IL');
      } else {
        displayValue = target;
      }
      counter.textContent = displayValue + suffix;
      clearInterval(timer);
    } else {
      // Format the number based on its size
      let displayValue;
      if (target >= 1000) {
        displayValue = Math.floor(current).toLocaleString('he-IL');
      } else {
        displayValue = Math.floor(current);
      }
      counter.textContent = displayValue + suffix;
    }
  }, 16);

  // Add stagger effect to multiple counters
  const allCounters = document.querySelectorAll('.animated-counter');
  const currentIndex = Array.from(allCounters).indexOf(counter);
  
  counter.style.animationDelay = `${currentIndex * 0.2}s`;
}