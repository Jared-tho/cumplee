const birthdayCard = document.querySelector("#birthdayCard");
const openCard = document.querySelector("#openCard");
const cardMessage = document.querySelector("#cardMessage");
const cardHint = document.querySelector("#cardHint");
const resetCard = document.querySelector("#resetCard");
const toast = document.querySelector("#toast");
const canvas = document.querySelector("#confettiCanvas");
const context = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function refreshIcons() {
  if (typeof lucide !== "undefined" && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }
}

refreshIcons();

let toastTimer;
let confetti = [];
let animationFrame;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createConfetti() {
  const colors = ["#ff7f70", "#ffd166", "#83d8ef", "#b5a4ff", "#a9efdc", "#ef8cb7"];
  const amount = reduceMotion.matches ? 18 : 125;

  confetti = Array.from({ length: amount }, (_, index) => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 130,
    y: window.innerHeight * 0.46,
    width: 5 + Math.random() * 7,
    height: 3 + Math.random() * 5,
    color: colors[index % colors.length],
    velocityX: (Math.random() - 0.5) * 14,
    velocityY: -7 - Math.random() * 8,
    gravity: 0.17 + Math.random() * 0.08,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.24,
    opacity: 1
  }));

  window.cancelAnimationFrame(animationFrame);
  animateConfetti();
}

function animateConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti.forEach((piece) => {
    piece.x += piece.velocityX;
    piece.y += piece.velocityY;
    piece.velocityY += piece.gravity;
    piece.rotation += piece.rotationSpeed;
    piece.opacity -= 0.006;

    context.save();
    context.globalAlpha = Math.max(piece.opacity, 0);
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
    context.restore();
  });

  confetti = confetti.filter((piece) => piece.opacity > 0 && piece.y < window.innerHeight + 30);
  if (confetti.length) {
    animationFrame = window.requestAnimationFrame(animateConfetti);
  } else {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function openBirthdayCard() {
  birthdayCard.classList.add("is-open");
  openCard.setAttribute("aria-expanded", "true");
  cardMessage.hidden = false;
  cardHint.hidden = true;
  resetCard.hidden = false;
  createConfetti();
  showToast("Feliz cumpleaños, Majo ✦");
}

function closeBirthdayCard() {
  birthdayCard.classList.remove("is-open");
  openCard.setAttribute("aria-expanded", "false");
  cardHint.hidden = false;
  resetCard.hidden = true;
  openCard.focus();
  window.setTimeout(() => {
    cardMessage.hidden = true;
  }, reduceMotion.matches ? 0 : 650);
}

openCard.addEventListener("click", openBirthdayCard);
resetCard.addEventListener("click", closeBirthdayCard);
resetCard.addEventListener("pointerup", closeBirthdayCard);
document.addEventListener("click", (event) => {
  if (event.target.closest("#resetCard")) {
    closeBirthdayCard();
  }
});
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
