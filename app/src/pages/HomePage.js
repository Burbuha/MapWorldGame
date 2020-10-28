const HomePage = {
  id: "main",
  title: "Карта Мира - Главная",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <aside class="left">
          
        </aside>
        <div id="map" class="container"></div>
        <aside class="right">
          
        </aside>
      </section>
    `;
  },
};

export default HomePage;
