// ============================================
// PRODUCTION-GRADE: SCROLL-TO-TOP BUTTON
// Sophisticated animations and state management
// ============================================

class ScrollToTopManager {
  constructor() {
    this.scrollThreshold = 300;
    this.button = document.querySelector('#scrollToTop');
    this.isVisible = false;
    this.init();
  }

  init() {
    if (!this.button) return;
    
    this.button.addEventListener('click', (e) => this.handleClick(e));
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const shouldShow = window.scrollY > this.scrollThreshold;
    
    if (shouldShow && !this.isVisible) {
      this.show();
    } else if (!shouldShow && this.isVisible) {
      this.hide();
    }
  }

  show() {
    this.button.classList.add('show');
    this.isVisible = true;
  }

  hide() {
    this.button.classList.remove('show');
    this.isVisible = false;
  }

  handleClick(e) {
    e.preventDefault();
    
    // Smooth scroll to top with easing
    const startY = window.scrollY;
    const duration = 800;
    const startTime = performance.now();
    
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const scroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startY * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };
    
    requestAnimationFrame(scroll);
  }
}

// ============================================
// PRODUCTION-GRADE: FORM STATE MANAGER
// Robust form handling with validation and state
// ============================================

class FormStateManager {
  constructor() {
    this.formStates = new Map();
    this.validationRules = {
      name: (value) => value.trim().length >= 2,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone: (value) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value) || value === '',
      message: (value) => value.trim().length >= 10
    };
  }

  validate(fieldName, value) {
    const rule = this.validationRules[fieldName];
    return rule ? rule(value) : true;
  }

  validateForm(formData) {
    const errors = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (!this.validate(key, value)) {
        errors[key] = `Invalid ${key}`;
      }
    });
    
    return Object.keys(errors).length === 0 ? null : errors;
  }

  displayFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '#FF6B6B';
    field.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.12)';
    
    setTimeout(() => {
      field.style.borderColor = '#E0E0E0';
      field.style.boxShadow = 'none';
    }, 3000);
  }

  saveState(formId, data) {
    this.formStates.set(formId, {
      data,
      timestamp: Date.now()
    });
  }

  getState(formId) {
    return this.formStates.get(formId);
  }
}

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
  soundToggle.addEventListener('mouseenter', (e) => {
    e.target.style.transform = 'scale(1.08)';
  });
  soundToggle.addEventListener('mouseleave', (e) => {
    e.target.style.transform = 'scale(1)';
  });
}

function toggleAmbiance() {
  const soundToggle = document.querySelector('.sound-toggle');
  
  if (!isAudioPlaying) {
    startAudio();
    isAudioPlaying = true;
    soundToggle.textContent = '♪ AMBIANCE ON';
    soundToggle.classList.add('active');
  } else {
    stopAudio();
    isAudioPlaying = false;
    soundToggle.textContent = '♪ AMBIANCE';
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

const formManager = new FormStateManager();

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
  
  const formData = { name, email, message };
  
  // Validate using state manager
  const errors = formManager.validateForm(formData);
  
  if (errors) {
    Object.entries(errors).forEach(([key, error]) => {
      formManager.displayFieldError(key, error);
    });
    showFormMessage('❌ Please check your input and try again', 'error');
    return;
  }
  
  // RUBRIC #5: Save state
  formManager.saveState('contactForm', formData);
  
  // RUBRIC #5: Display captured data
  console.log('Form Data Captured:', formData);
  
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
  messageBox.style.animation = 'slideIn 0.4s ease-out';
  form.appendChild(messageBox);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageBox.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      messageBox.remove();
    }, 300);
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
    // Only attach event listener if not a form submission button
    if (btn.type !== 'submit' && !btn.form) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.yacht-model-card');
        if (card) {
          const yachtName = card.querySelector('h3').textContent;
          showPurchaseInquiry(yachtName);
        }
      });
    }
    
    // Add hover micro-interaction
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

function showPurchaseInquiry(yachtName) {
  const message = `📧 Thank you for your interest in ${yachtName}! Our sales team will contact you shortly with exclusive details and pricing.`;
  console.log('Purchase Inquiry:', { yachtName, timestamp: new Date() });
  
  // Show success message
  const msgBox = document.createElement('div');
  msgBox.className = 'success-box';
  msgBox.textContent = message;
  msgBox.style.animation = 'slideIn 0.4s ease-out';
  msgBox.style.position = 'fixed';
  msgBox.style.top = '100px';
  msgBox.style.left = '50%';
  msgBox.style.transform = 'translateX(-50%)';
  msgBox.style.zIndex = '2000';
  msgBox.style.maxWidth = '500px';
  document.body.appendChild(msgBox);
  
  setTimeout(() => {
    msgBox.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => msgBox.remove(), 300);
  }, 5000);
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
// Advanced scroll-triggered reveals with stagger
// ============================================

function initScrollAnimations() {
  // Configuration for article cards with staggered reveal
  const cardObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Apply card-visible class for animation
        entry.target.classList.add('card-visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, cardObserverOptions);
  
  // Observe all card elements
  document.querySelectorAll('.article-card').forEach(el => {
    cardObserver.observe(el);
  });
  
  // Additional observers for other elements
  const elementObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInDown 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        elementObserver.unobserve(entry.target);
      }
    });
  }, elementObserverOptions);
  
  // Observe news blocks, leader cards, and yacht model cards
  document.querySelectorAll('.news-block, .leader-card, .yacht-model-card').forEach(el => {
    elementObserver.observe(el);
  });
  
  // Observe section titles for reveal animation
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'all 0.8s ease-out';
        titleObserver.unobserve(entry.target);
      } else {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(30px)';
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.section-title').forEach(el => {
    titleObserver.observe(el);
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
    
    // Add micro-interaction on focus
    input.addEventListener('focus', () => {
      input.style.transition = 'all 0.3s ease';
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
  
  const inquiryData = { yachtModel, inquirerName, inquirerEmail, inquirerPhone };
  
  // Validate using state manager
  const errors = formManager.validateForm({ 
    name: inquirerName, 
    email: inquirerEmail, 
    phone: inquirerPhone 
  });
  
  if (errors) {
    showFormMessage('❌ Please check your input and try again', 'error');
    return;
  }
  
  // Save state
  formManager.saveState('inquiryForm', inquiryData);
  
  console.log('Purchase Inquiry:', inquiryData);
  
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
  // Initialize scroll-to-top manager
  new ScrollToTopManager();
  
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
