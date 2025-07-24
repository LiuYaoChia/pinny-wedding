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
// Generate QR code for current URL
const qr = new QRious({
  element: document.getElementById('qr-code'),
  value: 'https://liuyaochia.github.io/pinny-wedding/front-end-coding-learning/pinny.html',
  size: 120
});
