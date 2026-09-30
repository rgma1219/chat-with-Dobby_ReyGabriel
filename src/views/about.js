// Vista About

export function renderAbout() {
    const app = document.querySelector("#app");

    app.innerHTML = `
    <section class="view view--about">
      <h1 class="view__title">Sobre este proyecto</h1>
      <p class="view__text">
        Esta es una prueba de concepto (POC) desarrollada para ComicSansCon:
        una Single Page Application que permite chatear con
        <strong>Dobby</strong>, el elfo doméstico libre de la saga de Harry
        Potter, usando inteligencia artificial.
      </p>

      <ul class="aboutList">
        <li class="aboutList__item">
          <strong>Personaje:</strong> Dobby, elfo libre — leal, entusiasta y
          un poco impredecible.
        </li>
        <li class="aboutList__item">
          <strong>Stack:</strong> HTML, CSS y JavaScript vanilla (ES Modules
          nativos, sin frameworks ni bundler).
        </li>
        <li class="aboutList__item">
          <strong>IA:</strong> Google Gemini, consumida de forma segura a
          través de una Vercel Serverless Function que actúa de proxy.
        </li>
        <li class="aboutList__item">
          <strong>Créditos:</strong> Desarrollado por Gabriel Rey. El personaje de Dobby pertenece a J.K. Rowling y Warner Bros.
        </li>
      </ul>
    </section>
  `;
}
