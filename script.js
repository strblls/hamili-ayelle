// ============================================================
// CONFIG — edit this message to whatever you want to say 💌
// ============================================================
const FINAL_MESSAGE =
  "Okay, real talk for a second.\n\n" +
  "You make the most ordinary days feel like they're worth showing up for. " +
  "I don't say it enough, so I built you a whole silly website just to say it once, properly.\n\n" +
  "Thank you for being you. I like you a stupid amount. 💗";

// ============================================================
// PAGE NAVIGATION
// ============================================================
const pages = Array.from(document.querySelectorAll(".page"));
let currentIndex = 0;
let isTransitioning = false;

function goToPage(index){
  if (isTransitioning || index === currentIndex || index < 0 || index >= pages.length) return;

  isTransitioning = true;
  const current = pages[currentIndex];
  const next = pages[index];

  // Immediately make next page active and animate in
  next.classList.remove("leave");
  next.classList.add("active", "enter");

  // Animate current page out
  current.classList.remove("enter");
  current.classList.add("leave");

  currentIndex = index;

  setTimeout(() => {
    current.classList.remove("active", "leave");
    next.classList.remove("enter");
    isTransitioning = false;

    if (index === pages.length - 1){
      startFinalSequence();
    }
  }, 480);
}

document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click", ()=> goToPage(currentIndex + 1));
});
document.querySelectorAll("[data-prev]").forEach(btn=>{
  btn.addEventListener("click", ()=> goToPage(currentIndex - 1));
});
document.querySelectorAll("[data-goto]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const target = parseInt(btn.dataset.goto, 10);
    // reset typewriter state so it can replay
    typedOnce = false;
    goToPage(target);
  });
});

// ============================================================
// BUTTON RIPPLE
// ============================================================
document.addEventListener("click", (e)=>{
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height);
  ripple.className = "ripple";
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = (e.clientX - rect.left - size/2) + "px";
  ripple.style.top = (e.clientY - rect.top - size/2) + "px";
  btn.appendChild(ripple);
  setTimeout(()=> ripple.remove(), 650);
});

// ============================================================
// FLOATING HEARTS BACKGROUND
// ============================================================
const heartsBg = document.getElementById("hearts-bg");
const heartEmojis = ["💗","💕","💖","🌸","💜"];

function spawnBgHeart(){
  const heart = document.createElement("span");
  heart.className = "heart-particle";
  heart.textContent = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
  heart.style.left = Math.random()*100 + "vw";
  const duration = 8 + Math.random()*8;
  heart.style.animationDuration = duration + "s";
  heart.style.fontSize = (14 + Math.random()*16) + "px";
  heartsBg.appendChild(heart);
  setTimeout(()=> heart.remove(), duration*1000 + 200);
}
setInterval(spawnBgHeart, 550);
for (let i=0;i<8;i++) setTimeout(spawnBgHeart, i*300);

// ============================================================
// CURSOR / TOUCH HEART TRAIL
// ============================================================
const cursorLayer = document.getElementById("cursor-layer");
let lastTrail = 0;

function spawnCursorHeart(x, y){
  const now = Date.now();
  if (now - lastTrail < 60) return;
  lastTrail = now;
  const heart = document.createElement("span");
  heart.className = "cursor-heart";
  heart.textContent = Math.random() > 0.5 ? "💗" : "✨";
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  cursorLayer.appendChild(heart);
  setTimeout(()=> heart.remove(), 900);
}

window.addEventListener("mousemove", (e)=> spawnCursorHeart(e.clientX, e.clientY));
window.addEventListener("touchmove", (e)=>{
  const t = e.touches[0];
  if (t) spawnCursorHeart(t.clientX, t.clientY);
}, { passive: true });

// ============================================================
// BACKGROUND MUSIC — fade in on first interaction
// ============================================================
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let musicStarted = false;
let musicMuted = false;

function fadeInMusic(){
  if (musicStarted) return;
  musicStarted = true;
  music.volume = 0;
  music.play().catch(()=>{ /* file may be missing until user adds music.mp3 */ });
  let vol = 0;
  const fade = setInterval(()=>{
    vol += 0.04;
    if (vol >= 0.6){
      vol = 0.6;
      clearInterval(fade);
    }
    music.volume = vol;
  }, 120);
}

function startMusicOnFirstInteraction(){
  fadeInMusic();
  window.removeEventListener("click", startMusicOnFirstInteraction);
  window.removeEventListener("touchstart", startMusicOnFirstInteraction);
}
window.addEventListener("click", startMusicOnFirstInteraction);
window.addEventListener("touchstart", startMusicOnFirstInteraction);

musicToggle.addEventListener("click", (e)=>{
  e.stopPropagation();
  musicMuted = !musicMuted;
  music.muted = musicMuted;
  musicToggle.classList.toggle("muted", musicMuted);
  musicToggle.textContent = musicMuted ? "🔇" : "🎵";
});

// ============================================================
// SPARKLES around final text
// ============================================================
const sparkleWrap = document.getElementById("sparkle-wrap");
function scatterSparkles(){
  sparkleWrap.innerHTML = "";
  const spots = [
    {top:"6%", left:"8%"}, {top:"14%", left:"85%"}, {top:"40%", left:"4%"},
    {top:"55%", left:"92%"}, {top:"80%", left:"12%"}, {top:"85%", left:"80%"},
    {top:"25%", left:"50%"}, {top:"65%", left:"55%"}
  ];
  spots.forEach((pos, i)=>{
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = "✨";
    s.style.top = pos.top;
    s.style.left = pos.left;
    s.style.animationDelay = (i * 0.22) + "s";
    sparkleWrap.appendChild(s);
  });
}

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
const typewriterEl = document.getElementById("typewriter");
const typeCursor = document.getElementById("type-cursor");
const restartBtn = document.getElementById("restart-btn");
let typedOnce = false;

function typeWriter(text, onDone){
  typewriterEl.textContent = "";
  let i = 0;
  const speed = 32;
  (function tick(){
    if (i < text.length){
      typewriterEl.textContent += text.charAt(i);
      i++;
      const char = text.charAt(i-1);
      const delay = (char === "." || char === "\n") ? speed*6 : speed;
      setTimeout(tick, delay);
    } else {
      onDone && onDone();
    }
  })();
}

function startFinalSequence(){
  if (typedOnce) return;
  typedOnce = true;
  scatterSparkles();
  typeCursor.style.display = "inline";
  restartBtn.classList.remove("shown");

  setTimeout(()=>{
    typeWriter(FINAL_MESSAGE, ()=>{
      typeCursor.style.display = "none";
      heartsBurst();
      launchConfetti();
      restartBtn.classList.add("shown");
    });
  }, 500);
}

// ============================================================
// HEARTS BURST
// ============================================================
function heartsBurst(){
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const emojis = ["💗","💖","💕","💞","🌸"];

  for (let i=0;i<28;i++){
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    heart.style.left = centerX + "px";
    heart.style.top = centerY + "px";

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 220;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    heart.style.setProperty("--burst-transform", `translate(${tx}px, ${ty}px) scale(1.3) rotate(${(Math.random()*80)-40}deg)`);
    heart.style.animationDelay = (Math.random()*0.15) + "s";

    document.body.appendChild(heart);
    setTimeout(()=> heart.remove(), 1400);
  }
}

// ============================================================
// CONFETTI
// ============================================================
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(){
  const colors = ["#ff9ecb", "#c9a8ff", "#8a5cf6", "#ffd6ec", "#ffffff"];
  confettiPieces = [];
  for (let i=0;i<130;i++){
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random()*6,
      h: 10 + Math.random()*8,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random() * Math.PI,
      vRot: (Math.random()-0.5) * 0.2,
      vy: 2 + Math.random()*3,
      vx: (Math.random()-0.5) * 2,
      life: 0,
      maxLife: 260 + Math.random()*80
    });
  }
  if (!confettiRunning){
    confettiRunning = true;
    requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let alive = false;

  confettiPieces.forEach(p=>{
    p.life++;
    if (p.life > p.maxLife) return;
    alive = true;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vRot;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    const fade = 1 - Math.max(0, (p.life - p.maxLife*0.7) / (p.maxLife*0.3));
    ctx.globalAlpha = Math.max(0, Math.min(1, fade));
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  });

  if (alive){
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}
