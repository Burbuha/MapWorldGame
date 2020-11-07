const GamePage = {
  id: "game",
  title: "Карта Мира - Игры",
  render: (className = "container", ...rest) => {
    return `
    <section class="${className}">
      <div class="game_container">
        <div id="map" class="game_map"></div>
        <aside class="game_aside">
          <div class="game_learn" >
            <div id="task" class="task"></div>
            <button id="modal-open" class="modal-open btn" title="Начать игру">НАЧАТЬ ИГРУ</button>
          </div>
          <div class="game_play" hidden>
            <div id="quest" class="quest">
            <div id = "gameTooltip" class = "countryTooltip"></div>
              <div class = "game-count">
                <div id ="timer" class="timer"></div>
                <div class="counter"></div>
                
              </div>
              <h2>Покажи на карте:</h2>
              <div class="question"></div>
              <div class="result">Для начала игры нажми "СТАРТ"</div>
            </div>
            <button id="start" class="start btn" title="Старт">СТАРТ</button><button id="stop" class="stop btn" title="Отмена" disabled>СТОП</button><button id="cancel" class="cancel btn" title="Выход">Выйти</button>
          </div>      
        </aside>
      </div>
      <div class="container-modal modal_closed">
        <div class="modal-overlay modal_closed" id="modal-overlay"></div>
        <div class="modal modal_closed" id="modal">
          <header class="modal_header">
            <a href="#" class="modal__close" id="modal-close" title="Закрыть модальное окно">Закрыть</a>
            <h2>Выберите режим игры:</h2>            
          </header>
          <main class="modal_content">
            <h3>Выберите уровень сложности:</h3>
            <form class = "modal_level">
            <input type="radio" name="level" value="easy" class = "level">Легкий<br> 
            <input type="radio" name="level" value="middle" class = "level">Средний<br>  
            <input type="radio" name="level" value="hard" class = "level">Сложный<br>
            </form> 
            <button id="modal-country" class="modal_game" title="Покажи страну на карте" disabled>
              Покажи страну на карте
            </button>
            <button id="modal-capital" class="modal_game" title="Покажи страну на карте по названию её столицы" disabled>
              Покажи страну на карте по названию её столицы
            </button>
            
          </main>
        </div>
      </div>
    </section>   
  `;
  },
};

export default GamePage;
