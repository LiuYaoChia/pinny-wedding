// ✅ Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔐 Firebase config (replace with your actual config)
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

// 🔧 DOM Elements
const form = document.getElementById("msg-form");
const list = document.getElementById("msg-list");
const nickInput = document.getElementById("nickname");
const textInput = document.getElementById("message");
const removeBtn = document.getElementById("remove-latest");

// 🌐 Store Firebase keys and messages for deletion
let firebaseMessages = []; // Array of { key, msg }

// 📡 Listen for real-time updates from Firebase
onValue(messagesRef, snapshot => {
  const data = snapshot.val();
  list.innerHTML = ""; // Clear current UI
  firebaseMessages = []; // Clear keys

  if (!data) return;

  // Render messages from Firebase
  for (const key in data) {
    const msg = data[key];
    firebaseMessages.push({ key, msg });
    renderMessage(msg, false);
  }

  list.scrollTop = list.scrollHeight;
});

// ✏️ Handle form submission
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

  push(messagesRef, msg);
  textInput.value = "";
});

// ❌ Remove the latest message from Firebase
removeBtn.addEventListener("click", async () => {
  if (firebaseMessages.length === 0) return;

  const lastMessage = firebaseMessages[firebaseMessages.length - 1];
  await remove(ref(db, `messages/${lastMessage.key}`));
});

// 💬 Render a message in the message list
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
}

// 🎨 Generate a pastel color
function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
}

// 🛡️ Escape HTML
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

// 📷 QR Code generator
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

