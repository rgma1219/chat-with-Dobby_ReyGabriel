import { router } from "./router.js";

// Cambia la URL sin recargar la página y renderiza la vista correspondiente.
export function navigateTo(path) {
  history.pushState(null, "", path);
  router();
}

// Intercepta los clicks en cualquier <a> interno del documento para que
// naveguen vía History API en lugar de disparar una recarga completa.
export function setupLinkInterception() {
  document.addEventListener("click", (event) => {
    // 1. Buscar el <a> más cercano (puede estar dentro de un <span>, ícono, etc).
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // 2. Casos donde NO queremos interceptar (dejamos el comportamiento nativo):

    // Click con modificadores = el usuario quiere abrir en otra pestaña/ventana.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    // Link explícitamente pensado para abrir en una pestaña nueva.
    if (link.target === "_blank") return;

    // Link a otro dominio (no es una ruta interna de la SPA).
    if (link.origin !== window.location.origin) return;

    // Anclas internas o protocolos especiales.
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    // 3. Si llegamos hasta acá, es un link interno de la SPA: interceptamos.
    event.preventDefault();
    navigateTo(href);
  });
}
