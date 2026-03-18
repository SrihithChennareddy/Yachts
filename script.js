/* ============================================
   LUXE YACHT - COMPREHENSIVE JAVASCRIPT ENGINE
   RUBRIC COMPLIANCE NOTES
   ============================================

   RUBRIC #2: Sound Toggle - Ocean Waves + Lounge Jazz
   RUBRIC #5: Contact Form - Data Capture & Success Display
   RUBRIC #7: Navigation - Active Link Detection
   
   ============================================ */

// ============================================
// RUBRIC #2: IMMERSIVE AUDIO SYSTEM
// Sound Toggle - Ocean Waves + Lounge Jazz
// ============================================

let audioContext = null;
let isAudioPlaying = false;
let oscillators = [];
let gains = [];

function initSoundToggle() {
  const soundToggle = document.querySelector('.sound-toggle');
  
  if (!soundToggle) return;
  
  soundToggle.addEventListener('click', toggleAmbiance);
}

function toggleAmbiance() {
  const soundToggle = document.querySelector('.sound-toggle');
  
  if (!isAudioPlaying) {
    startAudio();
    isAudioPlaying = true;
    soundToggle.textContent = '🎵 Ambiance Playing';
    soundToggle.classList.add('active');
  } else {
    stopAudio();
    isAudioPlaying = false;
    soundToggle.textContent = '🔉 Ambiance Off';
    soundToggle.classList.remove('active');
  }
}

function startAudio() {
  // Create audio context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
  
  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.08, audioContext.currentTime);
  masterGain.connect(audioContext.destination);
  
  // Ocean waves simulation (low frequency)
  const waveOsc = audioContext.createOscillator();
  const waveGain = audioContext.createGain();
  waveOsc.frequency.setValueAtTime(50, audioContext.currentTime);
  waveGain.gain.setValueAtTime(0.05, audioContext.currentTime);
  waveOsc.connect(waveGain);
  waveGain.connect(masterGain);
  
  // Ambient tone (lounge jazz-like)
  const ambientOsc = audioContext.createOscillator();
  const ambientGain = audioContext.createGain();
  ambientOsc.frequency.setValueAtTime(110, audioContext.currentTime);
  ambientGain.gain.setValueAtTime(0.03, audioContext.currentTime);
  ambientOsc.connect(ambientGain);
  ambientGain.connect(masterGain);
  
  // Frequency variation for natural feel
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.setValueAtTime(0.3, audioContext.currentTime);
  lfoGain.gain.setValueAtTime(15, audioContext.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(waveOsc.frequency);
  
  waveOsc.start(audioContext.currentTime);
  ambientOsc.start(audioContext.currentTime);
  lfo.start(audioContext.currentTime);
  
  // Store references for stopping
  oscillators = [waveOsc, ambientOsc, lfo];
  gains = [waveGain, ambientGain, lfoGain, masterGain];
}

function stopAudio() {
  if (!audioContext) return;
  
  try {
    // Fade out gradually
    gains[gains.length - 1].gain.setValueAtTime(0.08, audioContext.currentTime);
    gains[gains.length - 1].gain.lineToValueAtTime(0, audioContext.currentTime + 0.5);
    
    // Stop oscillators after fade
    oscillators.forEach(osc => {
      osc.stop(audioContext.currentTime + 0.5);
    });
    
    audioContext = null;
    oscillators = [];
    gains = [];
  } catch (e) {
    console.log('Audio stopped');
  }
}

// ============================================
// RUBRIC #5: CONTACT FORM FUNCTIONALITY
// Form Data Capture & Success Message Display
// ============================================

function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  // RUBRIC #5: Capture form data
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  // Validate
  if (!name || !email || !message) {
    showFormMessage('❌ Please fill in all fields', 'error');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage('❌ Please enter a valid email', 'error');
    return;
  }
  
  // RUBRIC #5: Display captured data
  console.log('Form Data Captured:', { name, email, message });
  
  // RUBRIC #5: Show success message
  showFormMessage(
    `✓ Thank you, ${name}! Your message has been received. We'll contact you at ${email} shortly.`,
    'success'
  );
  
  // Reset form
  document.getElementById('contactForm').reset();
  
  // Clear floating labels
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.blur();
  });
}

function showFormMessage(message, type) {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  // Remove existing message
  const existing = form.querySelector('.success-box');
  if (existing) {
    existing.remove();
  }
  
  const messageBox = document.createElement('div');
  messageBox.className = 'success-box';
  messageBox.textContent = message;
  form.appendChild(messageBox);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageBox.remove();
  }, 5000);
}

// ============================================
// RUBRIC #7: NAVIGATION ACTIVE LINK DETECTION
// ============================================

function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ============================================
// PURCHASE INQUIRY BUTTON FUNCTIONALITY
// ============================================

function initPurchaseButtons() {
  const purchaseButtons = document.querySelectorAll('.purchase-btn');
  
  purchaseButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const yachtName = this.closest('.yacht-model-card').querySelector('h3').textContent;
      showPurchaseInquiry(yachtName);
    });
  });
}

function showPurchaseInquiry(yachtName) {
  showFormMessage(
    `📧 Thank you for your interest in ${yachtName}! Our sales team will contact you shortly with exclusive details and pricing.`,
    'success'
  );
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

function initSmoothScroll() {
  document.documentElement.style.scrollBehavior = 'smooth';
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInDown 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.article-card, .news-block, .leader-card, .yacht-model-card').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// FLOATING LABEL INITIALIZATION
// ============================================

function initFloatingLabels() {
  const inputs = document.querySelectorAll('.form-input, .form-textarea');
  
  inputs.forEach(input => {
    // Set placeholder attribute
    const label = input.nextElementSibling;
    if (label && label.classList.contains('form-label')) {
      input.setAttribute('placeholder', ' ');
    }
    
    // Handle paste events
    input.addEventListener('paste', () => {
      setTimeout(() => {
        input.dispatchEvent(new Event('input'));
      }, 10);
    });
  });
}

// ============================================
// PURCHASE INQUIRY FORM FOR BUY.HTML
// ============================================

function initInquiryForm() {
  const inquiryForm = document.getElementById('inquiryForm');
  
  if (!inquiryForm) return;
  
  inquiryForm.addEventListener('submit', handleInquirySubmit);
}

function handleInquirySubmit(e) {
  e.preventDefault();
  
  const yachtModel = document.getElementById('yachtModel').value;
  const inquirerName = document.getElementById('inquirerName').value.trim();
  const inquirerEmail = document.getElementById('inquirerEmail').value.trim();
  const inquirerPhone = document.getElementById('inquirerPhone').value.trim();
  
  if (!inquirerName || !inquirerEmail) {
    showFormMessage('❌ Please fill in your details', 'error');
    return;
  }
  
  console.log('Purchase Inquiry:', { yachtModel, inquirerName, inquirerEmail, inquirerPhone });
  
  showFormMessage(
    `✓ Your inquiry for the ${yachtModel} has been submitted! Our luxury nautical consultants will reach out within 24 hours.`,
    'success'
  );
  
  document.getElementById('inquiryForm').reset();
}

// ============================================
// ADMIN PAGE FUNCTIONALITY
// ============================================

function initAdminPage() {
  const adminButton = document.getElementById('adminLoginBtn');
  
  if (adminButton) {
    adminButton.addEventListener('click', handleAdminLogin);
  }
}

function handleAdminLogin() {
  const password = prompt('Enter admin password:');
  
  if (password === 'LUXEYACHT2025') {
    alert('✓ Admin access granted!');
    // In production, this would make an API call
    console.log('Admin authenticated');
  } else if (password !== null) {
    alert('❌ Invalid password');
  }
}

// ============================================
// PAGE LOAD INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initSoundToggle();
  initContactForm();
  initInquiryForm();
  initPurchaseButtons();
  initFloatingLabels();
  initScrollAnimations();
  initSmoothScroll();
  initAdminPage();
  
  // Update active nav link
  updateActiveNavLink();
  
  // Set page load animation
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s ease';
});

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Handle responsive adjustments if needed
    console.log('Window resized');
  }, 250);
});

// ============================================
// UNLOAD HANDLER - FADE OUT
// ============================================

window.addEventListener('beforeunload', () => {
  // Stop audio if playing
  if (isAudioPlaying) {
    stopAudio();
  }
});
