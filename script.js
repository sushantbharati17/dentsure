/**
 * DentaSure — A Specialist Dental Clinic
 * Interactive JavaScript for Marketing & Demo Pitch Website
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initTestimonialSlider();
  initBookingForm();
  initWhatsAppButton();
  initSalesPitchBar();
  initDateInput();
});

/* ==========================================================
   1. Mobile Navigation Menu
   ========================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const menuContent = mobileMenu.querySelector('.mobile-menu-content');
    if (menuContent) {
      setTimeout(() => {
        menuContent.classList.remove('translate-x-full');
      }, 10);
    }
  }

  function closeMenu() {
    const menuContent = mobileMenu.querySelector('.mobile-menu-content');
    if (menuContent) {
      menuContent.classList.add('translate-x-full');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }, 250);
    } else {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when clicking background backdrop
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close when tapping any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================
   2. Header Scroll Shadow & Offset
   ========================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md');
      header.classList.remove('shadow-sm');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('shadow-sm');
    }
  }, { passive: true });
}

/* ==========================================================
   3. Testimonials Carousel / Controls
   ========================================================== */
function initTestimonialSlider() {
  const container = document.getElementById('testimonials-slider');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!container) return;

  const cards = container.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  function updateSlide(index) {
    if (cards.length === 0) return;
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    // Scroll to card
    const targetCard = cards[currentIndex];
    container.scrollTo({
      left: targetCard.offsetLeft - container.offsetLeft,
      behavior: 'smooth'
    });

    // Update dots if present
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('bg-teal-600', 'w-8');
        dot.classList.remove('bg-slate-300', 'w-2.5');
      } else {
        dot.classList.remove('bg-teal-600', 'w-8');
        dot.classList.add('bg-slate-300', 'w-2.5');
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlide(index);
    });
  });

  // Track manual scroll on swipe/touch
  let isScrolling;
  container.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      const scrollPos = container.scrollLeft;
      cards.forEach((card, index) => {
        if (Math.abs(card.offsetLeft - container.offsetLeft - scrollPos) < 150) {
          currentIndex = index;
          dots.forEach((dot, i) => {
            if (i === currentIndex) {
              dot.classList.add('bg-teal-600', 'w-8');
              dot.classList.remove('bg-slate-300', 'w-2.5');
            } else {
              dot.classList.remove('bg-teal-600', 'w-8');
              dot.classList.add('bg-slate-300', 'w-2.5');
            }
          });
        }
      });
    }, 80);
  }, { passive: true });
}

/* ==========================================================
   4. Date Input Min Constraint
   ========================================================== */
function initDateInput() {
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}

/* ==========================================================
   5. Appointment Booking Form Submission & Toast
   ========================================================== */
function initBookingForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    const dateInput = document.getElementById('booking-date');
    const timeInput = document.getElementById('booking-time');
    const serviceInput = document.getElementById('booking-service');
    const messageInput = document.getElementById('booking-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const date = dateInput ? dateInput.value : '';
    const time = timeInput ? timeInput.value : 'Preferred Time';
    const service = serviceInput ? serviceInput.value : 'General Consultation';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !phone) {
      showToast({
        title: 'Please check your details',
        message: 'Name and phone number are required so DentaSure can confirm your appointment.',
        type: 'warning'
      });
      return;
    }

    // Format human readable date
    let formattedDate = 'soon';
    if (date) {
      try {
        const d = new Date(date + 'T00:00:00');
        formattedDate = d.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      } catch (err) {
        formattedDate = date;
      }
    }

    // Trigger celebration confetti
    triggerConfetti();

    // Prepare WhatsApp text
    const waText = encodeURIComponent(
      `Hi DentaSure! I submitted an appointment request from the website.\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Date:* ${formattedDate} (${time})\n` +
      `*Service:* ${service}` +
      (message ? `\n*Note:* ${message}` : '')
    );

    const waUrl = `https://wa.me/918755969268?text=${waText}`;

    // Show rich success toast
    showToast({
      title: 'Appointment Request Received!',
      message: `Thank you, ${name}! Your request for ${formattedDate} (${time}) has been registered for the demo.`,
      type: 'success',
      actionText: 'Send via WhatsApp to 087559 69268',
      actionUrl: waUrl
    });

    // Reset form
    form.reset();
  });
}

/* ==========================================================
   6. Custom Toast Notification Component
   ========================================================== */
function showToast({ title, message, type = 'success', actionText = null, actionUrl = null, duration = 6500 }) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `transform transition-all duration-300 ease-out translate-y-5 opacity-0 bg-white border ${
    type === 'success' ? 'border-teal-200' : 'border-amber-200'
  } rounded-2xl p-5 shadow-2xl max-w-md w-full relative overflow-hidden pointer-events-auto`;

  const iconBg = type === 'success' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';
  const iconSvg = type === 'success' 
    ? `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`
    : `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;

  let actionHtml = '';
  if (actionText && actionUrl) {
    actionHtml = `
      <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <a href="${actionUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          ${actionText}
        </a>
      </div>
    `;
  }

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center">
        ${iconSvg}
      </div>
      <div class="flex-1 pr-6">
        <h4 class="text-sm font-bold text-slate-900 leading-snug">${title}</h4>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${message}</p>
        ${actionHtml}
      </div>
      <button class="toast-close absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <!-- Progress bar -->
    <div class="toast-progress absolute bottom-0 left-0 h-1 bg-teal-500 w-full transition-all duration-[6000ms] ease-linear"></div>
  `;

  container.appendChild(toast);

  // Animate enter
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-5', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar) {
      setTimeout(() => {
        progressBar.style.width = '0%';
      }, 50);
    }
  });

  function dismiss() {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) closeBtn.addEventListener('click', dismiss);

  setTimeout(dismiss, duration);
}

/* ==========================================================
   7. Lightweight Confetti Generator
   ========================================================== */
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#0EA5A4', '#14B8A6', '#F59E0B', '#10B981', '#38BDF8'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45,
      r: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      tilt: Math.random() * 10,
      tiltAngleInc: Math.random() * 0.08 + 0.04,
      tiltAngle: 0,
      opacity: 1
    });
  }

  let animationFrame;
  let startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.tiltAngle += p.tiltAngleInc;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      p.opacity = Math.max(0, 1 - elapsed / 2200);

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
      ctx.stroke();
    });

    if (elapsed < 2400) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    }
  }

  render();
}

/* ==========================================================
   8. WhatsApp Tooltip & Visibility
   ========================================================== */
function initWhatsAppButton() {
  const waBtn = document.getElementById('whatsapp-floating-btn');
  if (!waBtn) return;

  // Add click tracking
  waBtn.addEventListener('click', () => {
    console.log('[Analytics Demo] WhatsApp booking triggered.');
  });
}

/* ==========================================================
   9. Sales Pitch Presentation Bar (Toggle/Dismiss)
   ========================================================== */
function initSalesPitchBar() {
  const pitchBar = document.getElementById('sales-pitch-bar');
  const dismissBtn = document.getElementById('pitch-bar-dismiss');
  const detailsToggle = document.getElementById('pitch-details-toggle');
  const pitchDetails = document.getElementById('pitch-details-modal');

  if (dismissBtn && pitchBar) {
    dismissBtn.addEventListener('click', () => {
      pitchBar.style.display = 'none';
    });
  }

  if (detailsToggle && pitchDetails) {
    detailsToggle.addEventListener('click', () => {
      pitchDetails.classList.toggle('hidden');
    });
  }
}
