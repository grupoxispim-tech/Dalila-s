document.documentElement.classList.add("js-enabled");

const contactConfig = {
  email: ""
};

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = [...document.querySelectorAll(".gallery-item")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    galleryItems.forEach((item) => {
      item.hidden = selectedFilter !== "all" && item.dataset.category !== selectedFilter;
    });
  });
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
let activeGalleryIndex = 0;
let lastGalleryTrigger = null;

function visibleGalleryItems() {
  return galleryItems.filter((item) => !item.hidden);
}

function showGalleryImage(index) {
  const visibleItems = visibleGalleryItems();
  activeGalleryIndex = (index + visibleItems.length) % visibleItems.length;
  const item = visibleItems[activeGalleryIndex];
  const image = item.querySelector("img");
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    lastGalleryTrigger = item;
    showGalleryImage(visibleGalleryItems().indexOf(item));
    lightbox.showModal();
  });
});
document.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
document.querySelector("[data-close-lightbox]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  lastGalleryTrigger?.focus();
});
document.addEventListener("keydown", (event) => {
  if (videoDialog.open && event.key === "Escape") {
    event.preventDefault();
    closeVideo();
    return;
  }
  if (!lightbox.open) return;
  if (event.key === "Escape") {
    event.preventDefault();
    lightbox.close();
    return;
  }
  if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
  if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
});

const compareRange = document.querySelector("#compare-range");
const compareFrame = document.querySelector("#compare-frame");
compareRange.addEventListener("input", () => {
  compareFrame.style.setProperty("--compare-position", `${compareRange.value}%`);
});

const videoDialog = document.querySelector("#video-dialog");
const videoPlayer = document.querySelector("#video-player");
const soundtrackPlayer = document.querySelector("#soundtrack-player");
const videoCaption = document.querySelector("#video-caption");
let lastVideoTrigger = null;

document.querySelectorAll(".video-card").forEach((card) => {
  card.addEventListener("click", async () => {
    lastVideoTrigger = card;
    videoPlayer.src = card.dataset.video;
    videoPlayer.muted = true;
    soundtrackPlayer.src = card.dataset.music;
    soundtrackPlayer.volume = 0.25;
    soundtrackPlayer.loop = true;
    videoCaption.textContent = card.dataset.title;
    videoDialog.showModal();
    const [videoPlayback, soundtrackPlayback] = await Promise.allSettled([
      videoPlayer.play(),
      soundtrackPlayer.play(),
    ]);
    if (videoPlayback.status === "rejected") {
      videoCaption.textContent = `${card.dataset.title} — video playback failed.`;
    } else if (soundtrackPlayback.status === "rejected") {
      videoCaption.textContent = `${card.dataset.title} — soundtrack playback failed.`;
    }
  });
});

function closeVideo() {
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  soundtrackPlayer.pause();
  soundtrackPlayer.removeAttribute("src");
  soundtrackPlayer.load();
  videoDialog.close();
}

videoPlayer.addEventListener("pause", () => soundtrackPlayer.pause());
videoPlayer.addEventListener("play", () => {
  if (soundtrackPlayer.src && soundtrackPlayer.paused) {
    soundtrackPlayer.play().catch(() => {
      videoCaption.textContent = `${lastVideoTrigger?.dataset.title ?? "Video"} — soundtrack playback failed.`;
    });
  }
});
videoPlayer.addEventListener("ended", () => {
  soundtrackPlayer.pause();
  soundtrackPlayer.currentTime = 0;
});

document.querySelector("[data-close-video]").addEventListener("click", closeVideo);
videoDialog.addEventListener("click", (event) => {
  if (event.target === videoDialog) closeVideo();
});
videoDialog.addEventListener("close", () => {
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  soundtrackPlayer.pause();
  soundtrackPlayer.removeAttribute("src");
  soundtrackPlayer.load();
  lastVideoTrigger?.focus();
});

const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";
  if (!quoteForm.reportValidity()) return;
  const formData = new FormData(quoteForm);
  const text = [
    "New cleaning quote request",
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Email: ${formData.get("email") || "Not provided"}`,
    `Preferred date: ${formData.get("preferredDate") || "Flexible"}`,
    `Service: ${formData.get("service")}`,
    "",
    String(formData.get("message"))
  ].join("\n");
  const whatsappUrl = `https://wa.me/12675041269?text=${encodeURIComponent(text)}`;
  const smsUrl = `sms:+12675041269?&body=${encodeURIComponent(text)}`;

  formStatus.textContent = "Opening WhatsApp and Messages with your request. If one didn't open, use: ";
  [["WhatsApp", whatsappUrl, "_blank"], ["Messages", smsUrl, "_self"]].forEach(([label, url, target], index) => {
    const link = document.createElement("a");
    link.href = url;
    link.textContent = label;
    link.target = target;
    if (target === "_blank") link.rel = "noopener noreferrer";
    if (index) formStatus.append(" | ");
    formStatus.append(link);
  });

  window.open(whatsappUrl, "_blank", "noopener");
  setTimeout(() => { window.location.href = smsUrl; }, 600);
});
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}