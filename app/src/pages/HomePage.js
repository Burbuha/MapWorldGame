const HomePage = {
  id: "main",
  title: "Карта Мира - Главная",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <aside class="left">
          <button class="game" id="continents">Континенты и океаны</button>
          <button class="game" id="physical-map">Физическая карта мира</button>
          <button class="game" id="tectonic">Тектонические плиты</button>
        </aside>
        <div id="map" class="container"></div>
        <aside class="right">
          <button class="game" id="parts-world">Части света</button>
          <button class="game" id="counties">Страны</button>
          <button class="game" id="capitals">Столицы</button>
        </aside>
      </section>
    `;
  },
};

export default HomePage;
