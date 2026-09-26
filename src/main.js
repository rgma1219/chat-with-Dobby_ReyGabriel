import { setupLinkInterception } from "./navigation.js";
import { router } from "./router.js";

// Interceptar clicks en links internos para navegar sin recargar la página.
setupLinkInterception();

// Botones back/forward del navegador: re-renderizar según la nueva URL.
window.addEventListener("popstate", router);

// Primer render, según la URL con la que se cargó la app.
router();
