document.addEventListener("DOMContentLoaded", function() {
  initHeader();
  initAccountTabs();
  initAccountForms();
  initOrderTracking();
  initReturnsForm();
  initFAQ();
  initSupportSearch();
  initContactForm();
  initLiveChat();
});

function initAccountTabs() {
  const tabs = document.querySelectorAll(".account-tab");
  const contents = document.querySelectorAll(".account-tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-account-tab");

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById("account-" + target).classList.add("active");
    });
  });
}

function initAccountForms() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      if (!email || !password) {
        showToast("Please fill in all fields.", "error");
        return;
      }

      const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH) || "[]");
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH, JSON.stringify({ current: user }));
        showToast("Welcome back, " + user.name + "!");
      } else {
        showToast("Invalid email or password. Try creating an account.", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const password2 = document.getElementById("reg-password2").value;

      if (!name || !email || !password || !password2) {
        showToast("Please fill in all fields.", "error");
        return;
      }

      if (password.length < 8) {
        showToast("Password must be at least 8 characters.", "error");
        return;
      }

      if (password !== password2) {
        showToast("Passwords do not match.", "error");
        return;
      }

      const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH) || "[]");

      if (users.some(u => u.email === email)) {
        showToast("An account with this email already exists.", "error");
        return;
      }

      const newUser = { name, email, password, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH, JSON.stringify(users));
      localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH, JSON.stringify({ current: newUser }));

      showToast("Account created successfully! Welcome, " + name + "!");
      registerForm.reset();

      const loginTab = document.querySelector('[data-account-tab="login"]');
      if (loginTab) loginTab.click();
    });
  }
}

function initOrderTracking() {
  const trackingForm = document.getElementById("tracking-form");
  const trackingInput = document.getElementById("tracking-input");
  const trackingResult = document.getElementById("tracking-result");
  const chips = document.querySelectorAll(".tracking-chip");

  const demoOrders = {
    "NEX-20260725": {
      status: "In Transit",
      statusClass: "",
      steps: [
        { text: "Order Confirmed", desc: "Your order has been placed successfully.", time: "Jul 20, 2026 — 2:30 PM", done: true },
        { text: "Processing", desc: "Your order is being prepared for shipment.", time: "Jul 21, 2026 — 9:15 AM", done: true },
        { text: "Shipped", desc: "Your package is on its way to you.", time: "Jul 22, 2026 — 4:45 PM", done: true, active: true },
        { text: "Out for Delivery", desc: "Your package is out for delivery today.", time: "", done: false },
        { text: "Delivered", desc: "Your package has been delivered.", time: "", done: false }
      ],
      carrier: "FedEx Express",
      tracking: "7489 2341 8876",
      eta: "Jul 26, 2026",
      address: "John Doe<br>123 Main Street<br>San Francisco, CA 94102"
    },
    "NEX-20260720": {
      status: "Delivered",
      statusClass: "delivered",
      steps: [
        { text: "Order Confirmed", desc: "Your order has been placed successfully.", time: "Jul 16, 2026 — 11:00 AM", done: true },
        { text: "Processing", desc: "Your order is being prepared for shipment.", time: "Jul 17, 2026 — 8:30 AM", done: true },
        { text: "Shipped", desc: "Your package is on its way to you.", time: "Jul 18, 2026 — 3:20 PM", done: true },
        { text: "Out for Delivery", desc: "Your package is out for delivery today.", time: "Jul 20, 2026 — 8:00 AM", done: true },
        { text: "Delivered", desc: "Left at front door.", time: "Jul 20, 2026 — 2:15 PM", done: true, active: true }
      ],
      carrier: "UPS Ground",
      tracking: "1Z999AA10123456784",
      eta: "Jul 20, 2026",
      address: "Jane Smith<br>456 Oak Avenue<br>New York, NY 10001"
    },
    "NEX-20260718": {
      status: "Processing",
      statusClass: "processing",
      steps: [
        { text: "Order Confirmed", desc: "Your order has been placed successfully.", time: "Jul 18, 2026 — 5:45 PM", done: true },
        { text: "Processing", desc: "Your order is being prepared for shipment.", time: "Jul 19, 2026 — 10:00 AM", done: true, active: true },
        { text: "Shipped", desc: "Your package is on its way to you.", time: "", done: false },
        { text: "Out for Delivery", desc: "Your package is out for delivery today.", time: "", done: false },
        { text: "Delivered", desc: "Your package has been delivered.", time: "", done: false }
      ],
      carrier: "Pending",
      tracking: "—",
      eta: "Jul 28, 2026",
      address: "Alex Johnson<br>789 Pine Road<br>Austin, TX 73301"
    }
  };

  function showTracking(orderId) {
    const normalizedId = orderId.trim().toUpperCase();
    const order = demoOrders[normalizedId];

    if (!order) {
      showToast("Order not found. Please check your order number.", "error");
      return;
    }

    document.getElementById("tracking-order-id").textContent = "Order #" + normalizedId;
    const badge = document.getElementById("tracking-status-badge");
    badge.textContent = order.status;
    badge.className = "tracking-status-badge " + order.statusClass;

    const timeline = trackingResult.querySelector(".tracking-timeline");
    timeline.innerHTML = order.steps.map(step => `
      <div class="tracking-step ${step.done ? 'completed' : ''} ${step.active ? 'active' : ''}">
        <div class="tracking-step-dot"></div>
        <div class="tracking-step-content">
          <h4>${step.text}</h4>
          <p>${step.desc}</p>
          ${step.time ? '<span class="tracking-step-time">' + step.time + '</span>' : ''}
        </div>
      </div>
    `).join("");

    const details = trackingResult.querySelector(".tracking-details");
    details.innerHTML = `
      <div class="tracking-detail-card">
        <h4>Shipping Details</h4>
        <p><strong>Carrier:</strong> ${order.carrier}</p>
        <p><strong>Tracking #:</strong> ${order.tracking}</p>
        <p><strong>Estimated Delivery:</strong> ${order.eta}</p>
      </div>
      <div class="tracking-detail-card">
        <h4>Shipping Address</h4>
        <p>${order.address}</p>
      </div>
    `;

    trackingResult.style.display = "block";
    trackingResult.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (trackingForm) {
    trackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = trackingInput.value.trim();
      if (!value) {
        showToast("Please enter an order number.", "error");
        return;
      }
      showTracking(value);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const orderId = chip.getAttribute("data-order");
      trackingInput.value = orderId;
      showTracking(orderId);
    });
  });
}

function initReturnsForm() {
  const returnsForm = document.getElementById("returns-form");
  const returnsSuccess = document.getElementById("returns-success");

  if (returnsForm) {
    returnsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const order = document.getElementById("return-order").value.trim();
      const email = document.getElementById("return-email").value.trim();
      const reason = document.getElementById("return-reason").value;

      if (!order || !email || !reason) {
        showToast("Please fill in all required fields.", "error");
        return;
      }

      returnsForm.style.display = "none";
      returnsSuccess.style.display = "block";
      showToast("Return request submitted successfully!");
    });
  }
}

function initFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  const filterBtns = document.querySelectorAll(".faq-filter-btn");
  const faqItems = document.querySelectorAll(".faq-item");

  faqQuestions.forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      faqItems.forEach(i => i.classList.remove("open"));
      faqQuestions.forEach(btn => btn.setAttribute("aria-expanded", "false"));

      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-faq-filter");

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      faqItems.forEach(item => {
        const category = item.getAttribute("data-faq-category");
        if (filter === "all" || category === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
          item.classList.remove("open");
        }
      });
    });
  });
}

function initSupportSearch() {
  const searchInput = document.getElementById("support-search");
  if (!searchInput) return;

  const searchableContent = [
    { id: "my-account", keywords: ["account", "login", "sign in", "register", "profile", "password", "email"] },
    { id: "order-tracking", keywords: ["track", "order", "tracking", "shipment", "delivery", "shipping", "package"] },
    { id: "returns", keywords: ["return", "exchange", "refund", "money back", "send back", "defective", "damaged"] },
    { id: "faq", keywords: ["faq", "question", "answer", "help", "how to", "payment", "cancel", "modify"] },
    { id: "product-support", keywords: ["support", "technical", "setup", "troubleshoot", "warranty", "repair", "firmware", "contact", "phone", "email", "chat"] }
  ];

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) return;

    const match = searchableContent.find(item =>
      item.keywords.some(kw => kw.includes(query) || query.includes(kw))
    );

    if (match) {
      const section = document.getElementById(match.id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchInput.dispatchEvent(new Event("input"));
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contact-support-form");
  const success = document.getElementById("contact-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const subject = document.getElementById("contact-subject").value.trim();
      const message = document.getElementById("contact-message").value.trim();

      if (!name || !email || !subject || !message) {
        showToast("Please fill in all fields.", "error");
        return;
      }

      form.style.display = "none";
      form.previousElementSibling.style.display = "none";
      form.previousElementSibling.previousElementSibling.style.display = "none";
      success.style.display = "block";
      showToast("Message sent successfully!");
    });
  }
}

function initLiveChat() {
  const chatBtn = document.getElementById("live-chat-btn");
  if (!chatBtn) return;

  const widget = document.createElement("div");
  widget.className = "live-chat-widget";
  widget.innerHTML = `
    <div class="live-chat-window" id="live-chat-window">
      <div class="live-chat-header">
        <div>
          <h4>NEXORA Support</h4>
          <p>We typically reply within minutes</p>
        </div>
        <button class="live-chat-close" id="live-chat-close" aria-label="Close chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="live-chat-messages" id="live-chat-messages">
        <div class="live-chat-msg bot">Hi there! How can we help you today?</div>
      </div>
      <div class="live-chat-input-area">
        <input type="text" id="live-chat-input" placeholder="Type a message..." aria-label="Chat message">
        <button class="live-chat-send" id="live-chat-send" aria-label="Send message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
    <button class="live-chat-btn" id="live-chat-toggle" aria-label="Open live chat">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  const chatWindow = document.getElementById("live-chat-window");
  const chatToggle = document.getElementById("live-chat-toggle");
  const chatClose = document.getElementById("live-chat-close");
  const chatMessages = document.getElementById("live-chat-messages");
  const chatInput = document.getElementById("live-chat-input");
  const chatSend = document.getElementById("live-chat-send");

  const botReplies = [
    "Thanks for reaching out! Could you tell us more about your issue?",
    "I understand. Let me look into that for you.",
    "Great question! Our team can help with that. Can you provide your order number?",
    "You can find detailed instructions in our Product Support section above.",
    "For urgent issues, please call us at +1 (800) 123-4567. We're here to help!",
    "I've noted your concern. A support agent will follow up via email within 2 hours.",
    "Is there anything else I can help you with today?",
    "Thanks for chatting with us! Have a great day."
  ];

  let replyIndex = 0;

  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = "live-chat-msg " + type;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    setTimeout(() => {
      addMessage(botReplies[replyIndex % botReplies.length], "bot");
      replyIndex++;
    }, 800 + Math.random() * 1200);
  }

  chatBtn.addEventListener("click", () => {
    chatToggle.click();
  });

  chatToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("open");
    if (chatWindow.classList.contains("open")) {
      chatInput.focus();
    }
  });

  chatClose.addEventListener("click", () => {
    chatWindow.classList.remove("open");
  });

  chatSend.addEventListener("click", sendUserMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendUserMessage();
    }
  });
}
