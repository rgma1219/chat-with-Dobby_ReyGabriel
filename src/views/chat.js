import { getDobbyReply } from "../services/aiClient.js";
import { debounce, wait } from "../services/debounce.js";
import { getUserMessage } from "../ui/messages.js";

// Estado del chat: una sola fuente de verdad para toda la vista.
// role de cada mensaje: "character" (Dobby) | "user".
const state = {
  messages: [
    {
      role: "character",
      text: "¡Hola, señor! Dobby está feliz de conocerlo. ¿En qué puede ayudarlo Dobby hoy?",
    },
  ],
  status: "idle", // 'idle' | 'loading' | 'error'
  error: null,
  retryCountdown: null, // segundos restantes cuando hay rate limit (429)
  lastUserMessage: null, // para poder reintentar el último envío fallido
};

function setState(updates) {
  Object.assign(state, updates);
  renderChat();
}

export function renderChat() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="chatApp">
      <header class="chatHeader">
        <h1 class="chatHeader__title">Chat con Dobby</h1>
        <p class="chatHeader__subtitle">El elfo libre está listo para ayudar</p>
      </header>

      <main class="chatMessages" id="chatMessages" aria-label="Mensajes">
        ${renderMessages()}
        ${renderStatus()}
      </main>

      <form class="chatComposer" id="chatComposer">
        <input
          class="chatComposer__input"
          id="chatInput"
          type="text"
          placeholder="Escribile algo a Dobby…"
          aria-label="Escribe tu mensaje"
          ${state.status === "loading" ? "disabled" : ""}
        />
        <button
          class="chatComposer__send"
          type="submit"
          ${state.status === "loading" ? "disabled" : ""}
        >
          Enviar
        </button>
      </form>
    </div>
  `;

  setupChat();
  scrollToBottom();
}

function renderMessages() {
  return state.messages
    .map((msg) => `<div class="message message--${msg.role}">${escapeHtml(msg.text)}</div>`)
    .join("");
}

function renderStatus() {
  if (state.status === "loading" && state.retryCountdown != null) {
    return `
      <div class="message message--character message--typing">
        Dobby espera para reintentar (${state.retryCountdown}s)...
      </div>
    `;
  }

  if (state.status === "loading") {
    return `<div class="message message--character message--typing">Dobby está escribiendo...</div>`;
  }

  if (state.status === "error") {
    return `
      <div class="message message--error">
        ${escapeHtml(state.error)}
        <button class="message__retry" id="retryBtn" type="button">Reintentar</button>
      </div>
    `;
  }

  return "";
}

// Evita inyección de HTML si el usuario escribe algo como "<img onerror=...>".
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function setupChat() {
  const $form = document.querySelector("#chatComposer");
  const $input = document.querySelector("#chatInput");
  const $retry = document.querySelector("#retryBtn");

  const debouncedSend = debounce(async () => {
    if (state.status === "loading") return;

    const text = $input.value.trim();
    if (!text) return;

    $input.value = "";
    await sendMessage(text);
  }, 200);

  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    debouncedSend();
  });

  $retry?.addEventListener("click", () => {
    if (state.lastUserMessage) {
      sendMessage(state.lastUserMessage, true);
    }
  });

  // Foco automático al entrar a la vista, para poder escribir de una.
  $input.focus();
}

// Orquesta un envío completo: agrega el mensaje del usuario (si no es un
// reintento), llama al servicio de IA (mock por ahora), y actualiza el
// estado según el resultado.
async function sendMessage(text, isRetry = false) {
  const nextMessages = isRetry ? state.messages : [...state.messages, { role: "user", text }];

  setState({
    messages: nextMessages,
    status: "loading",
    error: null,
    retryCountdown: null,
    lastUserMessage: isRetry ? state.lastUserMessage : text,
  });

  try {
    const reply = await getDobbyReply(nextMessages);
    setState({
      messages: [...nextMessages, { role: "character", text: reply }],
      status: "idle",
      error: null,
      lastUserMessage: null,
    });
  } catch (err) {
    // Caso especial: rate limit (429). Le mostramos al usuario una cuenta
    // regresiva y reintentamos automáticamente una vez, en vez de forzarlo
    // a apretar "Reintentar" enseguida.
    if (err.status === 429) {
      const seconds = err.retryAfterSeconds ?? 5;

      for (let s = seconds; s > 0; s--) {
        setState({ status: "loading", retryCountdown: s });
        await wait(1000);
      }

      try {
        setState({ status: "loading", retryCountdown: null });
        const reply = await getDobbyReply(nextMessages);
        setState({
          messages: [...nextMessages, { role: "character", text: reply }],
          status: "idle",
          error: null,
          lastUserMessage: null,
        });
        return;
      } catch (errAfterRetry) {
        setState({ status: "error", error: getUserMessage(errAfterRetry) });
        return;
      }
    }

    setState({ status: "error", error: getUserMessage(err) });
  }
}

function scrollToBottom() {
  const $messages = document.querySelector("#chatMessages");
  if ($messages) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}
