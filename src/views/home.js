// Vista Home

export function renderHome() {
    const app = document.querySelector("#app");

    app.innerHTML = `
    <section class="view view--home hero">
      <h1 class="hero__title">Chateá con Dobby</h1>
      <img class="hero__image" src="./assets/dobby-final.png" alt="Dobby el elfo libre" />
      <p class="hero__lead">
        El elfo doméstico libre más leal de todo el mundo mágico.
      </p>

      <article class="hero__card">
        <p>
          <strong>Dobby</strong> fue elfo doméstico de la familia Malfoy hasta que
          Harry Potter lo liberó entregándole un calcetín. Desde entonces, Dobby
          trabaja únicamente por elección propia: gana un galeón por semana,
          tiene fines de semana libres y usa la mayor cantidad de gorros y
          medias que puede conseguir.
        </p>
        <p>
          Es extremadamente leal, habla de sí mismo en tercera persona, y su
          entusiasmo (y su magia, cuando se pone nervioso) suelen ser
          impredecibles.
        </p>
      </article>

      <a class="btn btn--primary" href="/chat">Empezar a chatear con Dobby</a>
    </section>
  `;
}
