import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

// Tabla de rutas: pathname -> función que renderiza esa vista dentro de #app.
// Agregar una vista nueva a futuro es tan simple como sumar una entrada acá.
const routes = {
  "/": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

// Lee la URL actual y dibuja la vista que corresponda.
// Se llama: 1) al cargar la app, 2) después de cada pushState (navigateTo),
// y 3) cuando el usuario usa los botones back/forward del navegador (popstate).
export function router() {
  const path = window.location.pathname;
  const render = routes[path] || renderNotFound;
  render();
}
