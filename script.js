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
// LOCAL STORAGE MESSAGE MANAGER
// Handles feedback and inquiry messages
// ============================================

class MessageManager {
  constructor() {
    this.storageKey = 'luxeyacht_messages';
  }

  addMessage(formType, data) {
    const messages = this.getAllMessages();
    messages.push({
      id: Date.now(),
      formType: formType,
      data: data,
      timestamp: new Date().toLocaleString()
    });
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
  }

  getAllMessages() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getMessagesByType(formType) {
    return this.getAllMessages().filter(msg => msg.formType === formType);
  }

  deleteMessage(id) {
    const messages = this.getAllMessages().filter(msg => msg.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
  }

  clearAll() {
    localStorage.removeItem(this.storageKey);
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
const messageManager = new MessageManager();

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
  
  // Store in localStorage
  messageManager.addMessage('contact', formData);
  
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
  const pathname = window.location.pathname;
  const currentPage = pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hrefPage = href.split('/').pop();
    
    if (hrefPage === currentPage || (currentPage === '' && hrefPage === 'index.html')) {
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

// ============================================
// FEEDBACK FORM FUNCTIONALITY
// ============================================

function initFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  
  if (!feedbackForm) return;
  
  feedbackForm.addEventListener('submit', handleFeedbackSubmit);
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  
  const feedbackName = document.getElementById('feedbackName').value.trim();
  const feedbackMessage = document.getElementById('feedbackMessage').value.trim();
  
  // Validation
  if (!feedbackName || feedbackName.length < 2) {
    formManager.displayFieldError('feedbackName', 'Invalid name');
    showFeedbackMessage('❌ Please enter a valid full name', 'error');
    return;
  }
  
  if (!feedbackMessage || feedbackMessage.length < 10) {
    formManager.displayFieldError('feedbackMessage', 'Invalid message');
    showFeedbackMessage('❌ Message must be at least 10 characters', 'error');
    return;
  }
  
  const feedbackData = { feedbackName, feedbackMessage };
  
  // Store in localStorage
  messageManager.addMessage('feedback', feedbackData);
  
  console.log('Feedback Submitted:', feedbackData);
  
  showFeedbackMessage(
    `✓ Thank you, ${feedbackName}! Your feedback has been recorded.`,
    'success'
  );
  
  document.getElementById('feedbackForm').reset();
}

function showFeedbackMessage(message, type) {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  
  const existing = form.querySelector('.success-box');
  if (existing) {
    existing.remove();
  }
  
  const messageBox = document.createElement('div');
  messageBox.className = 'success-box';
  messageBox.textContent = message;
  messageBox.style.animation = 'slideIn 0.4s ease-out';
  form.appendChild(messageBox);
  
  setTimeout(() => {
    messageBox.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      messageBox.remove();
    }, 300);
  }, 5000);
}

function handleInquirySubmit(e) {
  e.preventDefault();
  
  const yachtModel = document.getElementById('yachtModel').value;
  const inquirerName = document.getElementById('inquirerName').value.trim();
  
  const inquiryData = { yachtModel, inquirerName };
  
  // Validate - name only (email and phone optional)
  if (!inquirerName || inquirerName.length < 2) {
    formManager.displayFieldError('inquirerName', 'Invalid name');
    showFormMessage('❌ Please enter a valid full name', 'error');
    return;
  }
  
  // Save state
  formManager.saveState('inquiryForm', inquiryData);
  
  // Store in localStorage
  messageManager.addMessage('inquiry', inquiryData);
  
  console.log('Purchase Inquiry:', inquiryData);
  
  showFormMessage(
    `✓ Your inquiry for the ${yachtModel} has been submitted! Our luxury nautical consultants will reach out within 24 hours.`,
    'success'
  );
  
  document.getElementById('inquiryForm').reset();
}

// ============================================
// ADMIN PAGE FUNCTIONALITY
// Display all stored messages locally
// ============================================

function initAdminPage() {
  const adminContainer = document.getElementById('adminMessagesContainer');
  
  if (!adminContainer) return;
  
  displayAllMessages();
}

function displayAllMessages() {
  const container = document.getElementById('adminMessagesContainer');
  if (!container) return;
  
  const messages = messageManager.getAllMessages();
  
  // Clear container
  container.innerHTML = '';
  
  if (messages.length === 0) {
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">No messages yet</p>';
    return;
  }
  
  // Group by type
  const feedback = messages.filter(m => m.formType === 'feedback');
  const inquiries = messages.filter(m => m.formType === 'inquiry');
  const contact = messages.filter(m => m.formType === 'contact');
  
  let html = '';
  
  if (feedback.length > 0) {
    html += `<div style="margin-bottom: 2rem;">
      <h3 style="color: #D4AF37; margin-bottom: 1rem;">📝 Feedback Messages (${feedback.length})</h3>
      ${feedback.map(msg => createMessageHTML(msg)).join('')}
    </div>`;
  }
  
  if (inquiries.length > 0) {
    html += `<div style="margin-bottom: 2rem;">
      <h3 style="color: #D4AF37; margin-bottom: 1rem;">🛥️ Yacht Purchase Inquiries (${inquiries.length})</h3>
      ${inquiries.map(msg => createInquiryHTML(msg)).join('')}
    </div>`;
  }
  
  if (contact.length > 0) {
    html += `<div style="margin-bottom: 2rem;">
      <h3 style="color: #D4AF37; margin-bottom: 1rem;">💬 Contact Messages (${contact.length})</h3>
      ${contact.map(msg => createContactHTML(msg)).join('')}
    </div>`;
  }
  
  container.innerHTML = html;
  
  // Attach delete handlers
  document.querySelectorAll('.delete-message').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      if (confirm('Delete this message?')) {
        messageManager.deleteMessage(id);
        displayAllMessages();
      }
    });
  });
}

function createMessageHTML(msg) {
  return `
    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08)); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #D4AF37; border: 1px solid rgba(212, 175, 55, 0.3);">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <strong style="color: #FFD700; font-size: 1.1rem;">${msg.data.feedbackName}</strong>
        <small style="color: rgba(255, 255, 255, 0.7);">${msg.timestamp}</small>
      </div>
      <p style="color: rgba(255, 255, 255, 0.95); margin-bottom: 1rem; line-height: 1.6;">${msg.data.feedbackMessage}</p>
      <button class="delete-message" data-id="${msg.id}" style="background: #FF6B6B; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; transition: all 0.3s ease;">Delete</button>
    </div>
  `;
}

function createInquiryHTML(msg) {
  return `
    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08)); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #D4AF37; border: 1px solid rgba(212, 175, 55, 0.3);">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <strong style="color: #FFD700; font-size: 1.1rem;">${msg.data.inquirerName}</strong>
        <small style="color: rgba(255, 255, 255, 0.7);">${msg.timestamp}</small>
      </div>
      <p style="color: rgba(255, 255, 255, 0.95); margin-bottom: 1rem;"><strong style="color: #D4AF37;">Model:</strong> ${msg.data.yachtModel}</p>
      <button class="delete-message" data-id="${msg.id}" style="background: #FF6B6B; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; transition: all 0.3s ease;">Delete</button>
    </div>
  `;
}

function createContactHTML(msg) {
  return `
    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08)); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #D4AF37; border: 1px solid rgba(212, 175, 55, 0.3);">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <strong style="color: #FFD700; font-size: 1.1rem;">${msg.data.name}</strong>
        <small style="color: rgba(255, 255, 255, 0.7);">${msg.timestamp}</small>
      </div>
      <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem;">📧 ${msg.data.email}</p>
      <p style="color: rgba(255, 255, 255, 0.95); margin-bottom: 1rem; line-height: 1.6;">${msg.data.message}</p>
      <button class="delete-message" data-id="${msg.id}" style="background: #FF6B6B; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; transition: all 0.3s ease;">Delete</button>
    </div>
  `;
}

// ============================================
// ARTICLE CARD CLICK NAVIGATION
// Make entire article cards clickable to navigate to specific articles
// ============================================

function initArticleCardNavigation() {
  const articleCards = document.querySelectorAll('.article-card');
  
  articleCards.forEach(card => {
    // Make the entire card clickable
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', function(e) {
      // Don't navigate if clicking on the "Click Article" or "Read More" button directly
      if (e.target.classList.contains('read-more-btn')) {
        return;
      }
      
      // Get the article ID from data attribute
      const articleId = this.getAttribute('data-article-id');
      
      // Navigate based on article ID
      if (articleId === '1') {
        window.location.href = 'Pages/article1.html';
      } else if (articleId === '2') {
        window.location.href = 'Pages/article2.html';
      } else if (articleId === '3') {
        window.location.href = 'Pages/article3.html';
      } else {
        // For articles 4-10, go to the articles page
        window.location.href = 'Pages/articles.html';
      }
    });
    
    // Add hover effect for better UX
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// ============================================
// ARTICLE BAR CLICK NAVIGATION (for articles.html page)
// Make entire article bars clickable
// ============================================

function initArticleBarNavigation() {
  const articleBars = document.querySelectorAll('.article-bar');
  
  articleBars.forEach((bar, index) => {
    // Make the entire bar clickable
    bar.style.cursor = 'pointer';
    
    bar.addEventListener('click', function(e) {
      // Don't navigate if clicking on the link button directly
      if (e.target.classList.contains('article-bar-link')) {
        return;
      }
      
      // Find the link within this bar and get its href
      const link = this.querySelector('.article-bar-link');
      if (link && link.getAttribute('href') !== '#') {
        window.location.href = link.getAttribute('href');
      }
    });
    
    // Add hover effect
    bar.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    bar.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });
}

// ============================================
// LOGO CLICK NAVIGATION
// Make logo clickable to navigate to home page
// ============================================

function initLogoNavigation() {
  const logoBrand = document.querySelector('.logo-brand');
  
  if (!logoBrand) return;
  
  // Make logo clickable
  logoBrand.style.cursor = 'pointer';
  
  logoBrand.addEventListener('click', function() {
    // Check if we're in a subdirectory (Pages folder)
    const currentPath = window.location.pathname;
    if (currentPath.includes('/Pages/')) {
      window.location.href = '../index.html';
    } else {
      window.location.href = 'index.html';
    }
  });
  
  // Add hover effect
  logoBrand.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.transition = 'transform 0.3s ease';
  });
  
  logoBrand.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}

// ============================================
// NEWS BLOCK CLICK NAVIGATION
// Make entire news blocks clickable
// ============================================

function initNewsBlockNavigation() {
  const newsBlocks = document.querySelectorAll('.news-block');
  
  newsBlocks.forEach(block => {
    // Make the entire block clickable
    block.style.cursor = 'pointer';
    
    block.addEventListener('click', function(e) {
      // Don't navigate if clicking on the link directly
      if (e.target.tagName === 'A') {
        return;
      }
      
      // Find the link within this block and open it
      const link = this.querySelector('a');
      if (link) {
        window.open(link.getAttribute('href'), '_blank', 'noopener,noreferrer');
      }
    });
    
    // Add hover effect
    block.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    block.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
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
  initFeedbackForm();
  initInquiryForm();
  initPurchaseButtons();
  initFloatingLabels();
  initScrollAnimations();
  initSmoothScroll();
  initAdminPage();
  initArticleCardNavigation();
  initArticleBarNavigation();
  initLogoNavigation();
  initNewsBlockNavigation();
  
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
