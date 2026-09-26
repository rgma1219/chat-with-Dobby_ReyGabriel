// Evita envíos duplicados si el usuario clickea "Enviar" varias veces
// seguidas (doble click, tecla mantenida, etc).
export function debounce(fn, delay) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Promesa que se resuelve después de `ms` milisegundos.
// La usamos para simular latencia de red y para el countdown de reintento.
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
