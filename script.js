// 🧩 Import Firebase libraries at top-level
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔐 Firebase configuration (use your own!)
const firebaseConfig = {
  apiKey: "AIzaSyCLm14rMw4cfu05Nr4UGke4PaHVExAqBPM",
  authDomain: "pinny-c0821.firebaseapp.com",
  projectId: "pinny-c0821",
  storageBucket: "pinny-c0821.firebasestorage.app",
  messagingSenderId: "267528625996",
  appId: "1:267528625996:web:349d83b09740046dbb79e9"
};

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// DOM elements
const form = document.getElementById("msg-form");
const list = document.getElementById("msg-list");
const nickInput = document.getElementById("nickname");
const textInput = document.getElementById("message");
const removeBtn = document.getElementById("remove-latest");

// Track Firebase message keys (to know which to remove)
const firebaseMsgKeys = [];

// Load and render saved messages from localStorage
import { onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

onValue(messagesRef, snapshot => {
  list.innerHTML = ""; // Clear current messages
  const data = snapshot.val();
  if (!data) return;

  Object.values(data).forEach(msg => {
    renderMessage(msg, false);
  });
});

// Listen for new messages in Firebase
onChildAdded(messagesRef, snapshot => {
  const key = snapshot.key;
  const msg = snapshot.val();

  // Avoid rendering duplicates (if key already tracked)
  if (!firebaseMsgKeys.includes(key)) {
    firebaseMsgKeys.push(key);
    renderMessage(msg, false);
  }
});

// Unified form submit: push message to Firebase & save in localStorage
form.addEventListener("submit", e => {
  e.preventDefault();
  const nick = nickInput.value.trim() || "匿名";
  const text = textInput.value.trim();
  if (!text) return;

  const msg = {
    nick,
    text,
    time: new Date().toLocaleTimeString(),
    color: randomColor()
  };

  // Push message to Firebase
  push(messagesRef, msg).then(() => {
    // Update localStorage backup
    const saved = JSON.parse(localStorage.getItem("advancedMsgs") || "[]");
    saved.push(msg);
    localStorage.setItem("advancedMsgs", JSON.stringify(saved));
  });

  textInput.value = "";
});

// Remove latest message from localStorage, Firebase & UI
removeBtn.addEventListener("click", async () => {
  // Remove last from localStorage
  const saved = JSON.parse(localStorage.getItem("advancedMsgs") || "[]");
  if (saved.length > 0) {
    saved.pop();
    localStorage.setItem("advancedMsgs", JSON.stringify(saved));
  }

  // Remove last from Firebase by key
  if (firebaseMsgKeys.length > 0) {
    const lastKey = firebaseMsgKeys.pop();
    await remove(ref(db, `messages/${lastKey}`));
  }

  // Remove last message from UI
  const lastMessage = list.querySelector("li.msg-item:last-child");
  if (lastMessage) lastMessage.remove();
});

// Render a message in the message list
function renderMessage(msg, prepend) {
  const li = document.createElement("li");
  li.className = "msg-item";
  li.innerHTML = `
    <div class="msg-avatar" style="background-color: ${msg.color}">
      ${escapeHtml(msg.nick.charAt(0))}
    </div>
    <div class="msg-content">
      <div class="name">${escapeHtml(msg.nick)}</div>
      <div class="text">${escapeHtml(msg.text)}</div>
    </div>
  `;
  if (prepend) list.prepend(li);
  else list.appendChild(li);
  list.scrollTop = list.scrollHeight;
}

// Generate pastel HSL color string
function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

// Escape HTML special chars to prevent XSS
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

// QR code generation, delayed to wait for QRious and canvas
setTimeout(() => {
  const qrCanvas = document.getElementById("qr-code");
  if (qrCanvas && window.QRious) {
    new QRious({
      element: qrCanvas,
      value: 'https://liuyaochia.github.io/pinny-wedding/front-end-coding-learning/pinny.html',
      size: 120
    });
    console.log("QR Code generated:", 'https://liuyaochia.github.io/pinny-wedding/front-end-coding-learning/pinny.html');
  } else {
    console.warn("QRious not found or canvas missing");
  }
}, 100);
