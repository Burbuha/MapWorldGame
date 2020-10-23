const GamePage = {
  id: "game",
  title: "Карта Мира - Игры",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <div class= "game_container">  
          <div id = "map" class = "game_map"></div>
          <aside class="game_aside">
            <div id="time"></div>
            <div id="count"></div>
            <div id="task" class = "task"></div>
          </aside>
        </div>

      </section>
    `;
  },
};

export default GamePage;

/* <div id = "svgDiv" class="svgMap" style="display: block;">
            <object type="image/svg+xml" data="./img/map1.svg"></object>
          </div> */
