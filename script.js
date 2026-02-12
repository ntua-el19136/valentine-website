// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, my love...`;
    
    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements
    createFloatingElements();

    // Setup music player
    setupMusicPlayer();
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    // Create hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // Create bears
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Set random position for floating elements
function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// Function to show next question
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}

// Function to move the "No" button when clicked
function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;
    
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';
        
        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Create heart explosion effect
    createHeartExplosion();
}

// Create heart explosion animation
function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}

// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    // Only show controls if music is enabled in config
    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    // Set music source and volume
    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    // Try autoplay if enabled
    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText;
            });
        }
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
} 

// =========================
// No button: 3 clicks -> show image + message modal
// =========================
let noClicks = 0;

// Βάλε εδώ το URL της PNG φωτογραφίας σου
const NO_IMAGE_URL = "https://res.cloudinary.com/ddwmdbq49/image/upload/v1770915765/I4_hfuvuz.png";

// Γράψε εδώ το μήνυμα που θες να φαίνεται δίπλα
const NO_MESSAGE_TEXT = "Change your mind or else I will find you and I will touch you unappropriately ...";

// Τι θα γράφει το κουμπί
const NO_CLOSE_BUTTON_TEXT = "Yes, sir 🥺​";

// Δημιουργεί modal once και το προσθέτει στο body
function ensureNoModalExists() {
  let overlay = document.getElementById("noModalOverlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "noModalOverlay";
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.35)";
    overlay.style.zIndex = "99999";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";

    // wrapper
    const wrap = document.createElement("div");
    wrap.id = "noModalWrap";
    wrap.style.display = "flex";
    wrap.style.gap = "16px";
    wrap.style.alignItems = "center";
    wrap.style.maxWidth = "920px";
    wrap.style.width = "min(920px, 100%)";

    // image
    const img = document.createElement("img");
    img.id = "noModalImg";
    img.alt = "surprise";
    img.style.maxWidth = "min(360px, 45vw)";
    img.style.maxHeight = "70vh";
    img.style.borderRadius = "18px";
    img.style.objectFit = "contain";
    img.style.boxShadow = "0 12px 40px rgba(0,0,0,0.25)";
    img.style.background = "transparent";

    // message card
    const card = document.createElement("div");
    card.id = "noModalCard";
    card.style.flex = "1";
    card.style.padding = "18px 18px 14px";
    card.style.borderRadius = "18px";
    card.style.background = "rgba(255,255,255,0.92)";
    card.style.backdropFilter = "blur(6px)";
    card.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";

    const msg = document.createElement("div");
    msg.id = "noModalMsg";
    msg.style.fontSize = "18px";
    msg.style.lineHeight = "1.4";
    msg.style.color = "#222";
    msg.style.fontWeight = "600";

    const btn = document.createElement("button");
    btn.id = "noModalCloseBtn";
    btn.type = "button";
    btn.style.border = "none";
    btn.style.padding = "12px 14px";
    btn.style.borderRadius = "14px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "16px";
    btn.style.fontWeight = "700";
    btn.style.alignSelf = "flex-start";
    btn.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
    btn.style.background = (config?.colors?.buttonBackground) || "#ff6b6b";
    btn.style.color = "#fff";

    btn.addEventListener("click", () => {
      // κλείσιμο modal και επιστροφή στην προηγούμενη κατάσταση
      overlay.style.display = "none";
    });

    card.appendChild(msg);
    card.appendChild(btn);

    wrap.appendChild(img);
    wrap.appendChild(card);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);
  }

  return overlay;
}

function showNoModal() {
  const overlay = ensureNoModalExists();
  const img = document.getElementById("noModalImg");
  const msg = document.getElementById("noModalMsg");
  const btn = document.getElementById("noModalCloseBtn");

  img.src = NO_IMAGE_URL;
  msg.textContent = NO_MESSAGE_TEXT;
  btn.textContent = NO_CLOSE_BUTTON_TEXT;

  overlay.style.display = "flex";
}

function handleNoClick(button) {
  noClicks++;

  // κρατάμε τη δική σου συμπεριφορά: να μετακινείται το κουμπί
  moveButton(button);

  if (noClicks === 3) {
    showNoModal();
  }
}

// Συνδέουμε handlers στα No buttons (Q1 και Q3)
window.addEventListener("DOMContentLoaded", () => {
  const noBtn1 = document.getElementById("noBtn1");
  const noBtn3 = document.getElementById("noBtn3");

  if (noBtn1) noBtn1.addEventListener("click", () => handleNoClick(noBtn1));
  if (noBtn3) noBtn3.addEventListener("click", () => handleNoClick(noBtn3));
});

// =========================
// Yes button: 3 clicks -> show image + message modal (custom)
// =========================
let yesClicks = 0;

// Βάλε εδώ το URL της εικόνας που θες για το YES popup
const YES_IMAGE_URL = "https://res.cloudinary.com/ddwmdbq49/image/upload/v1770918393/I5_qfwngg.png";

// Γράψε εδώ το μήνυμα που θες να φαίνεται δίπλα
const YES_MESSAGE_TEXT = "Better answer this time, but still not what I like to hear. You are a better girl than this, so find the correct answer NOW!";

// Τι θα γράφει το κουμπί
const YES_CLOSE_BUTTON_TEXT = "Yes sir, I am a good girl and I will do exactly that 🥰​";

function ensureYesModalExists() {
  let overlay = document.getElementById("yesModalOverlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "yesModalOverlay";
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.35)";
    overlay.style.zIndex = "99999";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";

    const wrap = document.createElement("div");
    wrap.id = "yesModalWrap";
    wrap.style.display = "flex";
    wrap.style.gap = "16px";
    wrap.style.alignItems = "center";
    wrap.style.maxWidth = "920px";
    wrap.style.width = "min(920px, 100%)";

    const img = document.createElement("img");
    img.id = "yesModalImg";
    img.alt = "yay";
    img.style.maxWidth = "min(360px, 45vw)";
    img.style.maxHeight = "70vh";
    img.style.borderRadius = "18px";
    img.style.objectFit = "contain";
    img.style.boxShadow = "0 12px 40px rgba(0,0,0,0.25)";
    img.style.background = "transparent";

    const card = document.createElement("div");
    card.id = "yesModalCard";
    card.style.flex = "1";
    card.style.padding = "18px 18px 14px";
    card.style.borderRadius = "18px";
    card.style.background = "rgba(255,255,255,0.92)";
    card.style.backdropFilter = "blur(6px)";
    card.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";

    const msg = document.createElement("div");
    msg.id = "yesModalMsg";
    msg.style.fontSize = "18px";
    msg.style.lineHeight = "1.4";
    msg.style.color = "#222";
    msg.style.fontWeight = "600";

    const btn = document.createElement("button");
    btn.id = "yesModalCloseBtn";
    btn.type = "button";
    btn.style.border = "none";
    btn.style.padding = "12px 14px";
    btn.style.borderRadius = "14px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "16px";
    btn.style.fontWeight = "700";
    btn.style.alignSelf = "flex-start";
    btn.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
    btn.style.background = (config?.colors?.buttonBackground) || "#ff6b6b";
    btn.style.color = "#fff";

    btn.addEventListener("click", () => {
      overlay.style.display = "none";
    });

    card.appendChild(msg);
    card.appendChild(btn);

    wrap.appendChild(img);
    wrap.appendChild(card);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);
  }

  return overlay;
}

function showYesModal() {
  const overlay = ensureYesModalExists();
  const img = document.getElementById("yesModalImg");
  const msg = document.getElementById("yesModalMsg");
  const btn = document.getElementById("yesModalCloseBtn");

  img.src = YES_IMAGE_URL;
  msg.textContent = YES_MESSAGE_TEXT;
  btn.textContent = YES_CLOSE_BUTTON_TEXT;

  overlay.style.display = "flex";
}

function handleYesClick() {
  yesClicks++;

  if (yesClicks === 3) {
    showYesModal();
  }
}

// Συνδέουμε handlers στα Yes buttons (Q1 και Q3)
window.addEventListener("DOMContentLoaded", () => {
  const yesBtn1 = document.getElementById("yesBtn1");
  const yesBtn3 = document.getElementById("yesBtn3");

  if (yesBtn1) yesBtn1.addEventListener("click", handleYesClick);
  if (yesBtn3) yesBtn3.addEventListener("click", handleYesClick);
});
