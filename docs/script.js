if (window.__bookingScriptLoaded__) {
  console.warn("❌ Booking script already loaded once — skipping!");
  throw new Error("Duplicate script load detected");
}
window.__bookingScriptLoaded__ = true;
console.log("✅ script.js loaded once");

// === Global Flags ===
let lastPlayedVideo = null;
let learnMoreModalActive = false;

// === Smooth Scroll to Booking Section ===
function scrollToBooking() {
  const bookSection = document.getElementById('book');
  if (bookSection) {
    bookSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// === Toggle Mobile Menu ===
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// === Learn More Modal Logic ===
function openLearnMoreModal(title, description) {
  const modal = document.getElementById('learnMoreModal');
  const titleEl = document.getElementById('learnMoreTitle');
  const descEl = document.getElementById('learnMoreDescription');

  titleEl.textContent = title;
  descEl.innerHTML = formatModalContent(description);
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  learnMoreModalActive = true;

  const videos = document.querySelectorAll('#ourServicesCarousel video');
  lastPlayedVideo = null;
  videos.forEach(video => {
    if (!video.paused) {
      if (!lastPlayedVideo) lastPlayedVideo = video;
      video.pause();
    }
  });
}

function formatModalContent(rawText) {
  const [intro, ...bullets] = rawText.split('\\n\\n');
  const bulletItems = bullets.join('').replace(/^•/, '').split('\\n•').filter(item => item.trim());

  const bulletHTML = bulletItems.length
    ? '<ul>' + bulletItems.map(item => `<li>${item.trim()}</li>`).join('') + '</ul>'
    : '';

  return `<p>${intro.trim()}</p>${bulletHTML}`;
}

function closeLearnMoreModal() {
  const modal = document.getElementById('learnMoreModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
  learnMoreModalActive = false;

  if (lastPlayedVideo) {
    lastPlayedVideo.play();
    lastPlayedVideo = null;
  }

  // Restore carousel playback logic after slight delay
  setTimeout(() => updateOurVideoPlayback(), 300);
}

// Optional: Close modal if user clicks outside content
document.addEventListener('click', function (e) {
  const modal = document.getElementById('learnMoreModal');
  const content = modal.querySelector('.learn-more-content');
  if (modal.classList.contains('show') && !content.contains(e.target) && !e.target.classList.contains('learn-more-btn')) {
    closeLearnMoreModal();
  }
});

// === Auto-close mobile menu on link click ===
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// === OUR SERVICES VIDEO CAROUSEL LOGIC ===
const ourCarousel = document.getElementById("ourServicesCarousel");
const ourCards = ourCarousel.querySelectorAll(".service-card");
const ourLeftArrow = document.querySelector(".our-left-arrow");
const ourRightArrow = document.querySelector(".our-right-arrow");

function getOurCenterCard() {
  const carouselRect = ourCarousel.getBoundingClientRect();
  const centerX = carouselRect.left + carouselRect.width / 2;

  let closest = null;
  let closestDistance = Infinity;

  ourCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(centerX - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = card;
    }
  });

  return closest;
}

function updateOurVideoPlayback() {
  if (learnMoreModalActive) return;
  const centeredCard = getOurCenterCard();

  ourCards.forEach(card => {
    const video = card.querySelector("video");
    if (!video) return;

    if (card === centeredCard) {
      video.play().catch(() => {});
      card.classList.add("playing");
    } else {
      video.pause();
      card.classList.remove("playing");
    }
  });
}

ourCarousel.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateOurVideoPlayback);
});

ourLeftArrow.addEventListener("click", () => {
  ourCarousel.scrollBy({ left: -300, behavior: "smooth" });
});
ourRightArrow.addEventListener("click", () => {
  ourCarousel.scrollBy({ left: 300, behavior: "smooth" });
});

window.addEventListener("load", () => {
  let targetCard;
  if (window.innerWidth < 768) {
    targetCard = ourCards[0];
  } else {
    targetCard = [...ourCards].find(card =>
      card.querySelector("h3")?.textContent?.trim() === "Skinfade & Shave"
    );
  }

  if (targetCard) {
    const offset = targetCard.offsetLeft - (ourCarousel.offsetWidth - targetCard.offsetWidth) / 2;
    ourCarousel.scrollLeft = offset;
  }

  updateOurVideoPlayback();
});
window.addEventListener("resize", updateOurVideoPlayback);

// === Gallery scroll logic ===
const galleryTrack = document.querySelector('.gallery-track');
const galleryLeftArrow = document.querySelector('.gallery-nav.left');
const galleryRightArrow = document.querySelector('.gallery-nav.right');

function updateGalleryArrows() {
  const scrollLeft = galleryTrack.scrollLeft;
  const scrollWidth = galleryTrack.scrollWidth;
  const clientWidth = galleryTrack.clientWidth;

  galleryLeftArrow.style.display = scrollLeft <= 5 ? 'none' : 'block';
  galleryRightArrow.style.display = scrollLeft + clientWidth >= scrollWidth - 5 ? 'none' : 'block';
}

galleryTrack.addEventListener('scroll', updateGalleryArrows);
window.addEventListener('load', updateGalleryArrows);
window.addEventListener('resize', updateGalleryArrows);

const galleryScrollAmount = window.innerWidth >= 768 ? 500 : 300;
galleryLeftArrow.addEventListener('click', () => {
  galleryTrack.scrollBy({ left: -galleryScrollAmount, behavior: 'smooth' });
});
galleryRightArrow.addEventListener('click', () => {
  galleryTrack.scrollBy({ left: galleryScrollAmount, behavior: 'smooth' });
});

// === FLATPICKR BOOKING SETUP ===
const dateInput = document.getElementById("bookingDate");
const timeSelect = document.getElementById("bookingTime");

const businessHours = {
  0: [10, 16],
  1: [9, 18],
  3: [9, 18],
  4: [9, 19],
  5: [9, 19],
  6: [8, 18],
};

const displayInput = document.getElementById("bookingDateDisplay");
const realInput = document.getElementById("bookingDate");

flatpickr(displayInput, {
  dateFormat: "Y-m-d",
  defaultDate: "today",
  minDate: "today",
  maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
  disableMobile: true,
  disable: [d => d.getDay() === 2],
  onChange: function (selectedDates, dateStr) {
    realInput.value = dateStr;
    const date = selectedDates[0];
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    if (!date) return;

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const now = new Date();

    const day = date.getDay();
    const [openHour, closeHour] = businessHours[day] || [];
    if (!openHour || !closeHour) return;

    const openTime = new Date(date.setHours(openHour, 0, 0, 0));
    const closingTime = new Date(date.setHours(closeHour, 0, 0, 0));
    const lastBookable = new Date(closingTime.getTime() - 20 * 60000);

    let current = new Date(openTime);
    while (current <= lastBookable) {
      if (!isToday || current > now) {
        const value = flatpickr.formatDate(current, "H:i");
        const label = flatpickr.formatDate(current, "h:i K");

        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        timeSelect.appendChild(option);
      }
      current.setMinutes(current.getMinutes() + 20);
    }
  }
});

// === SERVICE MODAL LOGIC ===
const selectedServiceInput = document.getElementById("selectedServiceDisplay");
const serviceModal = document.getElementById("serviceModal");
const closeModalBtn = document.querySelector(".close-modal-btn");
const modalCarousel = document.getElementById("serviceCarousel");
let selectedCard = null;

function openServiceModal() {
  serviceModal.classList.add("active");
  document.body.style.overflow = "hidden";
  centerCarouselToDefault();
  setTimeout(() => { updateVideoPlayback(); }, 200);
}
function closeServiceModal() {
  serviceModal.classList.remove("active");
  document.body.style.overflow = "auto";
  stopAllVideos();
}
serviceModal.addEventListener("click", (e) => {
  if (e.target === serviceModal) closeServiceModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeServiceModal();
});

function scrollModalCarousel(direction) {
  const cardWidth = modalCarousel.querySelector(".service-card").offsetWidth;
  modalCarousel.scrollBy({
    left: direction === "left" ? -cardWidth : cardWidth,
    behavior: "smooth"
  });
  setTimeout(updateVideoPlayback, 300);
}

function updateVideoPlayback() {
  const cards = modalCarousel.querySelectorAll(".service-card");
  const center = modalCarousel.scrollLeft + modalCarousel.offsetWidth / 2;

  cards.forEach(card => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const video = card.querySelector("video");

    if (Math.abs(center - cardCenter) < card.offsetWidth / 2) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}
modalCarousel.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateVideoPlayback);
});
function stopAllVideos() {
  modalCarousel.querySelectorAll("video").forEach(video => video.pause());
}
function selectServiceCard(el) {
  modalCarousel.querySelectorAll(".service-card").forEach(card => card.classList.remove("selected"));
  el.classList.add("selected");
  selectedCard = el;
}
function confirmService(e, name, price) {
  e.stopPropagation();
  selectedServiceInput.value = `${name} - ${price}`;
  closeServiceModal();
}
function centerCarouselToDefault() {
  const defaultCard = modalCarousel.querySelector("[data-default]") || modalCarousel.querySelector(".service-card");
  if (!defaultCard) return;
  const cardOffset = defaultCard.offsetLeft;
  const containerWidth = modalCarousel.offsetWidth;
  const cardWidth = defaultCard.offsetWidth;
  modalCarousel.scrollLeft = cardOffset - (containerWidth / 2 - cardWidth / 2);
}

// === BOOKING FORM VALIDATION (Static Mode) ===
let globalSubmitLock = false;
const form = document.getElementById("bookingForm");
if (form) {
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (globalSubmitLock) return;
    globalSubmitLock = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    await new Promise((r) => setTimeout(r, 500)); // simulate delay

    const formData = new FormData(form);
    const requiredFields = ["name", "phone", "email", "bookingDate", "bookingTime", "selectedService"];
    for (let field of requiredFields) {
      const value = formData.get(field)?.trim();
      if (!value) {
        alert(`❌ Missing required field: ${field}`);
        resetSubmitState(submitBtn);
        return;
      }
    }

    try {
      console.log("⚙️ Simulating booking (no backend)...");
      const email = formData.get("email");
      const refCode = "KING-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      showBookingSuccessModal(email, refCode, submitBtn);
    } catch (err) {
      console.error("🚨 Booking failed:", err);
      alert("❌ Booking failed. Please try again.");
      resetSubmitState(submitBtn);
    }
  });
}

function resetSubmitState(btn) {
  globalSubmitLock = false;
  btn.disabled = false;
  btn.textContent = "Confirm Booking";
}

function showBookingSuccessModal(email, refCode, submitBtn) {
  const modal = document.getElementById("bookingSuccessModal");
  const message = document.getElementById("bookingSuccessMessage");

  message.innerHTML = `
  <p>Confirmation sent to <strong>${email}</strong></p>
  <p>Reference: <strong style="color: #00ffae">${refCode}</strong></p>
`;

  modal.classList.add("show");
  document.body.style.overflow = "hidden";

  modal.querySelector(".confirm-success-btn").onclick = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    document.getElementById("bookingForm").reset();
    resetSubmitState(submitBtn);
  };
}
