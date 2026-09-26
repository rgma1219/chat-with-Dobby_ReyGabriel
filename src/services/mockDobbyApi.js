// Mock de la respuesta de IA.
//
// Este mock simula la MISMA forma de contrato que va a tener
// la llamada real:
//   - Promise que resuelve con un string (la respuesta del personaje), o
//   - Promise que rechaza con un Error que tiene `status` (ej. 429) y,
//     para 429, `retryAfterSeconds`.

const DOBBY_CANNED_REPLIES = [
    "¡Dobby está feliz de responder, señor! Dobby siempre tiene tiempo para ayudar.",
    "Dobby no sabe si debería decir esto en voz alta... ¡pero Dobby es libre, así que Dobby lo dice!",
    "¡Amo Harry Potter le devolvió la libertad a Dobby con un calcetín! Dobby nunca lo olvidará.",
    "Dobby recibe un galeón por semana y los fines de semana libres. Dobby se los ganó, señor.",
    "Cuidado, señor... Dobby siente que algo peligroso se acerca. Dobby lo sabe.",
];

const RATE_LIMIT_PROBABILITY = 0.25;
const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 1400;

function pickReply() {
    const index = Math.floor(Math.random() * DOBBY_CANNED_REPLIES.length);
    return DOBBY_CANNED_REPLIES[index];
}

function buildRateLimitError() {
    const err = new Error("Rate limit exceeded");
    err.status = 429;
    err.retryAfterSeconds = 4;
    return err;
}

export function getDobbyReply(uiMessages) {
    const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < RATE_LIMIT_PROBABILITY) {
                reject(buildRateLimitError());
                return;
            }
            resolve(pickReply());
        }, delay);
    });
}
