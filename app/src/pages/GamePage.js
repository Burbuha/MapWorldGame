const GamePage = {
  id: "game",
  title: "Карта Мира - Игры",
  render: (className = "container", ...rest) => {
    return `
    <section class="${className}">           
        <div id="map" class="game-map"></div>
        <aside class="game-aside">
          <div class="game-learn">
            <div id="task" class="task"></div>
            <button id="modal-open" class="modal-open btn" title="Начать игру">НАЧАТЬ ИГРУ</button>
          </div>
          <div class="game-play" hidden>
            <div id="quest" class="quest">
            <div id = "gameTooltip" class = "countryTooltip"></div>
              
              <h2>Покажи на карте:</h2>
              <div class="question"></div>
              <div class = "game-count">
                <div id ="timer" class="timer"></div>
                <div class="counter"></div>
                
              </div>
              <div class="result">Для начала игры нажми "СТАРТ", для&nbsp;остановки игры - "СТОП", для&nbsp;отмены - "ВЫЙТИ".</div>
            </div>
            <button id="start" class="start btn" title="Старт">СТАРТ</button><button id="stop" class="stop btn" title="Отмена" disabled>СТОП</button><button id="cancel" class="cancel btn" title="Выход">Выйти</button>
          </div> 
          <div class = "soundOn"><input id="soundOn" type="checkbox" name="soundOn" checked="checked"><label for="soundOn">&nbsp;Звук</label></div>     
        </aside>
      
      
      <div class="container-modal modal__closed">
        <div class="modal-overlay modal__closed" id="modal-overlay"></div>
        
        <div class="modal modal__closed" id="modal">
          <div class="modal_header">
            <a href="#" class="modal_close" id="modal-close" title="Закрыть модальное окно">Закрыть</a>
            <h2>Выберите режим игры:</h2>            
          </div>
          <div class="modal_content">
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
          </div>        
        </div>
      
        <div class="modal modal__closed" id="modalResult">
          <div class="modal_header">
            <a href="#" class="modal_close" id="modalResult-close" title="Закрыть модальное окно">Закрыть</a>
            <h2>Ваш результат:</h2>            
          </div>
          <div class="modalResult_content"></div>
        </div>

        <div class="modal modal__closed" id="modalAttention">
          <div class="modal_header">
            <a href="#" class="modal_close" id="modalAttention-close" title="Закрыть модальное окно">Закрыть</a>
            <h2>Внимание!</h2>            
          </div>
          <div class="modalAttention_content"><h3>Вы не авторизовались!</h3><h4>Результаты игры сохранены не будут!</h4></div>
          <button id="modalAttention-continue" class="modalAttention-continue" title="Продолжить">Продолжить</button>
        </div>
      
      
     

    </section>   
  `;
  },
};

export default GamePage;
