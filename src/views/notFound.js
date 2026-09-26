// Vista de fallback cuando la ruta no matchea ninguna entrada del router.

export function renderNotFound() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <section class="view view--notFound">
      <h1 class="view__title">404 — Dobby no encontró esta página</h1>
      <p class="view__text">
        ¡Dobby buscó por todas partes, señor, pero esta ruta no existe!
      </p>
      <a class="btn btn--primary" href="/">Volver al inicio</a>
    </section>
  `;
}
