# Dobby Chat

Prueba de concepto (POC) desarrollada para **ComicSansCon**: una Single Page Application que permite chatear con **Dobby**, el elfo doméstico libre de la saga de _Harry Potter_, usando inteligencia artificial (Google Gemini).

**Autor:** Rey Gabriel — https://github.com/rgma1219

**Demo en vivo:** https://chat-with-dobby-rey-gabriel.vercel.app/

## El personaje: Dobby

Dobby fue elfo doméstico de la familia Malfoy hasta que Harry Potter lo liberó entregándole un calcetín. Desde entonces es un elfo libre: cobra un galeón por semana, tiene los fines de semana libres, y usa la mayor cantidad de gorros y medias que puede conseguir.

El personaje en el chat:

- Habla de sí mismo en tercera persona ("Dobby cree que...").
- Es extremadamente leal, entusiasta y agradecido.
- Se refiere a quien le habla como "señor" o "señora".
- Está orgulloso de su libertad y lo menciona seguido.
- Responde en frases cortas, apropiadas para un chat.

Su personalidad completa está definida en `src/services/prompts.js` (el system prompt que se le manda a Gemini).

## Stack técnico

- **JavaScript vanilla** con ES Modules nativos del navegador — sin frameworks ni bundler en el frontend.
- **Routing SPA** con History API (`src/router.js` + `src/navigation.js`).
- **Google Gemini** (`@google/genai`), consumido de forma segura mediante una **Vercel Serverless Function** (`api/chat.js`) que actúa de proxy — la API key nunca se expone en el cliente.
- **Vitest** para tests unitarios de transformación de payloads, cliente HTTP y mock de la API.
- **Vercel** para el deployment (estático + función serverless), sin paso de build.

## Requisitos y ejecución local

### 1. Clonar e instalar dependencias

```bash
git clone <url-de-este-repo>
cd dobby-chat
npm install
```

### 2. Configurar la variable de entorno

Este proyecto necesita una API key de Google Gemini:

1. Andá a [Google AI Studio](https://aistudio.google.com/apikey) e iniciá sesión con tu cuenta de Google.
2. Click en **Create API key** → **Create API key in new project**.
3. Copiá la key generada.

Luego, en la raíz del proyecto:

```bash
cp .env.example .env
```

Y completá `.env` con tu key real:

```
GEMINI_API_KEY=tu_key_real_aca
```

`.env` ya está en `.gitignore`: nunca se sube al repositorio.

### 3. Ejecutar localmente

Como el proyecto usa una Vercel Serverless Function (`api/chat.js`), se corre con la Vercel CLI, que simula ese entorno en local:

```bash
npx vercel dev
```

Va a pedir loguearse con Vercel la primera vez. Una vez levantado, la app queda disponible en la URL que indique la terminal (por defecto `http://localhost:3000`).

## Cómo ejecutar los tests

Instalá las dependencias del proyecto y ejecutá la suite:

```bash
npm install
npm test
```

Vitest descubre automáticamente los archivos `*.test.js`. Los tests del cliente simulan `fetch` y los del mock controlan sus temporizadores, por lo que no requieren una API key ni hacen llamadas de red.

Para ejecutar los tests en modo watch mientras desarrollás:

```bash
npm run test:watch
```

## Cómo desplegar a Vercel

1. Pusheá el repo a GitHub.
2. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con GitHub.
3. **Add New... → Project** y elegí este repositorio. Vercel detecta automáticamente que es un proyecto estático con funciones serverless en `/api` (no hace falta configurar build command).
4. Antes de deployar (o después, en **Settings → Environment Variables**), cargá `GEMINI_API_KEY` con tu key real, marcada para **Production**, **Preview** y **Development**.
5. Deploy.
6. Probá la URL pública: navegá `/`, `/chat` y `/about` (probá recargar estando en `/chat`), y mandale un mensaje real a Dobby.

Si algo falla, revisá los logs de la función en el dashboard de Vercel (proyecto → **Logs**, o el deployment → **Functions**).

## Capturas de pantalla

> 🚧 Pendiente: agregar capturas de las 3 vistas (Home, Chat, About) una vez desplegado.

## Aplicación desplegada

> 🚧 Pendiente: agregar el link público de Vercel una vez desplegado.

## Registro de uso de IA en el proyecto

Este proyecto se construyó con la asistencia de **Claude (Anthropic)**, usado como herramienta de desarrollo asistido por etapas — no como generador único de una solución completa.

Cómo se usó:

- **Planificación**: antes de escribir código, se definió junto con la IA un plan de trabajo dividido en etapas, cada una mapeada a los criterios de la rúbrica de evaluación, para poder hacer commits atómicos y funcionales.
- **Elección del personaje**: se descartó una primera idea (una persona real y famosa) porque no cumplía con la consigna de "personaje ficticio" y por los riesgos de atribuirle declaraciones inventadas a una persona real; se optó por Dobby en su lugar.
- **Generación de código por etapa**: estructura base, routing SPA, UI del chat (primero contra un mock local, después contra la API real), capa de fetch/transformación de datos, y la Serverless Function de Gemini.
- **Decisiones técnicas revisadas críticamente, no aceptadas a ciegas**: por ejemplo, se corrigió a la IA cuando propuso usar `@google/generative-ai` (paquete discontinuado desde 2025) por el SDK vigente `@google/genai`, y se ajustó el modelo usado a un alias (`gemini-flash-lite-latest`) para evitar depender de una versión con fecha de baja anunciada.
- **Revisión manual del código generado**: se leyó, se probó y se corrigieron manualmente comentarios y estilo antes de cada commit (se sacaron referencias internas a "etapas" del código fuente, se simplificó el README intermedio, etc.).
- **Uso previsto para los tests unitarios** (Vitest): pendiente de completar.
- **Tests unitarios**: se usa Vitest para validar la transformación de mensajes, las respuestas del mock y el cliente HTTP con respuestas simuladas.

La lógica de negocio, la revisión de cada entrega y las decisiones finales fueron responsabilidad del desarrollador del proyecto.
