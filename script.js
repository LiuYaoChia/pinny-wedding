document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("msg-form");
  const list = document.getElementById("msg-list");
  const nickInput = document.getElementById("nickname");
  const textInput = document.getElementById("message");

  // Load saved messages from localStorage
  const saved = JSON.parse(localStorage.getItem("advancedMsgs") || "[]");
  saved.forEach(msg => renderMessage(msg, false));

  // Handle form submission
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nick = nickInput.value.trim() || "匿名";
    const text = textInput.value.trim();
    if (!text) return;

    const msg = {
      id: Date.now(),
      nick,
      text,
      time: new Date().toLocaleTimeString(),
      color: randomColor() // assign a color per message
    };

    saved.push(msg);
    localStorage.setItem("advancedMsgs", JSON.stringify(saved));

    renderMessage(msg, true);
    textInput.value = "";
  });

  // Render message with random avatar color
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

  // Generate a nice pastel color
  function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  }

  // Escape potentially dangerous input
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
  }
});
// Remove most recent message when button is clicked
document.getElementById("remove-latest").addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("advancedMsgs") || "[]");
  if (saved.length > 0) {
    saved.pop(); // Remove last item
    localStorage.setItem("advancedMsgs", JSON.stringify(saved));
    // Remove from UI
    const firstMessage = document.querySelector("#msg-list li");
    if (firstMessage) firstMessage.remove();
  }
});

// 🧩 Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔐 Your Firebase config (replace this with your own from the console)
const firebaseConfig = {
  apiKey: "AIzaSyCLm14rMw4cfu05Nr4UGke4PaHVExAqBPM",
  authDomain: "pinny-c0821.firebaseapp.com",
  projectId: "pinny-c0821",
  storageBucket: "pinny-c0821.firebasestorage.app",
  messagingSenderId: "267528625996",
  appId: "1:267528625996:web:349d83b09740046dbb79e9"
};


// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// DOM elements
const form = document.getElementById("msg-form");
const list = document.getElementById("msg-list");
const nickInput = document.getElementById("nickname");
const textInput = document.getElementById("message");

// Listen to new messages from Firebase
onChildAdded(messagesRef, snapshot => {
  const msg = snapshot.val();
  renderMessage(msg, snapshot.key);
});

// Handle form submission
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

  // Save to Firebase
  push(messagesRef, msg);
  textInput.value = "";
});

// Wait a short moment to ensure QRious is loaded
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
}, 100); // Wait 100ms to ensure canvas is in DOM