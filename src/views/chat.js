// Vista Chat

export function renderChat() {
    const app = document.querySelector("#app");

    app.innerHTML = `
    <div class="chatApp">
      <header class="chatHeader">
        <h1 class="chatHeader__title">Chat con Dobby</h1>
        <p class="chatHeader__subtitle">El elfo libre está listo para ayudar</p>
      </header>

      <main class="chatMessages" aria-label="Mensajes">
        <div class="message message--character">
          ¡Dobby está feliz de conocerlo, señor! ¿En qué puede ayudarlo Dobby hoy?
        </div>
        <div class="message message--user">
          Hola Dobby, ¿quién es tu amo ahora?
        </div>
        <div class="message message--character">
          ¡Dobby no tiene amo! Dobby es un elfo libre, y Dobby elige ayudar
          porque quiere, ¡no porque deba!
        </div>
      </main>

      <form class="chatComposer">
        <input
          class="chatComposer__input"
          type="text"
          placeholder="Escribile algo a Dobby…"
          aria-label="Escribe tu mensaje"
        />
        <button class="chatComposer__send" type="submit">Enviar</button>
      </form>
    </div>
  `;
}
