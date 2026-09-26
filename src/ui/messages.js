// Traduce errores técnicos (status HTTP, errores de red, etc.) a mensajes
// en lenguaje humano para mostrarle al usuario en la interfaz del chat.

export function getUserMessage(error) {
  if (error?.status === 429) {
    return "Dobby está muy solicitado ahora mismo. Probemos de nuevo en unos segundos.";
  }

  if (error?.status >= 500) {
    return "Algo se rompió del lado del servidor. Probá de nuevo en un momento.";
  }

  if (error?.name === "TypeError" && error.message?.includes("fetch")) {
    return "No pudimos conectar con el servidor. Revisá tu conexión a internet.";
  }

  return "Algo salió mal y Dobby no pudo responder. Probá de nuevo.";
}
